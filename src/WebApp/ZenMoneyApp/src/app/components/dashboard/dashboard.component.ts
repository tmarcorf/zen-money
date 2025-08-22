import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import _moment, { Moment } from 'moment';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';

const moment = _moment;

export const MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: false,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
    ]
})
export class DashboardComponent implements OnInit{
    date = new FormControl(moment());
    startDate = moment();

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        // toda vez que a data mudar, chama o serviço
        this.date.valueChanges.subscribe((val: Moment | null) => {
        if (val) {
            const month = val.month() + 1; // moment é zero-based
            const year = val.year();

            this.dashboardService
            .getIncomesAndExpensesAmountPerMonth(month, year)
            .subscribe({
                next: (res) => {
                console.log('Resposta da API:', res);
                // aqui você pode salvar em uma propriedade e usar no template
                },
                error: (err) => {
                console.error('Erro ao buscar dados do dashboard', err);
                }
            });
        }
        });

        this.triggerInitialLoad();
    }

    private triggerInitialLoad() {
        const val = this.date.value;

        if (val) {
        const month = val.month() + 1;
        const year = val.year();
        this.dashboardService.getIncomesAndExpensesAmountPerMonth(month, year).subscribe({
            next: (res) => console.log('Carga inicial:', res),
            error: (err) => console.error(err)
        });
        }
    }

    // Pega o mês (1–12)
    get month(): number | null {
        return this.date.value ? this.date.value.month() + 1 : null;
    }

    // Pega o ano (ex: 2025)
    get year(): number | null {
        return this.date.value ? this.date.value.year() : null;
    }

    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value!;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
    }

    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value!;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        datepicker.close();
    }

    nextMonth() {
        if (this.date.value) {
            const ctrlValue = this.date.value.clone(); // evita mutar diretamente
            ctrlValue.add(1, 'month');
            this.date.setValue(ctrlValue);
        }
    }

    previousMonth() {
        if (this.date.value) {
            const ctrlValue = this.date.value.clone();
            ctrlValue.subtract(1, 'month');
            this.date.setValue(ctrlValue);
        }
    }
}

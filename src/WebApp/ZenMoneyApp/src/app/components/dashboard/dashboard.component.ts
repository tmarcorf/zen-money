import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import _moment, { Moment } from 'moment';
import { DashboardService } from '../../services/dashboard.service';
import { IncomesAndExpensesModel } from '../../responses/dashboard/incomes-and-expenses.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ExpensesByCategoryModel } from '../../responses/dashboard/expenses-by-category.model';

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
    incomesVersusExpensesData!: IncomesAndExpensesModel;
    expensesByCategoryData!: ExpensesByCategoryModel[];
    date = new FormControl(moment(), Validators.required);

    get month(): number | null {
        return this.date.value ? this.date.value.month() + 1 : null;
    }

    get year(): number | null {
        return this.date.value ? this.date.value.year() : null;
    }

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.date.valueChanges.pipe(
            debounceTime(100),
            distinctUntilChanged(),
        )
        .subscribe(value => {
            this.updateIncomesAndExpensesDashboard(value);
            this.updateExpensesByCategoryDashboard(value);
        });

        this.triggerInitialLoad();
    }

    private triggerInitialLoad() {
        const val = this.date.value;

        this.updateIncomesAndExpensesDashboard(val);
        this.updateExpensesByCategoryDashboard(val);
    }

    updateIncomesAndExpensesDashboard(val: Moment | null) {
        if (val) {
            const month = this.month ?? 0
            const year = this.year ?? 0;
            this.dashboardService.getIncomesAndExpensesAmountPerMonth(month, year).subscribe({
                next: (response) => {
                    this.incomesVersusExpensesData = response.data;
                }
            });
        }
    }

    updateExpensesByCategoryDashboard(val: Moment | null) {
        if (val) {
            const month = this.month ?? 0
            const year = this.year ?? 0;
            this.dashboardService.getExpensesByCategoryByMonth(month, year).subscribe({
                next: (response) => {
                    this.expensesByCategoryData = response.data;
                }
            });
        }
    }

    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value!;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
    }

    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        this.date.setValue(normalizedMonth);
        datepicker.close();
    }

    previousMonth() {
        if (this.date.value) {
            const ctrlValue = this.date.value.clone();
            ctrlValue.subtract(1, 'month');
            this.date.setValue(ctrlValue);
        }
    }

    nextMonth() {
        if (this.date.value) {
            const ctrlValue = this.date.value.clone();
            ctrlValue.add(1, 'month');
            this.date.setValue(ctrlValue);
        }
    }
}

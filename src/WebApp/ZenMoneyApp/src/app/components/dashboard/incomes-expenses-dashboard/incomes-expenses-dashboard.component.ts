import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IncomesAndExpensesModel } from '../../../responses/dashboard/incomes-and-expenses.model';

@Component({
  selector: 'app-incomes-expenses-dashboard',
  standalone: false,
  templateUrl: './incomes-expenses-dashboard.component.html',
  styleUrl: './incomes-expenses-dashboard.component.scss'
})
export class IncomesExpensesDashboardComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    public pieChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      
      plugins: {
        legend: {
            display: true,
            position: 'top',
        }
        
        },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Entradas', 'Gastos'],
    
    datasets: [
      {
        data: [300, 500],
      },
    ],
  };
  
  public pieChartType: ChartType = 'pie';

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  addSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.push(['Line 1', 'Line 2', 'Line 3']);
    }

    this.pieChartData.datasets[0].data.push(400);

    this.chart?.update();
  }

  removeSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.pop();
    }

    this.pieChartData.datasets[0].data.pop();

    this.chart?.update();
  }

  changeLegendPosition(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.position =
        this.pieChartOptions.plugins.legend.position === 'left'
          ? 'top'
          : 'left';
    }

    this.chart?.render();
  }

  toggleLegend(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.display =
        !this.pieChartOptions.plugins.legend.display;
    }

    this.chart?.render();
  }

  updateChart(incomesExpensesModel: IncomesAndExpensesModel) {
    
  }
}

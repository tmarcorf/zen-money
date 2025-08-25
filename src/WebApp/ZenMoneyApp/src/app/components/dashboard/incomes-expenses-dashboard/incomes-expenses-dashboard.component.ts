import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { IncomesAndExpensesModel } from '../../../responses/dashboard/incomes-and-expenses.model';

@Component({
  selector: 'app-incomes-expenses-dashboard',
  standalone: false,
  templateUrl: './incomes-expenses-dashboard.component.html',
  styleUrl: './incomes-expenses-dashboard.component.scss'
})
export class IncomesExpensesDashboardComponent implements OnChanges {
  @Input() data!: IncomesAndExpensesModel;

  pieChartType: ChartType = 'doughnut';

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            if (!data.labels || !data.datasets.length) {
              return [];
            }

            const dataset = data.datasets[0];
            const meta = chart.getDatasetMeta(0);

            return data.labels.map((label, i) => {
              const value = dataset.data[i] as number;
              const arc: any = meta.data[i];
              
              return {
                text: `${label}: R$ ${value.toLocaleString('pt-BR')}`,
                fillStyle: (dataset.backgroundColor as string[] | undefined)?.[i] || '#000',
                strokeStyle: '#fff',
                lineWidth: 2,
                hidden: arc && arc.hidden,
                index: i,
              };
            });
          }
        }
      }
    }
  };

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Entradas', 'Gastos'],
    datasets: [
      {
        data: [0, 0],
      },
    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChart(this.data);
    }
  }

  updateChart(incomesExpensesModel: IncomesAndExpensesModel) {
    this.pieChartData = {
      labels: ['Entradas', 'Gastos'],
      datasets: [
        {
          data: [
            incomesExpensesModel.currentAmountIncomes,
            incomesExpensesModel.currentAmountExpenses,
          ],
        },
      ],
    };
  }
}

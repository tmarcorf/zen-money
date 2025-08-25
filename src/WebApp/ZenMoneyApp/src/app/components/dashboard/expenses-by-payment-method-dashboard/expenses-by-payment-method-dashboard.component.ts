import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ExpensesByPaymentMethodModel } from '../../../responses/dashboard/expenses-by-payment-method.model';

@Component({
  selector: 'app-expenses-by-payment-method-dashboard',
  standalone: false,
  templateUrl: './expenses-by-payment-method-dashboard.component.html',
  styleUrl: './expenses-by-payment-method-dashboard.component.scss'
})
export class ExpensesByPaymentMethodDashboardComponent {
  @Input() data!: ExpensesByPaymentMethodModel[];

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
                text: `${label}:\nR$ ${value.toLocaleString('pt-BR')}`,
                fillStyle: (dataset.backgroundColor as string[] | undefined)?.[i] || '#000',
                strokeStyle: '#fff',
                lineWidth: 2,
                hidden: arc?.hidden ?? false,
                index: i,
              };
            });
          }
        }
      }
    }
  };

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChart(this.data);
    }
  }

  updateChart(data: ExpensesByPaymentMethodModel[]) {
    this.pieChartData = {
      labels: this.data.map(x => x.paymentMethod.description),
      datasets: [
        {
          data: data.map(x => x.totalAmount),
        },
      ],
    };
  }
}

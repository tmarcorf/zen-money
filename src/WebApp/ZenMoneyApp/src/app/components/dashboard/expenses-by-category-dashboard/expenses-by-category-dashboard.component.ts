import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ExpensesByCategoryModel } from '../../../responses/dashboard/expenses-by-category.model';

@Component({
  selector: 'app-expenses-by-category-dashboard',
  standalone: false,
  templateUrl: './expenses-by-category-dashboard.component.html',
  styleUrl: './expenses-by-category-dashboard.component.scss'
})
export class ExpensesByCategoryDashboardComponent {
  @Input() data!: ExpensesByCategoryModel[];

  pieChartType: ChartType = 'pie';

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
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

  updateChart(data: ExpensesByCategoryModel[]) {
    this.pieChartData = {
      labels: this.data.map(x => x.category.name),
      datasets: [
        {
          data: data.map(x => x.totalAmount),
        },
      ],
    };
  }
}

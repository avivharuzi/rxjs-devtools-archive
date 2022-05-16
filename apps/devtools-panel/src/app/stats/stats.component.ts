import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'devtools-panel-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | null = null;

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  barChartPlugins: any = [DataLabelsPlugin];

  barChartData: ChartData<'bar'> = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  public randomize(): void {
    // Only Change 3 values
    // this.barChartData.datasets[0].data = [
    //   Math.round(Math.random() * 100),
    //   59,
    //   80,
    //   Math.round(Math.random() * 100),
    //   56,
    //   Math.round(Math.random() * 100),
    //   40,
    // ];
    //
    // this.chart?.update();
  }
}

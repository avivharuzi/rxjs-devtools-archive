import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Subject, takeUntil, tap } from 'rxjs';

import { ChartData, ChartOptions } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

import { StoreService } from '../store/store.service';

@Component({
  selector: 'devtools-panel-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent implements OnInit, OnDestroy {
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
    labels: [
      'Next',
      'Error',
      'Complete',
      'Subscribe',
      'Unsubscribe',
      'Active Subscriptions',
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(234, 179, 8, 0.2)',
          'rgba(239, 68, 68, 0.2)',
          'rgba(34, 197, 94, 0.2)',
          'rgba(6, 182, 212, 0.2)',
          'rgba(115, 115, 115, 0.2)',
          'rgba(59, 130, 246, 0.2)',
        ],
        borderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(115, 115, 115, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        hoverBackgroundColor: [
          'rgba(234, 179, 8, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(6, 182, 212, 0.6)',
          'rgba(115, 115, 115, 0.6)',
          'rgba(59, 130, 246, 0.6)',
        ],
        hoverBorderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(115, 115, 115, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  private destroySubject = new Subject<void>();

  constructor(private readonly storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.stats$
      .pipe(
        takeUntil(this.destroySubject),
        tap((stats) => {
          if (!this.barChartData.datasets[0]) {
            return;
          }

          this.barChartData.datasets[0].data = [
            stats.next,
            stats.error,
            stats.complete,
            stats.subscribe,
            stats.unsubscribe,
            stats.activeSubscriptions,
          ];

          this.chart?.update();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
  }
}

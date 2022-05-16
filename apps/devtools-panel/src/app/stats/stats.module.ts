import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgChartsModule } from 'ng2-charts';

import { StatsComponent } from './stats.component';

@NgModule({
  imports: [CommonModule, NgChartsModule],
  declarations: [StatsComponent],
  exports: [StatsComponent],
})
export class StatsModule {}

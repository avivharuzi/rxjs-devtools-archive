import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ObservablesComponent } from './observables.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ObservablesComponent],
  exports: [ObservablesComponent],
})
export class ObservablesModule {}

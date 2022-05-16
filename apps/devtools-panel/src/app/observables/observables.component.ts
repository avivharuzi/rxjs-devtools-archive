import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'devtools-panel-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservablesComponent {}

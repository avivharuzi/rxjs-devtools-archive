import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'devtools-panel-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {}

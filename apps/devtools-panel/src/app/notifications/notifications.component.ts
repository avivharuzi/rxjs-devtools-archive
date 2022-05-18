import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Subject, tap } from 'rxjs';

import { ChromeExtensionMessageNotification } from '@rxjs-devtools/common';

import { StoreService } from '../store/store.service';

@Component({
  selector: 'devtools-panel-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'observableType',
    'notificationType',
    'notificationTypeTime',
    'tag',
    'value',
    'error',
    'timestamp',
  ];
  dataSource = new MatTableDataSource<ChromeExtensionMessageNotification>([]);

  private destroySubject = new Subject<void>();

  constructor(
    private readonly storeService: StoreService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.storeService.notifications$
      .pipe(
        tap((notifications) => {
          this.dataSource.data = notifications;
          this.cd.detectChanges();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

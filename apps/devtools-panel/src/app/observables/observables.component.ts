import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Subject, takeUntil, tap } from 'rxjs';

import { ObservableRefItem } from '@rxjs-devtools/common';

import { StoreService } from '../store/store.service';

@Component({
  selector: 'devtools-panel-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservablesComponent implements OnInit, OnDestroy {
  displayedColumns = ['id', 'tag', 'type', 'debug'];
  dataSource = new MatTableDataSource<ObservableRefItem>([]);

  private destroySubject = new Subject<void>();

  constructor(
    private readonly storeService: StoreService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.storeService.observables$
      .pipe(
        takeUntil(this.destroySubject),
        tap((observables) => {
          this.dataSource.data = observables;
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

  debugObservable(id: string): void {
    this.storeService.debugObservable(id);
  }
}

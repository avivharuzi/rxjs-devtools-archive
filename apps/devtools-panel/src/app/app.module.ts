import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { NotificationsModule } from './notifications/notifications.module';
import { ObservablesModule } from './observables/observables.module';
import { StatsModule } from './stats/stats.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgChartsModule.forRoot(),
    NotificationsModule,
    ObservablesModule,
    StatsModule,
    MatTabsModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

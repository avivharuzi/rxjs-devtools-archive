import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { NotificationsModule } from './notifications/notifications.module';
import { ObservablesModule } from './observables/observables.module';
import { StatsModule } from './stats/stats.module';
import { StoreService } from './store/store.service';

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
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (storeService: StoreService) => {
        return () => {
          return storeService.init();
        };
      },
      multi: true,
      deps: [StoreService],
    },
  ],
})
export class AppModule {}

import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import {
  ChromeExtensionMessage,
  ChromeExtensionMessageNotification,
  ChromeExtensionMessageObservables,
  ChromeExtensionMessageStats,
  ChromeExtensionMessageType,
} from '@rxjs-devtools/common';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private backgroundConnection = chrome.runtime.connect({
    name: `panel@${chrome.devtools.inspectedWindow.tabId}`,
  });

  private statsSubject = new BehaviorSubject<ChromeExtensionMessageStats>({
    complete: 0,
    error: 0,
    next: 0,
    subscribe: 0,
    unsubscribe: 0,
  });

  private notificationsSubject = new BehaviorSubject<
    ChromeExtensionMessageNotification[]
  >([]);

  private observablesSubject =
    new BehaviorSubject<ChromeExtensionMessageObservables>([]);

  get stats$() {
    return this.statsSubject.asObservable();
  }

  get notifications$() {
    return this.notificationsSubject.asObservable();
  }

  get observables$() {
    return this.observablesSubject.asObservable();
  }

  init(): void {
    this.backgroundConnection.onMessage.addListener((message) => {
      if (!message.type || !message.data) {
        return;
      }

      const { type, data } = message;

      switch (type) {
        case ChromeExtensionMessageType.Stats:
          this.statsSubject.next(data as ChromeExtensionMessageStats);
          break;
        case ChromeExtensionMessageType.Notification:
          this.notificationsSubject.next([
            data as ChromeExtensionMessageNotification,
            ...this.notificationsSubject.value,
          ]);
          break;
        case ChromeExtensionMessageType.Observables:
          this.observablesSubject.next(
            data as ChromeExtensionMessageObservables
          );
          break;
      }
    });

    this.sendMessage({
      data: {},
      type: ChromeExtensionMessageType.Init,
    });
  }

  debugObservable(id: string): void {
    this.sendMessage({
      type: ChromeExtensionMessageType.DebugObservable,
      data: {
        id,
      },
    });
  }

  private sendMessage<T>(message: ChromeExtensionMessage<T>): void {
    this.backgroundConnection.postMessage(message);
  }
}

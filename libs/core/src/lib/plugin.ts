import { BasePlugin, getStackTrace } from 'rxjs-spy';
import { Spy } from 'rxjs-spy/cjs/spy-interface';
import { SubscriberRef, SubscriptionRef } from 'rxjs-spy/cjs/subscription-ref';

import { stringify } from 'flatted';

import {
  ChromeExtensionMessageDebugObservable,
  ChromeExtensionMessageNotification,
  ChromeExtensionMessageObservables,
  ChromeExtensionMessageStats,
  ChromeExtensionMessageSubscription,
  ChromeExtensionMessageType,
  listenToChromeExtensionMessages,
  ObservableRef,
  sendChromeExtensionMessage,
} from '@rxjs-devtools/common';

import { RXJS_DEVTOOLS_PLUGIN_NAME } from './plugin-name';
import {
  defaultRxJSDevToolsPluginOptions,
  RxJSDevToolsPluginOptions,
} from './plugin-options';
import { getObservableTag, getObservableType, getRefId } from './utils';

export class RxJSDevToolsPlugin extends BasePlugin {
  private readonly spy: Spy;

  private readonly options: RxJSDevToolsPluginOptions;

  private stats: ChromeExtensionMessageStats = {
    next: 0,
    error: 0,
    complete: 0,
    subscribe: 0,
    unsubscribe: 0,
    activeSubscriptions: 0,
  };

  private observablesRefs = new Map<string, ObservableRef<any>>();

  private extensionCommunicationListenToMessagesSubscription: ChromeExtensionMessageSubscription | null =
    null;

  constructor(spy: Spy, options: Partial<RxJSDevToolsPluginOptions> = {}) {
    super(RXJS_DEVTOOLS_PLUGIN_NAME);

    this.spy = spy;
    this.options = {
      ...defaultRxJSDevToolsPluginOptions,
      ...options,
    };

    this.initialize();
  }

  override beforeNext(ref: SubscriptionRef, value: any): void {
    this.incrementStat('next');
    this.notifyNotification(ref, {
      notificationType: 'next',
      notificationTypeTime: 'before',
      value,
    });
    this.updateObservable(ref);
  }

  override afterNext(ref: SubscriptionRef, value: any): void {
    this.notifyNotification(ref, {
      notificationType: 'next',
      notificationTypeTime: 'after',
      value,
    });
  }

  override beforeError(ref: SubscriptionRef, error: any): void {
    this.incrementStat('error');
    this.notifyNotification(ref, {
      notificationType: 'error',
      notificationTypeTime: 'before',
      error,
    });
    this.updateObservable(ref);
  }

  override afterError(ref: SubscriptionRef, error: any): void {
    this.notifyNotification(ref, {
      notificationType: 'error',
      notificationTypeTime: 'after',
      error,
    });
  }

  override beforeComplete(ref: SubscriptionRef): void {
    this.incrementStat('complete');
    this.notifyNotification(ref, {
      notificationType: 'complete',
      notificationTypeTime: 'before',
    });
    this.updateObservable(ref);
  }

  override afterComplete(ref: SubscriptionRef): void {
    this.notifyNotification(ref, {
      notificationType: 'complete',
      notificationTypeTime: 'after',
    });
  }

  override beforeSubscribe(ref: SubscriberRef): void {
    this.incrementStat('subscribe');
    this.notifyNotification(ref, {
      notificationType: 'subscribe',
      notificationTypeTime: 'before',
    });
    this.updateObservable(ref);
  }

  override afterSubscribe(ref: SubscriptionRef): void {
    this.notifyNotification(ref, {
      notificationType: 'subscribe',
      notificationTypeTime: 'after',
    });
  }

  override beforeUnsubscribe(ref: SubscriptionRef): void {
    this.incrementStat('unsubscribe');
    this.notifyNotification(ref, {
      notificationType: 'unsubscribe',
      notificationTypeTime: 'before',
    });
    this.updateObservable(ref);
  }

  override afterUnsubscribe(ref: SubscriptionRef): void {
    this.notifyNotification(ref, {
      notificationType: 'unsubscribe',
      notificationTypeTime: 'after',
    });
  }

  override teardown(): void {
    this.extensionCommunicationListenToMessagesSubscription?.unsubscribe();
  }

  private initialize(): void {
    listenToChromeExtensionMessages(({ type, data }) => {
      switch (type) {
        case ChromeExtensionMessageType.Init: {
          this.notifyStats();
          this.notifyObservables();
          break;
        }
        case ChromeExtensionMessageType.DebugObservable:
          {
            const id = (data as ChromeExtensionMessageDebugObservable).id;
            if (id) {
              this.debugObservable(id);
            }
          }
          break;
      }
    });
  }

  private incrementStat(stat: keyof ChromeExtensionMessageStats) {
    this.stats[stat]++;
    this.notifyStats();
  }

  private updateObservable(ref: SubscriberRef): void {
    const { observable } = ref;

    const id = getRefId(observable);
    if (!id) {
      return;
    }

    if (this.observablesRefs.has(id)) {
      return;
    }

    const tag = getObservableTag(observable);
    const type = getObservableType(observable);

    this.observablesRefs.set(id, {
      observable,
      item: {
        id,
        tag,
        type,
      },
    });

    const { maxObservablesSize } = this.options;

    this.observablesRefs = new Map(
      [...this.observablesRefs.entries()].slice(-maxObservablesSize)
    );

    this.notifyObservables();
  }

  private debugObservable(id: string): void {
    const observableRef = this.observablesRefs.get(id);
    if (!observableRef) {
      return;
    }

    this.spy.debug(observableRef.observable);
  }

  private notifyStats(): void {
    const stats = {
      ...this.stats,
    };

    const data: ChromeExtensionMessageStats = {
      next: stats.next,
      error: stats.error,
      complete: stats.complete,
      subscribe: stats.subscribe,
      unsubscribe: stats.unsubscribe,
      activeSubscriptions: stats.subscribe - stats.unsubscribe,
    };

    sendChromeExtensionMessage({
      type: ChromeExtensionMessageType.Stats,
      data,
    });
  }

  private notifyNotification(
    ref: SubscriberRef,
    options: Pick<
      ChromeExtensionMessageNotification,
      'notificationType' | 'notificationTypeTime'
    > &
      Partial<Pick<ChromeExtensionMessageNotification, 'value' | 'error'>>
  ): void {
    const data: ChromeExtensionMessageNotification = {
      observableType: getObservableType(ref.observable),
      notificationType: options.notificationType,
      notificationTypeTime: options.notificationTypeTime,
      tag: getObservableTag(ref.observable),
      value: options?.value ? stringify(options?.value) : null,
      error: options?.error ? stringify(options?.error) : null,
      stackTrace: getStackTrace(ref),
      timestamp: Date.now(),
    };

    sendChromeExtensionMessage({
      type: ChromeExtensionMessageType.Notification,
      data,
    });
  }

  private notifyObservables(): void {
    const data: ChromeExtensionMessageObservables = [
      ...this.observablesRefs.values(),
    ]
      .map((value) => {
        return value.item;
      })
      .reverse();

    sendChromeExtensionMessage({
      type: ChromeExtensionMessageType.Observables,
      data,
    });
  }
}

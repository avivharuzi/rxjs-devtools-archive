import { Observable } from 'rxjs';

export const CHROME_EXTENSION_SOURCE_NAME = 'chrome-extension-rxjs-devtools';

export interface ChromeConnection {
  panel: chrome.runtime.Port | undefined;
  content: chrome.runtime.Port | undefined;
}

export interface ChromeConnectionInfo {
  tabId: string;
  sourceName: ChromeConnectionName;
  destinationName: ChromeConnectionName;
}

export type ChromeConnectionName = 'panel' | 'content';

export interface ObservableRef<T> {
  observable: Observable<T>;
  item: ObservableRefItem;
}

export interface ObservableRefItem {
  id: string;
  tag: string | null;
  type: string;
}

export interface ChromeExtensionMessage<T> {
  type: ChromeExtensionMessageType;
  data: T;
}

export enum ChromeExtensionMessageType {
  Init = 'init',
  Stats = 'stats',
  Notification = 'notification',
  Observables = 'observables',
  DebugObservable = 'debug',
}

export interface ChromeExtensionMessageStats {
  next: number;
  error: number;
  complete: number;
  subscribe: number;
  unsubscribe: number;
  activeSubscriptions: number;
}

export interface ChromeExtensionMessageNotification {
  observableType: string;
  notificationType: ChromeExtensionMessageNotificationType;
  notificationTypeTime: ChromeExtensionMessageNotificationTypeTime;
  tag: string | null;
  value: string | null;
  error: string | null;
  stackTrace: ChromeExtensionMessageNotificationStackFrame[];
  timestamp: number;
}

export type ChromeExtensionMessageNotificationType =
  | 'next'
  | 'error'
  | 'complete'
  | 'subscribe'
  | 'unsubscribe';

export type ChromeExtensionMessageNotificationTypeTime = 'before' | 'after';

export interface ChromeExtensionMessageNotificationStackFrame {
  columnNumber?: number;
  lineNumber?: number;
  fileName?: string;
  functionName?: string;
  source?: string;
}

export type ChromeExtensionMessageObservables = ObservableRefItem[];

export interface ChromeExtensionMessageDebugObservable {
  id: string;
}

export interface ChromeExtensionMessageSubscription {
  unsubscribe: () => void;
}

export const sendChromeExtensionMessage = <T>(
  message: ChromeExtensionMessage<T>
) => {
  window.postMessage(
    {
      message,
      source: CHROME_EXTENSION_SOURCE_NAME,
    },
    '*'
  );
};

export const listenToChromeExtensionMessages = <T>(
  callback: (message: ChromeExtensionMessage<T>) => void
): ChromeExtensionMessageSubscription => {
  const listener = (event: MessageEvent) => {
    // Only accept messages from the same frame
    if (event.source !== window) {
      return;
    }

    const data = event.data;

    // Only accept messages that we know are ours
    if (
      typeof data !== 'object' ||
      data === null ||
      data.source !== CHROME_EXTENSION_SOURCE_NAME ||
      !data.message
    ) {
      return;
    }

    callback(data.message);
  };

  window.addEventListener('message', listener);

  return {
    unsubscribe: () => window.removeEventListener('message', listener),
  };
};

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

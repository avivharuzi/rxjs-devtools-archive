import {
  listenToChromeExtensionMessages,
  sendChromeExtensionMessage,
} from '@rxjs-devtools/common';

const backgroundConnection = chrome.runtime.connect({
  name: 'content',
});

backgroundConnection.onMessage.addListener((message) => {
  sendChromeExtensionMessage(message);
});

listenToChromeExtensionMessages((message) => {
  backgroundConnection.postMessage(message);
});

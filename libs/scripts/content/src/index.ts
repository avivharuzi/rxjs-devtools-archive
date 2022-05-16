import { CHROME_EXTENSION_SOURCE_NAME } from '@rxjs-devtools/common';

const backgroundConnection = chrome.runtime.connect({
  name: 'content',
});

backgroundConnection.onMessage.addListener((message) => {
  window.postMessage(
    {
      message,
      source: CHROME_EXTENSION_SOURCE_NAME,
    },
    '*'
  );
});

window.addEventListener('message', (event) => {
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

  backgroundConnection.postMessage(data.message);
});

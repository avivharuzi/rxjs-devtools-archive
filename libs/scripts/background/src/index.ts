import { ChromeConnection, ChromeConnectionInfo } from '@rxjs-devtools/common';

const currentConnections: Record<string, ChromeConnection> = {};

chrome.runtime.onConnect.addListener((connection: chrome.runtime.Port) => {
  const { tabId, sourceName, destinationName } = getConnectionInfo(connection);

  let currentConnection = currentConnections[tabId] as ChromeConnection;
  if (!currentConnection) {
    currentConnections[tabId] = {
      panel: undefined,
      content: undefined,
    };
    currentConnection = currentConnections[tabId] as ChromeConnection;
  }
  currentConnection[sourceName] = connection;

  const listener = (message: unknown) => {
    const currentConnectionDestination = currentConnection[destinationName];

    if (currentConnectionDestination) {
      currentConnectionDestination.postMessage(message);
    } else {
      console.log(
        `Cannot post message since the destination has not yet connected`
      );
    }
  };

  connection.onMessage.addListener(listener);

  connection.onDisconnect.addListener(() => {
    currentConnection[sourceName] = undefined;

    connection.onMessage.removeListener(listener);
  });
});

const getConnectionInfo = (
  connection: chrome.runtime.Port
): ChromeConnectionInfo => {
  const panelMatches = connection.name.match(/panel@(\d+)/);

  if (panelMatches && panelMatches[1]) {
    const tabId = panelMatches[1];

    return {
      tabId,
      sourceName: 'panel',
      destinationName: 'content',
    };
  }

  return {
    tabId: connection.sender?.tab?.id?.toString() || '',
    sourceName: 'content',
    destinationName: 'panel',
  };
};

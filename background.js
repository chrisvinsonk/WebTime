const timers = {};

function updateTime(tabId) {
  if (timers[tabId]) {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - timers[tabId].startTime) / 1000);
    timers[tabId].elapsedTime = elapsedTime;
    chrome.tabs.sendMessage(tabId, { action: 'updateTime' });
  }
}

function startTimer(tabId) {
  if (!timers[tabId]) {
    timers[tabId] = {
      startTime: Date.now(),
      elapsedTime: 0,
    };
    setInterval(() => updateTime(tabId), 1000);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    const tabId = request.tabId;
    startTimer(tabId);
  } else if (request.action === 'getElapsedTime') {
    const tabId = request.tabId;
    const elapsedTime = timers[tabId] ? timers[tabId].elapsedTime : 0;
    sendResponse({ time: elapsedTime });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const previousTabId = activeInfo.previousTabId;
  const newTabId = activeInfo.tabId;
  if (previousTabId !== -1 && timers[previousTabId]) {
    updateTime(previousTabId);
  }
  if (timers[newTabId]) {
    activeTabId = newTabId;
  } else {
    startTimer(newTabId);
    activeTabId = newTabId;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (timers[tabId]) {
    delete timers[tabId];
  }
});

let activeTabId;

function updateTime() {
  chrome.runtime.sendMessage({ action: 'getElapsedTime', tabId: activeTabId }, (response) => {
    const elapsedTime = response.time || 0;
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').textContent = formattedTime;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      activeTabId = tabs[0].id;
      updateTime();
      chrome.runtime.sendMessage({ action: 'startTimer', tabId: activeTabId });
      setInterval(updateTime, 1000);
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentTab = tabs[0];
      var tabName = currentTab.title;
      document.getElementById('tabName').textContent = tabName;
      document.getElementById('tabName').setAttribute('title', tabName);
    });
  
    var timerInterval;
    var timerRunning = false;
    var timerValue = 0;
  
    function startTimer() {
      if (!timerRunning) {
        timerInterval = setInterval(function() {
          timerValue++;
          updateTimerDisplay();
        }, 1000);
        timerRunning = true;
      }
    }
  
    function stopTimer() {
      if (timerRunning) {
        clearInterval(timerInterval);
        timerValue = 0;
        timerRunning = false;
        updateTimerDisplay();
      }
    }
  
    function updateTimerDisplay() {
      var hours = Math.floor(timerValue / 3600);
      var minutes = Math.floor((timerValue % 3600) / 60);
      var seconds = timerValue % 60;
  
      var formattedTime = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);
      document.getElementById('timer').textContent = formattedTime;
    }
  
    function padZero(num) {
      return (num < 10 ? "0" : "") + num;
    }
  
    document.getElementById('takeABreakButton').addEventListener('click', function() {
      chrome.tabs.create({ url: 'https://www.youtube.com' });
    });
  
    startTimer();
  });
  
const status = require('./status.js');
const time = require('./time.js')();
const stoplist = require('./stoplist.js')({
  storage: require('./storage.js'),
  time,
});

document.addEventListener('DOMContentLoaded', () => {
  getActiveTabUrl((url) => {
    const hostname = getHostname(url);
    stoplist.findStopItem(hostname, (item) => {
      const header = document.getElementById('url');
      if (!item) {
        document.getElementById('extendDiv').remove();
        header.textContent = `Stoppable keyword: ${hostname}`;
        const reason = document.getElementById('reason');
        reason.addEventListener('keydown', onEnterSubmit, false);
        reason.focus();
        addButtonOnClickHandler(hostname, reason);
      } else {
        document.getElementById('reason').remove();
        document.getElementById('add').remove();
        stoplist.keywordIsUnlocked(hostname, (unlockedTill) => {
          if (unlockedTill) {
            extendButtonOnClickHandler(item);
            document.getElementById('time').value = time.secondsToTime(0);
            header.innerHTML = `Time still unlocked: ${time.secondsToTime(unlockedTill)} (HH:MM:SS)`;
          } else {
            document.getElementById('extendDiv').remove();
            header.innerHTML = `Keyword "${hostname}" is already stopped.<br>Edit the motivational reason in the options.`;
          }
        });
      }
    });
  });
});

function onEnterSubmit(event) {
  if (event.keyCode === 13) {
    document.getElementById('add').click();
  }
}

function addButtonOnClickHandler(keyword, reason) {
  const addButton = document.getElementById('add');
  addButton.onclick = () => {
    stoplist.addItem({ url: keyword, reason: reason.value }, (error) => {
      if (!error) status.showMessage('Added to stoppable websites.');
      else status.showError(error);
    });
  };
}

function extendButtonOnClickHandler(stoplistItem) {
  document.getElementById('extend').onclick = () => {
    const timeString = document.getElementById('time').value;
    if (timeString.length >= 5) {
      const newUnlockedTill = time.timeToSeconds(timeString) + stoplistItem.unlockedTill;
      stoplist.updateItem({ url: stoplistItem.url, unlockedTill: newUnlockedTill }, (error) => {
        if (!error) document.getElementById('url').innerHTML = `Time still unlocked: ${time.secondsToTime(time.left(newUnlockedTill))} (HH:MM:SS)`;
        else status.showError(error);
      });
    } else status.showError('Timeout extend value incorrect');
  };
}

function getActiveTabUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;
    if (!url || url.length <= 0) {
      // Added example url for testing the popup.js from seleniumTests
      // When you open the popup.html from a regular tab the chrome.tabs.query returns nothing
      // This should never happen on a real click, bit hackish, but it works...! ;-)
      url = 'http://example.org';
    }
    callback(url);
  });
}

function getHostname(href) {
  // href needs to contain http:// else it is appended to current windows href.
  const l = document.createElement('a');
  l.href = href;
  const result = l.hostname.replace(/^www\./, '');
  l.remove();
  return result;
}

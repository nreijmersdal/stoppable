const status = require('./status.js');
const storage = require('./storage.js');

let hostname = '';

document.addEventListener('DOMContentLoaded', () => {
  getActiveTabUrl((url) => {
    hostname = getHostname(url);
    hostname = hostname.replace(/^www\./, '');
    document.getElementById('url').textContent = `Stoppable website: ${hostname}`;
  });
  addButtonOnClickHandler();
});

function addButtonOnClickHandler() {
  const addButton = document.getElementById('add');
  addButton.onclick = () => {
    const reason = document.getElementById('reason').value;
    addStopListItem(hostname, reason);
  };
}

function addStopListItem(stopItemKeyword, stopItemReason) {
  storage.addStopItem({ url: stopItemKeyword, reason: stopItemReason }, (error) => {
    if (!error) status.showMessage('Added to stoppable websites.');
    else status.showError(error);
  });
}

function getActiveTabUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    if (url.length <= 0) throw Error('url should contain characters');
    callback(url);
  });
}

function getHostname(href) {
  const l = document.createElement('a');
  l.href = href;
  const result = l.hostname;
  l.remove();
  return result;
}

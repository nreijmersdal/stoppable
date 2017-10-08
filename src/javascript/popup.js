const status = require('./status.js');
const time = require('./time.js')();
const dom = require('./dom.js');
const stoplist = require('./stoplist.js')({
  storage: require('./storage.js'),
  time,
});

document.addEventListener('DOMContentLoaded', () => {
  getUrlFromActiveTab((url) => {
    const hostname = getHostname(url);
    stoplist.findStopItem(hostname, (item) => {
      if (!item) showAddView(hostname);
      else {
        stoplist.keywordIsUnlocked(hostname, (unlockedTill) => {
          if (unlockedTill) showExtendView(item, unlockedTill);
          else createHeader(`Keyword "${hostname}" is already stopped.<br>Edit the motivational reason in the options.`);
        });
      }
      createStatus();
    });
  });
});

function showAddView(hostname) {
  createHeader(`Stoppable keyword: ${hostname}`);
  const reason = dom.create({
    tag: 'input',
    id: 'reason',
    placeholder: 'Motivational reason to stop visiting this site. (min 20 characters)',
    type: 'text',
    maxlength: 70,
  });
  dom.addToBody(reason);
  dom.addToBody(dom.create({ tag: 'button', id: 'add', innerHTML: 'Add' }));
  reason.addEventListener('keydown', onEnterSubmit, false);
  reason.focus();
  addButtonOnClickHandler(hostname, reason);
}

function showExtendView(item, unlockedTill) {
  createHeader(`Time still unlocked: ${time.secondsToTime(unlockedTill)} (HH:MM:SS)`);
  dom.addToBody(dom.create({ tag: 'input', id: 'time', type: 'time', step: '1', required: true }));
  dom.addToBody(dom.create({ tag: 'button', id: 'extend', innerHTML: 'Extend timeout' }));
  document.getElementById('time').value = time.secondsToTime(0);
  extendButtonOnClickHandler(item);
}

function createHeader(text) {
  dom.addToBody(dom.create({ tag: 'div', id: 'url', innerHTML: text }));
  addBreak();
}

function createStatus() {
  dom.addToBody(dom.create({ tag: 'div', id: 'status' }));
}

function addBreak() {
  dom.addToBody(dom.create({ tag: 'br' }));
}

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

function getUrlFromActiveTab(callback) {
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

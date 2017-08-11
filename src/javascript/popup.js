const status = require('./status.js');
const stoplist = require('./stoplist.js')({
  storage: require('./storage.js'),
  time: require('./time.js')(),
});

document.addEventListener('DOMContentLoaded', () => {
  getActiveTabUrl((url) => {
    const hostname = getHostname(url);
    stoplist.isKeywordInList(hostname, (isInList) => {
      const header = document.getElementById('url');
      if (!isInList) {
        header.textContent = `Stoppable keyword: ${hostname}`;
        const reason = document.getElementById('reason');
        reason.addEventListener('keydown', onEnterSubmit, false);
        reason.focus();
        addButtonOnClickHandler(hostname, reason);
      } else {
        document.getElementById('reason').remove();
        document.getElementById('add').remove();
        stoplist.keywordIsUnlocked(hostname, (unlockedTill) => {
          if (unlockedTill) header.innerHTML = `Time still unlocked: ${unlockedTill} (in seconds).`;
          else header.innerHTML = `Keyword "${hostname}" is already stopped.<br>Edit the motivational reason in the options.`;
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
  const result = l.hostname.replace(/^www\./, '');
  l.remove();
  return result;
}

(function options() {
  const status = require('./status.js');
  const storage = require('./storage.js');
  const DEFAULT_REASON = 'This page is nice, but also wasteful, I visit it wisely!';

  document.addEventListener('DOMContentLoaded', () => {
    loadOptions();
    saveButtonOnClickHandler();
    addButtonOnClickHandler();
  });

  function loadOptions() {
    storage.getSettings((items) => {
      items.list.forEach((item) => {
        createStopItem(true, item.url, item.reason);
      });
      document.getElementById('redirectUrl').value = items.redirectUrl;
    });
  }

  function saveOptions() {
    const data = { list: getCheckedListItems(), redirectUrl: document.getElementById('redirectUrl').value };
    if (data.list.length <= 0) return;

    storage.saveSettings(data, (error) => {
      if (!error) status.showMessage('Options saved.');
      else status.showError(error);
    });
  }

  function getCheckedListItems() {
    const result = [];
    const checkboxes = document.getElementsByName('selected');
    const urls = document.getElementsByName('url');
    const reasons = document.getElementsByName('reason');

    checkboxes.forEach((checkbox, index) => {
      if (checkbox.checked) {
        result.push({
          url: urls[index].value,
          reason: reasons[index].value,
        });
      }
    });

    return result;
  }

  function addButtonOnClickHandler() {
    const addButton = document.getElementById('add');
    addButton.onclick = () => {
      createStopItem(true, '', DEFAULT_REASON);
    };
  }

  function saveButtonOnClickHandler() {
    document.getElementById('save').addEventListener('click', saveOptions);
  }

  function createStopItem(state, urlText, reasonText) {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'selected';
    checkbox.checked = state;
    const url = document.createElement('input');
    url.type = 'text';
    url.name = 'url';
    url.value = urlText;
    url.maxLength = 255;
    const reason = document.createElement('input');
    reason.type = 'text';
    reason.name = 'reason';
    reason.value = reasonText;
    reason.maxLength = 70;

    listItem.appendChild(checkbox);
    listItem.appendChild(createSpace());
    listItem.appendChild(url);
    listItem.appendChild(createSpace());
    listItem.appendChild(reason);

    document.getElementById('list').appendChild(listItem);
  }

  function createSpace() {
    const span = document.createElement('span');
    span.innerHTML = '&nbsp;';
    return span;
  }
}());

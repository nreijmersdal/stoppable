(function storage() {
  exports.getSettings = function getSettings(callback) {
    chrome.storage.sync.get(getDefaults(), callback);
  };

  exports.saveSettings = function saveSettings(data, callback) {
    const error = validateData(data);
    if (error === undefined) chrome.storage.sync.set(data, callback);
    else callback(error);
  };

  exports.addStopItem = function addStopItem(newStopItem, callback) {
    chrome.storage.sync.get(getDefaults(), (items) => {
      items.list.push(newStopItem);
      exports.saveSettings(items, callback);
    });
  };

  exports.updateStopItem = function updateStopItem(updatedStopItem, callback) {
    const newItems = { list: [] };
    chrome.storage.sync.get(getDefaults(), (items) => {
      items.list.forEach((item) => {
        if (item.url === updatedStopItem.url) newItems.list.push(updatedStopItem);
        else newItems.list.push(item);
      });
      exports.saveSettings(newItems, callback);
    });
  };

  function getDefaults() {
    return {
      list: [{ url: 'facebook.com', reason: 'I would rather plan a real social visit than waste my time here...', unlockedTill: 0 }],
      redirectUrl: 'https://app.weekplan.net',
    };
  }

  function validateData(data) {
    let error;

    if (data.redirectUrl <= 0) error = 'ESC-key redirects to cannot be empty';

    data.list.forEach((item) => {
      if (item.reason.length <= 19) error = `Reason to short (min 20) for keyword: ${item.url}`;
      if (item.reason.length > 70) error = `Reason to long (max 70) for keyword: ${item.url}`;
      if (item.url.length <= 0) error = 'Keyword cannot be empty';
      if (item.url.length > 255) error = 'Keyword cannot be longer then 255 characters';
    });

    return error;
  }
}());

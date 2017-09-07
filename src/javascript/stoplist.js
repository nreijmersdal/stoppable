module.exports = function stoplist(options) {
  if (!options.storage) throw Error('options.storage is required');
  if (!options.time) throw Error('options.time is required');
  const storage = options.storage;
  const time = options.time;

  return {
    findStopItem: (keyword, callback) => {
      findItemForKeyword(keyword, (item) => {
        if (!item) callback(false);
        else callback(item);
      });
    },

    keywordIsUnlocked: (keyword, callback) => {
      findItemForKeyword(keyword, (item) => {
        if (!item) callback(false);
        else callback(time.left(item.unlockedTill));
      });
    },

    addItem: (item, callback) => {
      storage.getSettings((items) => {
        items.list.push(item);
        storage.saveSettings(items, callback);
      });
    },

    updateItem: (changes, callback) => {
      const newItems = { list: [] };
      storage.getSettings((items) => {
        items.list.forEach((item) => {
          if (item.url === changes.url) {
            const updatedItem = {
              url: changes.url,
              reason: changes.reason || item.reason,
              unlockedTill: changes.unlockedTill || item.unlockedTill,
            };
            newItems.list.push(updatedItem);
          } else newItems.list.push(item);
        });
        storage.saveSettings(newItems, callback);
      });
    },
  };

  function findItemForKeyword(keyword, callback) {
    storage.getSettings((items) => {
      const found = items.list.some((item) => {
        if (item.url.toString() === keyword.toString()) {
          callback(item);
          return true;
        }
        return false;
      });
      if (!found) callback(false);
    });
  }
};

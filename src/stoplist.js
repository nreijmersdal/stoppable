const Stopitem = require('../src/stopitem.js');

module.exports = function stoplist(options) {
  if (!options.storage) throw Error('options.storage is required');
  if (!options.time) throw Error('options.time is required');
  const { time, storage } = options;

  return {
    getItem: (keyword, callback) => {
      findItemOnKeyword(keyword, (item) => {
        if (!item) callback(false);
        else callback(item);
      });
    },

    isUnlocked: (keyword, callback) => {
      findItemOnKeyword(keyword, (item) => {
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

  function findItemOnKeyword(keyword, callback) {
    storage.getSettings((items) => {
      const found = items.list.some((item) => {
        if (keyword.includes(item.url)) {
          callback(Stopitem(item));
          return true;
        }
        return false;
      });
      if (!found) callback(false);
    });
  }
};

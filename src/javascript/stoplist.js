module.exports = function stoplist(options) {
  if (!options.storage) throw Error('options.storage is required');
  if (!options.time) throw Error('options.time is required');
  const storage = options.storage;
  const time = options.time;

  return {
    isKeywordInList: (keyword, callback) => {
      findItemForKeyword(keyword, (item) => {
        if (!item) callback(false);
        else callback(true);
      });
    },

    keywordIsUnlocked: (keyword, callback) => {
      findItemForKeyword(keyword, (item) => {
        if (!item) callback(false);
        else callback(time.left(item.unlockedTill));
      });
    },
  };

  function findItemForKeyword(keyword, callback) {
    storage.getSettings((items) => {
      const found = items.list.every((item) => {
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

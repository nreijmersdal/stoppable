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
    let found = false;
    storage.getSettings((items) => {
      items.list.forEach((item) => {
        if (item.url.toString() === keyword.toString()) {
          callback(item);
          found = true;
        }
      });
      if (!found) callback(false);
    });
  }
};

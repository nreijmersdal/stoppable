module.exports = function stoplist(options) {
  if (!options.storage) throw Error('options.storage is required');
  if (!options.time) throw Error('options.time is required');
  const storage = options.storage;
  const time = options.time;

  return {
    isKeywordInList: (keyword, callback) => {
      storage.getSettings((items) => {
        let result = false;
        items.list.forEach((item) => {
          if (item.url.toString() === keyword.toString()) {
            result = true;
          }
        });
        callback(result);
      });
    },

    keywordIsUnlocked: (keyword, callback) => {
      storage.getSettings((items) => {
        let result = false;
        items.list.forEach((item) => {
          if (item.url.toString() === keyword.toString()) {
            result = time.left(item.unlockedTill);
          }
        });
        callback(result);
      });
    },
  };
};

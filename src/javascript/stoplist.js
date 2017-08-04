(function stoplist() {
  const storage = require('./storage.js');
  const time = require('./time.js');

  exports.isKeywordInList = function isKeywordInList(keyword, callback) {
    storage.getSettings((items) => {
      let result = false;
      items.list.forEach((item) => {
        if (item.url.toString() === keyword.toString()) {
          result = true;
        }
      });
      callback(result);
    });
  };

  exports.keywordIsUnlocked = function keywordIsUnlocked(keyword, callback) {
    storage.getSettings((items) => {
      let result = false;
      items.list.forEach((item) => {
        if (item.url.toString() === keyword.toString()) {
          result = time.left(item.unlockedTill);
        }
      });
      callback(result);
    });
  };
}());

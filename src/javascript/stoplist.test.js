let data = {
  list: [
    { url: 'facebook.com', reason: 'test', unlockedTill: 100 },
    { url: 'twitter.com', reason: 'test', unlockedTill: 0 },
    { url: 'reddit.com', reason: 'test', unlockedTill: 0 },
  ],
};

const assert = require('../vendor/chai-4.1.1.js').assert;
const stoplist = require('./stoplist.js')({
  storage: {
    getSettings: cb => cb(data),
    saveSettings: (items, cb) => {
      data = items;
      cb();
    },
  },
  time: {
    left: valueOfUnlockedTill => valueOfUnlockedTill,
  },
});

describe('Stoplist', () => {
  describe('findStopItem', () => {
    it('Should return true when keyword is in the list', () => {
      stoplist.findStopItem('reddit.com', (item) => {
        assert.equal(item.url, 'reddit.com');
      });
    });

    it('Should return false when keyword is not in the list', () => {
      stoplist.findStopItem('notstopped.com', (item) => {
        assert.equal(item, false);
      });
    });

    it('Should return true when domain is in the list', () => {
      stoplist.findStopItem('sub.reddit.com', (item) => {
        assert.equal(item.url, 'reddit.com');
      });
    });
  });

  describe('keywordIsUnlocked', () => {
    it('Should return time left when keyword is unlocked', () => {
      stoplist.keywordIsUnlocked('facebook.com', (result) => {
        assert.equal(result, 100);
      });
    });

    it('Should return false when keyword is not unlocked', () => {
      stoplist.keywordIsUnlocked('notstopped.com', (result) => {
        assert.equal(result, false);
      });
    });
  });

  describe('addItem', () => {
    it('Should put item in the list', () => {
      stoplist.addItem({ url: 'additem.com', reason: 'something' }, () => {
        stoplist.findStopItem('additem.com', (item) => {
          assert.equal(item.url, 'additem.com');
        });
      });
    });
  });

  describe('updateItem', () => {
    it('Should update item in the list', () => {
      stoplist.updateItem({ url: 'facebook.com', reason: 'changed' }, () => {
        assert.equal(data.list[0].reason, 'changed');
        assert.equal(data.list[0].unlockedTill, 100);
      });
    });
    it('Should update unlockedTill time of time', () => {
      stoplist.updateItem({ url: 'facebook.com', unlockedTill: 5 }, () => {
        assert.equal(data.list[0].reason, 'changed');
        assert.equal(data.list[0].unlockedTill, 5);
      });
    });
  });
});

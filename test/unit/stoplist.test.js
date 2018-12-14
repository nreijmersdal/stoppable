let data = {
  list: [
    { url: 'facebook.com', reason: 'test', unlockedTill: 100 },
    { url: 'twitter.com', reason: 'test', unlockedTill: 0 },
    { url: 'reddit.com', reason: 'test', unlockedTill: 0 },
  ],
};

const { assert } = require('../vendor/chai-4.1.1.js');
const stoplist = require('../../src/stoplist.js')({
  storage: {
    getSettings: cb => cb(data),
    saveSettings: (items, cb) => {
      data = items;
      cb();
    },
  },
});

describe('Stoplist', () => {
  describe('getItem', () => {
    it('Should return true when keyword is in the list', () => {
      stoplist.getItem('reddit.com', (item) => {
        assert.equal(item.url, 'reddit.com');
      });
    });

    it('Should return false when keyword is not in the list', () => {
      stoplist.getItem('notstopped.com', (item) => {
        assert.equal(item, false);
      });
    });

    it('Should return true when domain is in the list', () => {
      stoplist.getItem('sub.reddit.com', (item) => {
        assert.equal(item.url, 'reddit.com');
      });
    });
  });

  describe('addItem', () => {
    it('Should put item in the list', () => {
      stoplist.addItem({ url: 'additem.com', reason: 'something' }, () => {
        stoplist.getItem('additem.com', (item) => {
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

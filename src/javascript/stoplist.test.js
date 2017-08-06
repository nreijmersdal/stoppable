const assert = require('assert');
const stoplist = require('./stoplist.js')({ storage: {
  getSettings: (cb) => {
    const data = {
      list: [{
        url: 'facebook.com',
        reason: 'test',
        unlockedTill: 0,
      }],
    };
    cb(data);
  },
} });

describe('Stoplist', () => {
  describe('isKeywordInList', () => {
    it('Should return true when keyword is in the list', () => {
      stoplist.isKeywordInList('facebook.com', (result) => {
        assert.equal(result, true);
      });
    });

    it('Should return false when keyword is not in the list', () => {
      stoplist.isKeywordInList('notstopped.com', (result) => {
        assert.equal(result, false);
      });
    });
  });
});

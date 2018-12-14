const { assert } = require('../vendor/chai-4.1.1.js');
const Stopitem = require('../../src/stopitem.js');
const time = require('../../src/time.js')();

describe('Stopitem', () => {
  describe('', () => {
    it('Should be an object', () => {
      const stopitem = Stopitem({ url: 'facebook.com', reason: 'test', unlockedTill: 100 });
      assert.equal(stopitem.url, 'facebook.com');
      assert.equal(stopitem.reason, 'test');
    });
  });

  describe('isUnlocked', () => {
    it('Should be locked by default', () => {
      const stopitem = Stopitem({ url: 'facebook.com', reason: 'test', unlockedTill: 0 });
      assert.equal(stopitem.isUnlocked(), false);
    });
    it('Should be unlocked now', () => {
      const stopitem = Stopitem({ url: 'facebook.com', reason: 'test', unlockedTill: time.getTimeInSeconds() + 100 });
      assert.equal(stopitem.isUnlocked(), 100);
    });
  });
});

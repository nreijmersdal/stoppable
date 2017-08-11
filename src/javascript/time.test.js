const assert = require('../vendor/chai-4.1.1.js').assert;
const time = require('./time.js')({ date: () => 1000000 });

describe('Time', () => {
  describe('getTimeInSeconds', () => {
    it('Should return current time in seconds', () => {
      assert.equal(time.getTimeInSeconds(), 1000);
    });
  });
  describe('left', () => {
    it('Should returns number of seconds until timestamp in seconds is reached', () => {
      assert.equal(time.left(2000), 1000);
    });
    it('Should returns false when no timeleft', () => {
      assert.equal(time.left(1000), false);
    });
  });
  describe('secondsToMinutes', () => {
    it('Should return minutes based on seconds input', () => {
      assert.equal(time.secondsToMinutes(1), 0);
      assert.equal(time.secondsToMinutes(60), 1);
      assert.equal(time.secondsToMinutes(119), 2);
    });
  });
});

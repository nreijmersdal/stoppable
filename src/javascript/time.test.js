const assert = require('../vendor/chai-4.1.1.js').assert;
const time = require('./time.js')({ date: () => 1000000 });

describe('Time', () => {
  describe('getTimeInSeconds', () => {
    it('Should return current time in seconds', () => {
      assert.equal(time.getTimeInSeconds(), 1000);
    });
  });
  describe('getTimestampMinutesInTheFuture', () => {
    it('Should return time in seconds 1 minute in the future', () => {
      assert.equal(time.getTimestampMinutesInTheFuture(1), 1000 + 60);
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
});

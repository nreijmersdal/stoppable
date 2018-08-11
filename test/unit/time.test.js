const { assert } = require('../vendor/chai-4.1.1.js');
const time = require('../../src/time.js')({ date: () => 1000000 });

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
  describe('timeToSeconds', () => {
    it('Should convert HH:MM:SS to seconds', () => {
      assert.equal(time.timeToSeconds('00:15:01'), 901);
      assert.equal(time.timeToSeconds('00:15'), 900);
      assert.equal(time.timeToSeconds('01:00'), 3600);
      assert.equal(time.timeToSeconds('00:00:01'), 1);
      assert.equal(time.timeToSeconds('23:59:59'), 86399);
    });
  });
  describe('secondsToTime', () => {
    it('Should convert seconds to HH:MM:SS to', () => {
      assert.equal(time.secondsToTime(901), '00:15:01');
      assert.equal(time.secondsToTime(1), '00:00:01');
      assert.equal(time.secondsToTime(86399), '23:59:59');
    });
  });
});

const time = require('../src/time.js')();

module.exports = function Stopitem(data) {
  if (!data) throw Error('data is required');

  return {
    url: data.url,
    reason: data.reason,
    unlockedTill: data.unlockedTill,

    isUnlocked() {
      return time.getTimeInSeconds() < this.unlockedTill;
    },
  };
};

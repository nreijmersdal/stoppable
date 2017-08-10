module.exports = function time(options) {
  let date = () => new Date();
  if (options && options.date) date = options.date;

  return {
    getTimeInSeconds: () => getTimeInSeconds(),
    getTimestampMinutesInTheFuture: minutes => (getTimeInSeconds() + (minutes * 60)),
    left: (timestamp) => {
      const timeleft = timestamp - getTimeInSeconds();
      if (timeleft > 0) return timeleft;
      return false;
    },
  };

  function getTimeInSeconds() {
    return Math.round(date() / 1000);
  }
};

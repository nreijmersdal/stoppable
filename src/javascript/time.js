module.exports = function time(options) {
  let date = () => new Date();
  if (options && options.date) date = options.date;

  return {
    getTimeInSeconds: () => getTimeInSeconds(),
    left: (timestamp) => {
      const timeleft = timestamp - getTimeInSeconds();
      if (timeleft > 0) return timeleft;
      return false;
    },
    secondsToMinutes: seconds => Math.round(seconds / 60),
  };

  function getTimeInSeconds() {
    return Math.round(date() / 1000);
  }
};

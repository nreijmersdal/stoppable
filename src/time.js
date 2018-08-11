module.exports = function time(options) {
  let date = () => new Date();
  if (options && options.date) date = options.date; // eslint-disable-line

  return {

    getTimeInSeconds: () => getTimeInSeconds(),

    left: (timestamp) => {
      const timeleft = timestamp - getTimeInSeconds();
      if (timeleft > 0) return timeleft;
      return false;
    },

    secondsToMinutes: seconds => Math.round(seconds / 60),

    timeToSeconds: (string) => {
      const split = string.split(':');
      let seconds = split[0] * 3600;
      seconds += split[1] * 60;
      if (split[2]) seconds += split[2] * 1;

      return seconds;
    },

    secondsToTime: (seconds) => {
      const tempDate = new Date(null);
      tempDate.setSeconds(seconds);
      return tempDate.toISOString().substr(11, 8);
    },

  };

  function getTimeInSeconds() {
    return Math.round(date() / 1000);
  }
};

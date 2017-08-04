(function status() {
  exports.getTimeInSeconds = function getTimeInSeconds() {
    return Math.round(+new Date() / 1000);
  };

  exports.getTimestampMinutesInTheFuture = function getTimestampMinutesInTheFuture(minutes) {
    return (exports.getTimeInSeconds() + (minutes * 60));
  };

  exports.left = function left(timestamp) {
    const timeleft = timestamp - exports.getTimeInSeconds();
    if (timeleft > 0) return timeleft;
    return false;
  };
}());

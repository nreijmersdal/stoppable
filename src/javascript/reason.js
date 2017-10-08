(function reason() {
  exports.isValid = (text) => {
    if (text.length < 30) return false;

    const words = text.split(' ');
    if (words.length < 4) return false;
    if (containsRecurringPattern(words)) return false;

    return true;
  };

  function containsRecurringPattern(array) {
    let recurringPattern = false;
    array.forEach((word) => {
      const count = array.filter(value => value === word).length;
      if (count > 2) recurringPattern = true;
    });
    return recurringPattern;
  }
}());

module.exports = function reason(options) {
  if (!options.storage) throw Error('options.storage is required');
  let reasonLength;
  options.storage.getSettings((data) => {
    reasonLength = data.unlockLength;
  });

  return {
    isValid: (text) => {
      const words = text.trim().split(' ');
      let result = { valid: true, message: '' };
      result = checkForVowels(words) || result;
      result = checkForRecurringPattern(words) || result;
      result = checkNumberOfWords(words) || result;
      result = checkReasonLength(text) || result;

      return result;
    },
  };

  function checkReasonLength(text) {
    if (text.length < reasonLength) {
      return { valid: false, message: `Still ${reasonLength - text.length} character(s) left` };
    }
    return undefined;
  }

  function checkNumberOfWords(words) {
    if (words.length < 4) return { valid: false, message: `Still ${4 - words.length} word(s) left` };
    return undefined;
  }

  function checkForRecurringPattern(array) {
    let pattern;
    array.forEach((word) => {
      const count = array.filter(value => value === word).length;
      if (count > 2) pattern = word;
    });
    if (pattern) return { valid: false, message: `Recurring pattern: ${pattern}` };
    return null;
  }

  function checkForVowels(array) {
    const words = [];
    array.forEach((word) => {
      if (!word.toLowerCase().includes('a') &&
          !word.toLowerCase().includes('e') &&
          !word.toLowerCase().includes('i') &&
          !word.toLowerCase().includes('o') &&
          !word.toLowerCase().includes('u') &&
          !word.toLowerCase().includes('y')
      ) words.push(word);
    });
    if (words.length > 0) return { valid: false, message: `Missing vowels in: ${words.join(', ')}` };
    return null;
  }
};

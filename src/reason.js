module.exports = function reason(options) {
  if (!options.storage) throw Error('options.storage is required');
  let reasonLength;
  options.storage.getSettings((data) => {
    reasonLength = data.unlockLength;
  });

  return {
    isValid: (text) => {
      const words = text.trim().replace(',', '').split(' ');
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
      const string = word.toLowerCase();
      if (!isNumeric(string) && !isVowelException(string) && (
        !string.includes('a')
        && !string.includes('e')
        && !string.includes('i')
        && !string.includes('o')
        && !string.includes('u')
        && !string.includes('y'))
      ) words.push(word);
    });
    if (words.length > 0) return { valid: false, message: `Missing vowels in: ${words.join(', ')}` };
    return null;
  }

  function isNumeric(word) {
    return !isNaN(word); // eslint-disable-line no-restricted-globals
  }

  function isVowelException(word) {
    const exceptions = [
      'brr', 'brrr', 'bzzt', 'grrr', 'hm',
      'hmm', 'mm', 'mmm', 'mhmm', 'pfft',
      'pht', 'phpht', 'psst', 'nth', 'sh',
      'shh', 'tv', 'wc', 'zzz',
      ':-)', ':)', ';-)', ';)', ':p', ';p', ':d', ';d',
    ];
    return exceptions.includes(word);
  }
};

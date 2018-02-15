(function reason() {
  exports.isValid = (text) => {
    let result = { valid: true, message: '' };
    const words = text.trim().split(' ');
    const vowelCheck = allWordsContainVowels(words);
    if (!vowelCheck.passed) result = { valid: false, message: `Missing vowels in: ${vowelCheck.words.join(', ')}` };
    const recurCheck = containsRecurringPattern(words);
    if (!recurCheck.passed) result = { valid: false, message: `Recurring pattern: ${recurCheck.pattern}` };
    if (words.length < 4) result = { valid: false, message: `Still ${4 - words.length} word(s) left` };
    if (text.length < 30) result = { valid: false, message: `Still ${30 - text.length} character(s) left` };

    return result;
  };

  function containsRecurringPattern(array) {
    let passed = true;
    let pattern;
    array.forEach((word) => {
      const count = array.filter(value => value === word).length;
      if (count > 2) {
        passed = false;
        pattern = word;
      }
    });
    return { passed, pattern };
  }

  function allWordsContainVowels(array) {
    let passed = true;
    const words = [];
    array.forEach((word) => {
      if (!word.toLowerCase().includes('a') &&
          !word.toLowerCase().includes('e') &&
          !word.toLowerCase().includes('i') &&
          !word.toLowerCase().includes('o') &&
          !word.toLowerCase().includes('u') &&
          !word.toLowerCase().includes('y')
      ) {
        passed = false;
        words.push(word);
      }
    });
    return { passed, words };
  }
}());

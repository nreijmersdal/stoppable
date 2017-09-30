(function storage() {
  exports.getSettings = function getSettings(callback) {
    chrome.storage.sync.get(exports.getDefaults(), callback);
  };

  exports.saveSettings = function saveSettings(data, callback, browser = chrome) {
    const error = validateData(data);
    if (error === null) browser.storage.sync.set(data, callback);
    else callback(error);
  };

  exports.getDefaults = function getDefaults() {
    return {
      list: [{ url: 'facebook.com', reason: 'I would rather plan a real social visit than waste my time here...', unlockedTill: 0 }],
      redirectUrl: 'https://app.weekplan.net/',
      seconds: 900,
    };
  };

  function validateData(data) {
    const errors = [];

    if (data.seconds <= 0) errors.push('Seconds cannot be empty');
    if (data.list && data.list.length > 0) {
      data.list.forEach((item) => {
        if (!isValidStoplistItem(item)) errors.push('Stoplist item is not valid');
        else {
          if (item.reason.length <= 19) errors.push(`Reason to short (min 20) for keyword: ${item.url}`);
          if (item.reason.length > 70) errors.push(`Reason to long (max 70) for keyword: ${item.url}`);
          if (item.url.length <= 0) errors.push('Keywords cannot be empty');
          if (item.url.length > 255) errors.push('Keywords cannot be longer then 255 characters');
          if (item.url.includes('newtab')) errors.push('Restricted keyword found: newtab');
        }
      });

      const duplicates = findDuplicateStoplistItems(data.list);
      if (duplicates.length > 0) {
        const keywords = [];
        duplicates.forEach((duplicate) => {
          keywords.push(duplicate.url);
        });
        errors.push(`Duplicate keywords founds: ${keywords.join(', ')}`);
      }
    }

    errors.push(...isValidRedirectUrl(data.redirectUrl));

    if (errors.length <= 0) return null;
    return errors;
  }

  function isValidRedirectUrl(redirectUrl) {
    const errors = [];
    if (redirectUrl <= 0) errors.push('ESC-key redirects to cannot be empty');
    else if (redirectUrl && redirectUrl.length > 0) {
      try {
        const url = new URL(redirectUrl);
        if (!url.protocol) throw new Error('Missing protocol');
      } catch (e) {
        errors.push('Productivity URL is not valid');
      }
    }
    return errors;
  }

  function findDuplicateStoplistItems(list) {
    const seen = new Set();
    return list.filter((item) => {
      if (!seen.has(item.url)) {
        seen.add(item.url);
        return false;
      }
      return true;
    });
  }

  function isValidStoplistItem(item) {
    if (typeof item.url !== 'string') return false;
    if (typeof item.reason !== 'string') return false;
    if (item.unlockedTill && typeof item.unlockedTill !== 'number') return false;
    return true;
  }
}());

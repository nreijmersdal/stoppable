const assert = require('../vendor/chai-4.1.1.js').assert;
const storage = require('./storage.js');

const VALID_REASON = '12345678901234567890';
const chrome = {
  storage: {
    sync: {
      set: (data, cb) => {
        cb(true);
      },
    },
  },
};

describe('Storage', () => {
  describe('saveSettings', () => {
    it('Should save an empty data object', () => {
      storage.saveSettings({}, (called) => {
        assert.equal(called, true);
      }, chrome);
    });
    it('Should save the defaults data object', () => {
      storage.saveSettings(storage.getDefaults(), (called) => {
        assert.equal(called, true);
      }, chrome);
    });
    it('Should give an error when redirectUrl or seconds are missing', () => {
      storage.saveSettings({
        redirectUrl: '',
        seconds: '',
      }, (result) => {
        assert.equal(result.length, 2);
        assert.equal(result[0], 'ESC-key redirects to cannot be empty');
        assert.equal(result[1], 'Seconds cannot be empty');
      });
    });
    it('Should give an error when saving invalid object', () => {
      storage.saveSettings({
        list: [{}],
      }, (result) => {
        assert.equal(result.length, 1);
        assert.equal(result[0], 'Stoplist item is not valid');
      });
    });
    it('Should give validation error when reason lenght to short', () => {
      storage.saveSettings({
        list: [{
          url: 'http://example.org',
          reason: 'my invalid Reason',
        }],
      }, (result) => {
        assert.equal(result.length, 1);
        assert.equal(result[0], 'Reason to short (min 20) for keyword: http://example.org');
      });
    });
    it('Should give validation error when url is empty', () => {
      storage.saveSettings({
        list: [{
          url: '',
          reason: VALID_REASON,
        }],
      }, (result) => {
        assert.equal(result.length, 1);
        assert.equal(result[0], 'Keywords cannot be empty');
      });
    });
    it('Should not save duplicate items', () => {
      storage.saveSettings({
        list: [{
          url: 'test',
          reason: VALID_REASON,
        },
        {
          url: 'test',
          reason: VALID_REASON,
        }],
      }, (result) => {
        assert.equal(result.length, 1);
        assert.equal(result[0], 'Duplicate keywords founds: test');
      });
    });
    it('Should not save restricted keywords', () => {
      storage.saveSettings({
        list: [{
          url: 'newtab',
          reason: VALID_REASON,
        }],
      }, (result) => {
        assert.equal(result.length, 1);
        assert.equal(result[0], 'Restricted keyword found: newtab');
      });
    });
  });
});

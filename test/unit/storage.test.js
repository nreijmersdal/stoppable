const { assert } = require('../vendor/chai-4.1.1.js');
const storage = require('../../src/storage.js');

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
    it('Should give an error when redirectUrl, seconds, unlockLength or question are missing', () => {
      storage.saveSettings({
        redirectUrl: '',
        seconds: '',
        unlockLength: '',
        question: '',
      }, (result) => {
        assert.equal(result.length, 4);
        assert.equal(result[0], 'Seconds cannot be empty');
        assert.equal(result[1], 'Characters to unlock cannot be empty');
        assert.equal(result[2], 'Question cannot be empty');
        assert.equal(result[3], 'ESC-key redirects to cannot be empty');
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
    it('Should not save productivity url with out a valid url', () => {
      storage.saveSettings({
        list: [],
        redirectUrl: 'missing_protocol',
      }, (result) => {
        assert.equal(result.length, 1);
        assert.equal(result[0], 'Productivity URL is not valid');
      });
    });
  });
});

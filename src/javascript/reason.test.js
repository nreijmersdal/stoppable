const assert = require('../vendor/chai-4.1.1.js').assert;
const reason = require('./reason.js');

describe('Reason', () => {
  describe('isValid', () => {
    const VALID_REASON = 'This is a valid reason to unlock, is it not?';

    it('Should not accept les than 30 characters', () => {
      const result = reason.isValid('1');
      assert.equal(result, false);
    });
    it('Should contain atleast 30 characters', () => {
      const result = reason.isValid(VALID_REASON);
      assert.equal(result, true);
    });
    it('Should not accept less than 3 spaces', () => {
      const result = reason.isValid('0 1 2...................................');
      assert.equal(result, false);
    });
    it('Should contain atleast 3 spaces', () => {
      const result = reason.isValid(VALID_REASON);
      assert.equal(result, true);
    });
    it('Should not accept recuring pattern 3 times', () => {
      const result = reason.isValid('dsf dsf dsf ............................');
      assert.equal(result, false);
    });
    it('Should accept recuring pattern 2 times', () => {
      const result = reason.isValid('Because I need to unlock to see this now!');
      assert.equal(result, true);
    });
  });
});

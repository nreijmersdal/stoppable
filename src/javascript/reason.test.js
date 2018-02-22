const assert = require('../vendor/chai-4.1.1.js').assert;
const reason = require('./reason.js')({
  storage: {
    getSettings(callback) {
      callback({ unlockLength: 30 });
    },
  },
});

describe('Reason', () => {
  describe('isValid', () => {
    const VALID_REASON = 'This is a valid reason to unlock, is it not?';

    it('Should not accept less than 30 characters', () => {
      const result = reason.isValid('daf');
      assert.equal(result.message, 'Still 27 character(s) left');
      assert.equal(result.valid, false);
    });
    it('Should trim reason with space on the end', () => {
      const result = reason.isValid('daf ');
      assert.equal(result.message, 'Still 26 character(s) left');
      assert.equal(result.valid, false);
    });
    it('Should contain atleast 30 characters', () => {
      const result = reason.isValid(VALID_REASON);
      assert.equal(result.message, '');
      assert.equal(result.valid, true);
    });
    it('Should not accept less than 3 spaces', () => {
      const result = reason.isValid('Zero One Twooooooooooooooooooooooooooooo');
      assert.equal(result.message, 'Still 1 word(s) left');
      assert.equal(result.valid, false);
    });
    it('Should contain atleast 3 spaces', () => {
      const result = reason.isValid(VALID_REASON);
      assert.equal(result.valid, true);
    });
    it('Should not accept recuring pattern 3 times', () => {
      const result = reason.isValid('daf daf daf daf daf daf daf daf daf daf.');
      assert.equal(result.message, 'Recurring pattern: daf');
      assert.equal(result.valid, false);
    });
    it('Should accept recuring pattern 2 times', () => {
      const result = reason.isValid('Because I need to unlock to see this now!');
      assert.equal(result.valid, true);
    });
    it('Should not accept words without vowels', () => {
      const result = reason.isValid('Sdfghsd sdfghjs dfhjgsdf khdjsgfdsfghjsdf');
      assert.equal(result.message, 'Missing vowels in: Sdfghsd, sdfghjs, dfhjgsdf, khdjsgfdsfghjsdf');
      assert.equal(result.valid, false);
    });
    it('Should accept words like why and shy', () => {
      const result = reason.isValid('why I am shy, this is great until it isnt');
      assert.equal(result.valid, true);
    });
    it('Should accept numbers', () => {
      const result = reason.isValid('Should accept numbers like 360 or 12');
      assert.equal(result.valid, true);
    });
    it('Should accept vowelless words', () => {
      const result = reason.isValid('brr brrr bzzt grrr hm hmm mm mmm mhmm pfft pht phpht psst nth sh shh zzz');
      assert.equal(result.valid, true);
    });
    it('Should accept vowelless words with commas', () => {
      const result = reason.isValid('brr, brrr bzzt grrr hm hmm mm mmm mhmm pfft pht phpht psst nth sh shh zzz');
      assert.equal(result.valid, true);
    });
  });
});

const { assert } = require('../vendor/chai-4.1.1.js');
const status = require('../../src/status.js');

describe('Status', () => {
  let div;
  before(() => {
    div = document.createElement('div');
    div.id = 'status';
    document.body.appendChild(div);
  });
  after(() => {
    div.remove();
  });
  describe('showError', () => {
    it('Should show a red text in the status location', () => {
      status.showError('Error message');
      assert.equal(div.style.color, 'red');
      assert.equal(div.innerHTML, 'Error message');
    });
  });
  describe('showMessage', () => {
    it('Should show a black text in the status location', () => {
      status.showMessage('Normal message');
      assert.equal(div.style.color, 'black');
      assert.equal(div.innerHTML, 'Normal message');
    });
  });
});

const { assert } = require('../vendor/chai-4.1.1.js');
const dom = require('../../src/dom.js');

describe('Dom', () => {
  describe('createDiv', () => {
    it('Should create a div with class', () => {
      const div = dom.create({
        tag: 'div',
        classname: 'class',
      });
      dom.addToBody(div);
      assert.equal(div, document.getElementsByTagName('div')[0]);
      assert.equal(div, document.getElementsByClassName('class')[0]);
      div.remove();
    });
    it('Should create a h1 with class and text', () => {
      const h1 = dom.create({
        tag: 'h1',
        innerHTML: 'My header',
        classname: 'class',
      });
      dom.addToBody(h1);
      assert.equal(document.getElementsByTagName('h1')[0], h1);
      assert.equal('My header', document.getElementsByClassName('class')[0].innerHTML);
      h1.remove();
    });
    it('Should create a input with class and placeholder', () => {
      const input = dom.create({
        tag: 'input',
        placeholder: 'Placeholder',
        classname: 'input',
      });
      dom.addToBody(input);
      assert.equal(input, document.getElementsByClassName('input')[0]);
      assert.equal(document.getElementsByClassName('input')[0].placeholder, 'Placeholder');
      input.remove();
    });
  });
  describe('hide', () => {
    it('Should hide element', () => {
      const div = dom.create({ tag: 'div' });
      dom.addToBody(div);
      dom.hide(div);
      assert.equal(div.style.display, 'none');
      div.remove();
    });
  });
  describe('show', () => {
    it('Should show element', () => {
      const div = dom.create({ tag: 'div' });
      dom.addToBody(div);
      dom.hide(div);
      dom.show(div);
      assert.equal(div.style.display, '');
      div.remove();
    });
  });
  describe('remove', () => {
    it('Should remove first element with classname', () => {
      const div = dom.create({ tag: 'div', classname: 'remove' });
      dom.addToBody(div);
      assert.equal(document.getElementsByClassName('remove').length, 1);
      dom.remove('remove');
      assert.equal(document.getElementsByClassName('remove').length, 0);
    });
  });
  describe('waitForBody', () => {
    it('Should execute code when body is shown', (done) => {
      const html = document.getElementsByTagName('html')[0];
      html.removeChild(document.body);
      assert.equal(document.getElementsByTagName('body').length, 0);
      dom.waitForBody(done);
      html.appendChild(document.createElement('body'));
      assert.equal(document.getElementsByTagName('body').length, 1);
    });
    it('Should execute code when body already exists', (done) => {
      assert.equal(document.getElementsByTagName('body').length, 1);
      dom.waitForBody(done);
    });
  });
});

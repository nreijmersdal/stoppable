const webdriver = require('selenium-webdriver');

const By = webdriver.By;

module.exports = function OptionsPageObject(options) {
  if (!options.browser) throw Error('options.browser is required');
  const browser = options.browser;
  let extensionId;

  const secondsInput = By.id('seconds');
  const keywordField = By.name('url');

  return {
    open: (callback) => {
      retrieveExtensionId((id) => {
        browser.get(`chrome-extension://${id}/options.html`);
        callback();
      });
    },

    setTimeout: (time, callback) => {
      browser.findElement(secondsInput).then((el) => {
        browser.actions().doubleClick(el).perform();
        el.sendKeys(time);
        callback();
      });
    },

    addItem: (keyword, reason, callback) => {
      let row;
      browser.findElement(By.id('add')).click();
      browser.findElements(keywordField).then((elements) => {
        row = elements.length - 1;
        elements[row].sendKeys(keyword);
      });
      browser.findElements(By.name('reason')).then((elements) => {
        elements[row].sendKeys(reason);
        callback();
      });
    },

    deselectItem: (item, callback) => {
      browser.findElements(keywordField).then((elements) => {
        elements.forEach((element) => {
          element.getAttribute('value').then((keyword) => {
            if (keyword === item) {
              element.click();
              callback();
            }
          });
        });
      });
    },

    save: (callback) => {
      browser.findElement(By.id('save')).click().then(() => {
        callback();
      });
    },

    getExtensionId: () => extensionId,

    getStatus: (callback) => {
      browser.findElement(By.id('status')).then((element) => {
        element.getText().then((text) => {
          callback(text);
        });
      });
    },

  };

  function retrieveExtensionId(callback) {
    if (extensionId) {
      callback(extensionId);
    } else {
      browser.get('chrome://extensions/');
      browser.switchTo().frame('extensions');
      browser.findElement(By.id('toggle-dev-on')).click();
      browser.findElements(By.className('extension-id')).then((elements) => {
        elements[1].getText().then((text) => {
          extensionId = text;
          callback(extensionId);
        });
      });
    }
  }
};

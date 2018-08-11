const webdriver = require('selenium-webdriver');

const { By } = webdriver;

module.exports = function PopupPageObject(options) {
  if (!options.browser) throw Error('options.browser is required');
  const { browser } = options;

  return {
    open: (id, callback) => {
      browser.get(`chrome-extension://${id}/popup.html`);
      callback();
    },

    add: (reason, callback) => {
      browser.findElement(By.id('reason')).then((element) => {
        element.sendKeys(reason);
      });
      browser.findElement(By.id('add')).click().then(() => {
        callback();
      });
    },

    extendTimeout: (time, callback) => {
      browser.findElement(By.id('time')).then((el) => {
        browser.actions().doubleClick(el).perform();
        el.sendKeys(time);
        browser.findElement(By.id('extend')).click();
        callback();
      });
    },

    getStatus: (callback) => {
      browser.findElement(By.id('status')).then((element) => {
        element.getText().then((text) => {
          callback(text);
        });
      });
    },

    getText: (callback) => {
      browser.findElement(By.id('url')).then((element) => {
        element.getText().then((text) => {
          callback(text);
        });
      });
    },

  };
};

const webdriver = require('selenium-webdriver');

const { By, until } = webdriver;

module.exports = function PopupPageObject(options) {
  if (!options.browser) throw Error('options.browser is required');
  const { browser } = options;

  const timeInput = By.id('time');
  const reasonInput = By.id('reason');

  return {
    open: async (id, callback) => {
      await browser.get(`chrome-extension://${id}/popup.html`);
      callback();
    },

    add: (reason, callback) => {
      browser.wait(until.elementLocated(reasonInput), 5000).then(async (element) => {
        await element.sendKeys(reason);
        browser.findElement(By.id('add')).click().then(() => {
          callback();
        });
      });
    },

    extendTimeout: (time, callback) => {
      browser.wait(until.elementLocated(timeInput), 5000).then(async (el) => {
        await el.click();
        await el.click();
        await el.sendKeys(time);
        await browser.findElement(By.id('extend')).click();
        callback();
      });
    },

    getStatus: (callback) => {
      browser.wait(until.elementLocated(By.id('status')), 5000).then((element) => {
        element.getText().then((text) => {
          callback(text);
        });
      });
    },

    getText: (callback) => {
      browser.wait(until.elementLocated(By.id('url')), 5000).then((element) => {
        element.getText().then((text) => {
          callback(text);
        });
      });
    },

  };
};

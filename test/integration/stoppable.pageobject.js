const webdriver = require('selenium-webdriver');

const { By, until } = webdriver;

module.exports = function StoppablePageObject(options) {
  if (!options.browser) throw Error('options.browser is required');
  const { browser } = options;

  const header = By.className('stoppable_header');
  const input = By.className('stoppable_input');
  const unlockButton = By.className('stoppable_button');
  const message = By.id('stoppable_message');

  return {

    unlock: (reason, callback) => {
      unlock(reason, false, callback);
    },

    unlockWithEnter: (reason, callback) => {
      unlock(reason, true, callback);
    },

    waitUntilReturned: (callback, timeout = 5000) => {
      browser.wait(until.elementLocated(header), timeout).then(() => {
        callback();
      });
    },

    isLocked: (callback) => {
      browser.findElement(header).then(() => {
        callback(true);
      }).catch(() => {
        callback(false);
      });
    },

    getMessage: (callback) => {
      browser.findElement(message).then((el) => {
        el.getText().then(text => callback(text));
      });
    },

    pressESC: (callback) => {
      browser.wait(until.elementLocated(input), 1000).then((el) => {
        el.sendKeys(webdriver.Key.ESCAPE);
        callback();
      });
    },

    pressENTER: (callback) => {
      browser.wait(until.elementLocated(input), 1000).then((el) => {
        el.sendKeys(webdriver.Key.ENTER);
        callback();
      });
    },

  };

  function unlock(reason, useEnter, callback = () => {}) {
    browser.wait(until.elementLocated(input), 1000).then(() => {
      browser.findElements(unlockButton).then((elements) => {
        elements[0].isDisplayed().then((displayed) => {
          if (!displayed) {
            browser.findElement(input).sendKeys(`${reason}${useEnter ? webdriver.Key.ENTER : ''}`).then(() => {
              if (!useEnter) browser.findElement(unlockButton).click();
              callback();
            });
          }
        });
      });
    });
  }
};
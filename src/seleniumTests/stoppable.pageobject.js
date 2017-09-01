const webdriver = require('selenium-webdriver');

const By = webdriver.By;
const Until = webdriver.until;

module.exports = function StoppablePageObject(options) {
  if (!options.driver) throw Error('options.driver is required');
  const browser = options.driver;
  const Element = require('./locatorHelper.js')({ driver: browser });

  // Locators
  const header = By.className('stoppable_header');
  const input = By.className('stoppable_input');
  const unlockButton = By.className('stoppable_button');

  // Actions
  return {

    unlock: (reason, callback) => {
      unlock(reason, false, callback);
    },

    unlockWithEnter: (reason, callback) => {
      unlock(reason, true, callback);
    },

    waitUntilReturned: (callback, timeout = 5000) => {
      browser.findElement(header).then((el) => {
        browser.wait(Until.elementIsVisible(el), timeout).then(() => {
          callback();
        });
      });
    },

    isLocked: async (callback) => {
      try {
        await browser.findElement(header);
        callback(true);
      } catch (error) {
        callback(false);
      }
    },

  };

  // Helper functions
  function unlock(reason, useEnter, callback = () => {}) {
    browser.wait(Until.elementLocated(input), 1000).then(() => {
      Element.isHidden(unlockButton);
      browser.findElement(input).sendKeys(`${reason}${useEnter ? webdriver.Key.ENTER : ''}`).then(() => {
        if (!useEnter) browser.findElement(unlockButton).click();
        callback();
      });
    });
  }
};

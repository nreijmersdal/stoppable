const webdriver = require('selenium-webdriver');

const By = webdriver.By;
const Until = webdriver.until;

module.exports = function StoppablePageObject(options) {
  if (!options.browser) throw Error('options.browser is required');
  const browser = options.browser;

  const header = By.className('stoppable_header');
  const input = By.className('stoppable_input');
  const unlockButton = By.className('stoppable_button');

  return {

    unlock: (reason, callback) => {
      unlock(reason, false, callback);
    },

    unlockWithEnter: (reason, callback) => {
      unlock(reason, true, callback);
    },

    waitUntilReturned: (callback, timeout = 5000) => {
      browser.wait(Until.elementLocated(header), timeout).then(() => {
        callback();
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

    pressESC: (callback) => {
      browser.wait(Until.elementLocated(input), 1000).then((el) => {
        el.sendKeys(webdriver.Key.ESCAPE);
        callback();
      });
    },

  };

  function unlock(reason, useEnter, callback = () => {}) {
    browser.wait(Until.elementLocated(input), 1000).then(() => {
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

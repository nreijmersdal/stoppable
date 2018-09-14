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

    isLocked: async (callback) => {
      await browser.findElement(header).then(() => {
        callback(true);
      }).catch(() => {
        callback(false);
      });
    },

    getMessage: (callback) => {
      browser.wait(until.elementLocated(message), 5000).then((el) => {
        el.getText().then(text => callback(text));
      });
    },

    pressESC: (callback) => {
      browser.wait(until.elementLocated(input), 5000).then(async (el) => {
        await el.sendKeys(webdriver.Key.ESCAPE);
        callback();
      });
    },

    pressENTER: async (callback) => {
      browser.wait(until.elementLocated(input), 5000).then(async (el) => {
        await el.sendKeys(webdriver.Key.ENTER);
        callback();
      });
    },

  };

  async function unlock(reason, useEnter, callback = () => {}) {
    await browser.wait(until.elementLocated(input), 5000).then(async () => {
      await browser.findElements(unlockButton).then(async (elements) => {
        await elements[0].isDisplayed().then(async (displayed) => {
          if (!displayed) {
            await browser.findElement(input).sendKeys(`${reason}${useEnter ? webdriver.Key.ENTER : ''}`).then(async () => {
              if (!useEnter) await browser.findElement(unlockButton).click();
              callback();
            });
          }
        });
      });
    });
  }
};

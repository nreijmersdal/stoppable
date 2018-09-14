const webdriver = require('selenium-webdriver');

const { By, until } = webdriver;

module.exports = function OptionsPageObject(options) {
  if (!options.browser) throw Error('options.browser is required');
  const { browser } = options;
  let extensionId;

  const secondsInput = By.id('seconds');
  const keywordField = By.name('url');
  const detailButton = By.css('* /deep/ paper-button[id="detailsButton"]');
  const addRow = By.id('add');

  return {
    open: (callback) => {
      retrieveExtensionId(async (id) => {
        await browser.get(`chrome-extension://${id}/options.html`);
        callback();
      });
    },

    setTimeout: (time, callback) => {
      browser.wait(until.elementLocated(secondsInput), 5000).then(async (el) => {
        await el.sendKeys(time);
        callback();
      });
    },

    addItem: async (keyword, reason, callback) => {
      await browser.wait(until.elementLocated(addRow), 5000).then(async (el) => {
        let row;
        await el.click();
        await browser.findElements(keywordField).then(async (elements) => {
          row = elements.length - 1;
          await elements[row].sendKeys(keyword);
        });
        await browser.findElements(By.name('reason')).then(async (elements) => {
          await elements[row].sendKeys(reason);
        });
      });
      callback();
    },

    deselectItem: async (item, callback) => {
      const rowElements = By.css('#list li');
      await browser.wait(until.elementLocated(rowElements), 5000).then(async () => {
        await browser.findElements(rowElements).then(async (rows) => {
          for (const row of rows) { // eslint-disable-line
            await row.findElement(keywordField).getAttribute('value').then(async (keyword) => { // eslint-disable-line
              if (keyword === item) {
                await row.findElement(By.name('selected')).click();
              }
            });
          }
        });
      });
      callback();
    },

    save: async (callback) => {
      await browser.wait(until.elementLocated(By.id('save')), 5000).then(async (el) => {
        await el.click();
      });
      callback();
    },

    getExtensionId: () => extensionId,

    getStatus: (callback) => {
      browser.wait(until.elementLocated(By.id('status')), 5000).then((element) => {
        element.getText().then((text) => {
          callback(text);
        });
      });
    },

  };

  async function retrieveExtensionId(callback) {
    if (extensionId) {
      callback(extensionId);
    } else {
      await browser.get('chrome://extensions/');
      await browser.wait(until.elementLocated(detailButton), 5000);
      await browser.findElements(detailButton).then((extentsionDetailButtons) => {
        extentsionDetailButtons[1].click().then(() => {
          browser.getCurrentUrl().then((url) => {
            [, extensionId] = url.split('=');
            callback(extensionId);
          });
        });
      });
    }
  }
};

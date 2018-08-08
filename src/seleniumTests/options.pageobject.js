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
      browser.findElements(By.css('#list li')).then((rows) => {
        rows.forEach((row) => {
          row.findElement(keywordField).getAttribute('value').then((keyword) => {
            if (keyword === item) {
              row.findElement(By.name('selected')).click();
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
      browser.findElements(By.css('* /deep/ paper-button[id="details-button"]')).then((extentsionDetailButtons) => {
        extentsionDetailButtons[1].click().then(() => {
          browser.getCurrentUrl().then((url) => {
            extensionId = url.split('=')[1];
            callback(extensionId);
          });
        });
      });
    }
  }
};

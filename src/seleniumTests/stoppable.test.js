const assert = require('../vendor/chai-4.1.1.js').assert;
const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const defaults = require('../javascript/storage.js').getDefaults();

const By = webdriver.By;
const Until = webdriver.until;

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
const options = new chrome.Options();
options.addArguments(`load-extension=${__dirname}/../../dist`);
const capabilities = options.toCapabilities(webdriver.Capabilities.chrome());
const driver = new webdriver.Builder().withCapabilities(capabilities).build();
const Stoppable = require('./stoppable.pageobject.js')({ driver });
const Element = require('./locatorHelper.js')({ driver });

test.describe('Stoppable', function tests() {
  this.timeout(120000);
  const header = By.className('stoppable_header');
  const input = By.className('stoppable_input');
  const EXAMPLE_URL = 'http://example.org';
  const EXAMPLE_REASON = '12345678901234567890';
  let extensionId;

  test.it('Change stopscreen unlock time to 1 second for tests', () => {
    driver.get('chrome://extensions/');
    driver.switchTo().frame('extensions');
    driver.findElement(By.id('toggle-dev-on')).click();
    driver.findElements(By.className('extension-id')).then((elements) => {
      elements[1].getText().then((text) => {
        extensionId = text;
        driver.get(`chrome-extension://${extensionId}/options.html`);
        driver.findElement(By.id('seconds')).then((el) => {
          driver.actions().doubleClick(el).perform();
          el.sendKeys('1');
          driver.findElement(By.id('save')).click();
        });
      });
    });
  });

  test.it('Should show stopScreen, unlock and show stopScreen again after timeout', (done) => {
    driver.get(`http://${defaults.list[0].url}`);
    Stoppable.unlock(defaults.list[0].reason);
    Stoppable.waitUntilReturned(done);
  });

  test.it('Should unlock on enter after reason has been typed.', (done) => {
    driver.get(`http://${defaults.list[0].url}`);
    Stoppable.unlockWithEnter(defaults.list[0].reason, () => {
      Element.isHidden(header);
      done();
    });
  });

  test.it('Example.org is not blocked by default', (done) => {
    driver.get(EXAMPLE_URL);
    Stoppable.isLocked((state) => {
      assert.equal(state, false);
      done();
    });
  });

  test.it('Popup gives error message when reason to short', (done) => {
    driver.get(`chrome-extension://${extensionId}/popup.html`);
    driver.findElement(By.id('reason')).then((element) => {
      element.sendKeys('');
    });
    driver.findElement(By.id('add')).click();
    driver.findElement(By.id('status')).then((element) => {
      element.getText().then((text) => {
        assert.equal(text, 'Reason to short (min 20) for keyword: example.org');
      });
      done();
    });
  });

  test.it('Can add example.org to the stoplist from the popup.', (done) => {
    driver.get(`chrome-extension://${extensionId}/popup.html`);
    driver.findElement(By.id('reason')).then((element) => {
      element.sendKeys(EXAMPLE_REASON);
    });
    driver.findElement(By.id('add')).click();
    done();
  });

  test.it('Example.org is blocked now', (done) => {
    driver.get(EXAMPLE_URL);
    Stoppable.isLocked((state) => {
      assert.equal(state, true);
      done();
    });
  });

  test.it('Popup should stated example.org is already stopped', (done) => {
    driver.get(`chrome-extension://${extensionId}/popup.html`);
    driver.findElement(By.id('url')).then((element) => {
      element.getText().then((text) => {
        assert.equal(text, 'Keyword "example.org" is already stopped.\nEdit the motivational reason in the options.');
        done();
      });
    });
  });

  test.it('Popup should stated example.org is unlocked', (done) => {
    driver.get(EXAMPLE_URL);
    driver.wait(Until.elementLocated(input), 1000).then(() => {
      driver.findElement(input).sendKeys(EXAMPLE_REASON + webdriver.Key.ENTER).then(() => {
        Element.isHidden(header);
      });
    });
    driver.get(`chrome-extension://${extensionId}/popup.html`);
    driver.findElement(By.id('url')).then((element) => {
      element.getText().then((text) => {
        assert.equal(text, 'Time still unlocked: 1 (in seconds).');
        done();
      });
    });
  });

  test.it('Should stop new sites stopped from the options pages', (done) => {
    driver.get(`chrome-extension://${extensionId}/options.html`);
    driver.findElement(By.id('add')).click();
    driver.findElements(By.name('url')).then((elements) => {
      elements[2].sendKeys('twitter.com');
    });
    driver.findElements(By.name('reason')).then((elements) => {
      elements[2].sendKeys('12345678901234567890');
    });
    driver.findElement(By.id('save')).click();
    driver.get('http:/twitter.com/');
    driver.findElements(header).then((elements) => {
      assert.equal(elements.length, 1);
      done();
    });
  });

  test.it('Should show error message when reason is to short', (done) => {
    driver.get(`chrome-extension://${extensionId}/options.html`);
    driver.findElements(By.name('reason')).then((elements) => {
      elements[2].sendKeys(webdriver.Key.BACK_SPACE);
    });
    driver.findElement(By.id('save')).click();
    driver.findElement(By.id('status')).then((element) => {
      element.getText().then((text) => {
        assert.equal(text, 'Reason to short (min 20) for keyword: twitter.com');
      });
      done();
    });
  });

  test.it('Should unstop sites when unchecked from the options pages', (done) => {
    driver.get(`chrome-extension://${extensionId}/options.html`);
    driver.findElements(By.name('selected')).then((elements) => {
      elements[2].click();
    });
    driver.findElement(By.id('save')).click();
    driver.get('http:/twitter.com/');
    driver.findElements(header).then((elements) => {
      assert.equal(elements.length, 0);
      done();
    });
  });

  test.it('Pressing ESC redirects to productivity url on stopped page', (done) => {
    driver.get(`http://${defaults.list[0].url}`);
    driver.wait(Until.elementLocated(input), 1000).then((el) => {
      el.sendKeys(webdriver.Key.ESCAPE);
      driver.getCurrentUrl().then((url) => {
        assert.equal(url, defaults.redirectUrl);
      });
      done();
    });
  });

  test.it('Pressing ESC does not redirect to productivity url when unlocked', (done) => {
    driver.get('https://github.com/nreijmersdal/stoppable');
    driver.wait(Until.elementLocated(By.name('q')), 1000).then((el) => {
      el.sendKeys(webdriver.Key.ESCAPE);
      driver.getCurrentUrl().then((url) => {
        assert.equal(url, 'https://github.com/nreijmersdal/stoppable');
      });
      done();
    });
  });

  test.after(() => {
    driver.quit();
  });

  function click(locator) {
    driver.findElement(locator).click();
  }
});

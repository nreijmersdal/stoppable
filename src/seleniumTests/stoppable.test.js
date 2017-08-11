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

test.describe('Stoppable', function tests() {
  this.timeout(120000);
  const header = By.className('stoppable_header');
  const input = By.className('stoppable_input');
  const unlockButton = By.className('stoppable_button');

  test.it('Should show stopScreen, unlock and show stopScreen again after timeout', (done) => {
    driver.get(`http://${defaults.list[0].url}`);
    driver.wait(Until.elementLocated(input), 1000).then(() => {
      assertHidden(unlockButton);
      driver.findElement(input).sendKeys(defaults.list[0].reason).then(() => {
        click(unlockButton);
        assertHidden(header);
        driver.findElement(header).then((element) => {
          driver.wait(Until.elementIsVisible(element), 5000).then(() => {
            done();
          });
        });
      });
    });
  });

  test.it('Example.org is not blocked by default', (done) => {
    driver.get('http://example.org//');
    driver.findElements(header).then((elements) => {
      assert.equal(elements.length, 0);
      done();
    });
  });

  test.it.skip('Pressing ESC redirects to productivity url', () => {
    // TODO: Implement
  });

  test.after(() => {
    driver.quit();
  });

  function assertHidden(locator) {
    driver.findElements(locator).then((elements) => {
      elements[0].isDisplayed().then((displayed) => {
        assert.equal(displayed, false, `expected ${locator} to be hidden`);
      });
    });
  }

  function click(locator) {
    driver.findElement(locator).click();
  }
});
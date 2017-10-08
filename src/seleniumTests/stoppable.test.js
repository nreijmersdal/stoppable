const assert = require('../vendor/chai-4.1.1.js').assert;
const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const defaults = require('../javascript/storage.js').getDefaults();

const browser = constructBrowser();
const Stoppable = require('./stoppable.pageobject.js')({ browser });
const Options = require('./options.pageobject.js')({ browser });
const Popup = require('./popup.pageobject.js')({ browser });

test.describe('Stoppable', function tests() {
  this.timeout(120000);
  const EXAMPLE_URL = 'http://example.org';
  const EXAMPLE_REASON = '12345678901234567890';
  const DEFAULT_ITEM_URL = `http://${defaults.list[0].url}`;

  test.it('Change stopscreen unlock time to 2 second for tests', (done) => {
    Options.open(() => {
      Options.setTimeout('00:00:02', () => {
        Options.save(() => {
          done();
        });
      });
    });
  });

  test.it('Should show stopScreen, unlock and show stopScreen again after timeout', (done) => {
    browser.get(DEFAULT_ITEM_URL);
    Stoppable.unlock(defaults.list[0].reason);
    Stoppable.waitUntilReturned(done);
  });

  test.it('Should unlock on enter after reason has been typed.', (done) => {
    browser.get(DEFAULT_ITEM_URL);
    Stoppable.unlockWithEnter(defaults.list[0].reason, () => {
      Stoppable.isLocked((state) => {
        assert.equal(state, false);
        done();
      });
    });
  });

  test.it('Should not unlock with single enter after unlock', (done) => {
    Stoppable.waitUntilReturned(() => {
      Stoppable.pressENTER(() => {
        Stoppable.isLocked((state) => {
          assert.equal(state, true);
          done();
        });
      });
    });
  });

  test.it('Example.org is not blocked by default', (done) => {
    browser.get(EXAMPLE_URL);
    Stoppable.isLocked((state) => {
      assert.equal(state, false);
      done();
    });
  });

  test.it('Popup gives error message when reason to short', (done) => {
    Popup.open(Options.getExtensionId(), () => {
      Popup.add('', () => {
        Popup.getStatus((status) => {
          assert.equal(status, 'Reason to short (min 20) for keyword: example.org');
          done();
        });
      });
    });
  });

  test.it('Can add example.org to the stoplist from the popup.', (done) => {
    Popup.open(Options.getExtensionId(), () => {
      Popup.add(EXAMPLE_REASON, () => {
        browser.get(EXAMPLE_URL);
        Stoppable.isLocked((state) => {
          assert.equal(state, true);
          done();
        });
      });
    });
  });

  test.it('Popup should stated example.org is already stopped', (done) => {
    Popup.open(Options.getExtensionId(), () => {
      Popup.getText((text) => {
        assert.equal(text, 'Keyword "example.org" is already stopped.\nEdit the motivational reason in the options.');
        done();
      });
    });
  });

  test.it('Popup should stated example.org is unlocked', (done) => {
    browser.get(EXAMPLE_URL);
    Stoppable.unlock(EXAMPLE_REASON, () => {
      Popup.open(Options.getExtensionId(), () => {
        Popup.getText((text) => {
          assert.equal(text.includes('Time still unlocked:'), true);
          done();
        });
      });
    });
  });

  test.it('Popup can extend unlock timeout for streaming site', (done) => {
    browser.get(EXAMPLE_URL);
    Stoppable.waitUntilReturned(done);
    Stoppable.unlock(EXAMPLE_REASON, () => {
      Popup.open(Options.getExtensionId(), () => {
        Popup.extendTimeout('00:00:03', () => {
          browser.get(EXAMPLE_URL);
          Stoppable.waitUntilReturned(done);
        });
      });
    });
  });

  test.it('Should stop new sites stopped from the options pages', (done) => {
    Options.open(() => {
      Options.addItem('twitter.com', '12345678901234567890', () => {
        Options.save(() => {
          browser.get('http:/twitter.com/');
          Stoppable.isLocked((state) => {
            assert.equal(state, true);
            done();
          });
        });
      });
    });
  });

  test.it('Should show error message when reason is to short', (done) => {
    Options.open(() => {
      Options.addItem('website.com', '1234567890123456789', () => {
        Options.save(() => {
          Options.getStatus((status) => {
            assert.equal(status, 'Reason to short (min 20) for keyword: website.com');
            done();
          });
        });
      });
    });
  });

  test.it('Should unstop sites when unchecked from the options pages', (done) => {
    Options.open(() => {
      Options.deselectItem('twitter.com', () => {
        Options.save(() => {
          browser.get('http:/twitter.com/');
          Stoppable.isLocked((state) => {
            assert.equal(state, false);
            done();
          });
        });
      });
    });
  });

  test.it('Pressing ESC redirects to productivity url on stopped page', (done) => {
    browser.get(DEFAULT_ITEM_URL);
    Stoppable.pressESC(() => {
      browser.getCurrentUrl().then((url) => {
        assert.equal(url, defaults.redirectUrl);
      });
      done();
    });
  });

  test.it('Pressing ESC does not redirect to productivity url when unlocked', (done) => {
    browser.get('https://github.com/nreijmersdal/stoppable');
    browser.wait(webdriver.until.elementLocated(webdriver.By.name('q')), 1000).then((el) => {
      el.sendKeys(webdriver.Key.ESCAPE);
      browser.getCurrentUrl().then((url) => {
        assert.equal(url, 'https://github.com/nreijmersdal/stoppable');
      });
      done();
    });
  });

  test.after(() => {
    browser.quit();
  });
});

function constructBrowser() {
  chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
  const options = new chrome.Options();
  options.addArguments(`load-extension=${__dirname}/../../dist`);
  const capabilities = options.toCapabilities(webdriver.Capabilities.chrome());
  return new webdriver.Builder().withCapabilities(capabilities).build();
}

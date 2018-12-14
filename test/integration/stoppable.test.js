const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const defaults = require('../../src/storage.js').getDefaults();
const { assert } = require('../vendor/chai-4.1.1.js');

const browser = constructBrowser();
const Stoppable = require('./stoppable.pageobject.js')({ browser });
const Options = require('./options.pageobject.js')({ browser });
const Popup = require('./popup.pageobject.js')({ browser });

describe('Stoppable', function tests() {
  this.timeout(120000);
  const EXAMPLE_URL = 'http://example.org';
  const EXAMPLE_REASON = 'This is a valid reason to unlock, is it not?';
  const DEFAULT_ITEM_URL = `http://${defaults.list[0].url}`;

  it('Change stopscreen unlock time to 2 second for tests', (done) => {
    Options.open(() => {
      Options.setTimeout('000002', () => {
        Options.save(() => {
          done();
        });
      });
    });
  });

  it('Should show error message when reason is to short', (done) => {
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

  it('Should show stopScreen, unlock and show stopScreen again after timeout', (done) => {
    browser.get(DEFAULT_ITEM_URL).then(() => {
      Stoppable.unlock(EXAMPLE_REASON, () => {
        Stoppable.waitUntilReturned(done);
      });
    });
  });

  it('Should unlock on enter after reason has been typed.', (done) => {
    browser.get(DEFAULT_ITEM_URL).then(() => {
      Stoppable.unlockWithEnter(EXAMPLE_REASON, () => {
        Stoppable.isLocked((state) => {
          assert.equal(state, false);
          done();
        });
      });
    });
  });

  it('Should not unlock with single enter after unlock', (done) => {
    Stoppable.waitUntilReturned(() => {
      Stoppable.pressENTER(() => {
        Stoppable.isLocked((state) => {
          assert.equal(state, true);
          done();
        });
      });
    });
  });

  it('Should show unlock help message when typing', (done) => {
    Stoppable.unlockWithEnter('Invalid short reason', () => {
      Stoppable.getMessage((message) => {
        assert.equal(message, 'Still 10 character(s) left');
        done();
      });
    });
  });

  it('Example.org is not blocked by default', (done) => {
    browser.get(EXAMPLE_URL).then(() => {
      Stoppable.isLocked((state) => {
        assert.equal(state, false);
        done();
      });
    });
  });

  it('Popup gives error message when reason to short', (done) => {
    Popup.open(Options.getExtensionId(), () => {
      Popup.add('', () => {
        Popup.getStatus((status) => {
          assert.equal(status, 'Reason to short (min 20) for keyword: example.org');
          done();
        });
      });
    });
  });

  it('Can add example.org to the stoplist from the popup.', (done) => {
    Popup.open(Options.getExtensionId(), () => {
      Popup.add(EXAMPLE_REASON, () => {
        browser.get(EXAMPLE_URL).then(() => {
          Stoppable.isLocked((state) => {
            assert.equal(state, true);
            done();
          });
        });
      });
    });
  });

  it('Popup should stated example.org is already stopped', (done) => {
    Popup.open(Options.getExtensionId(), () => {
      Popup.getText((text) => {
        assert.equal(text, 'Keyword "example.org" is already stopped.\nEdit the motivational reason in the options.');
        done();
      });
    });
  });

  it('Popup should stated example.org is unlocked', (done) => {
    browser.get(EXAMPLE_URL).then(() => {
      Stoppable.unlock(EXAMPLE_REASON, () => {
        Popup.open(Options.getExtensionId(), () => {
          Popup.getText((text) => {
            assert.equal(text.includes('Time still unlocked:'), true);
            done();
          });
        });
      });
    });
  });

  it('Popup can extend unlock timeout for streaming site', (done) => {
    browser.get(EXAMPLE_URL).then(() => {
      Stoppable.waitUntilReturned((() => {
        Stoppable.unlock(EXAMPLE_REASON, () => {
          Popup.open(Options.getExtensionId(), () => {
            Popup.extendTimeout('00:00:03', () => {
              browser.get(EXAMPLE_URL).then(() => {
                Stoppable.waitUntilReturned(done);
              });
            });
          });
        });
      }));
    });
  });

  it('Should stop new sites stopped from the options pages', (done) => {
    Options.open(() => {
      Options.addItem('twitter.com', '12345678901234567890', () => {
        Options.save(() => {
          browser.get('http:/twitter.com/').then(() => {
            Stoppable.isLocked((state) => {
              assert.equal(state, true);
              done();
            });
          });
        });
      });
    });
  });

  it('Should unstop sites when unchecked from the options pages', (done) => {
    Options.open(() => {
      Options.deselectItem('twitter.com', () => {
        Options.save(() => {
          browser.get('http:/twitter.com/').then(() => {
            Stoppable.isLocked((state) => {
              assert.equal(state, false);
              done();
            });
          });
        });
      });
    });
  });

  it('Pressing ESC redirects to productivity url on stopped page', (done) => {
    browser.get(DEFAULT_ITEM_URL).then(() => {
      Stoppable.pressESC(() => {
        browser.wait(isRedirected, 5000).then(() => {
          done();
        });
      });
    });
  });

  it('Pressing ESC does not redirect to productivity url when unlocked', (done) => {
    browser.get('https://github.com/nreijmersdal/stoppable').then(() => {
      browser.wait(webdriver.until.elementLocated(webdriver.By.name('q')), 1000).then((el) => {
        el.sendKeys(webdriver.Key.ESCAPE);
        browser.getCurrentUrl().then((url) => {
          assert.equal(url, 'https://github.com/nreijmersdal/stoppable');
          done();
        });
      });
    });
  });

  after(async () => {
    await browser.sleep(500);
    await browser.quit();
  });
});

function constructBrowser() {
  chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
  const options = new chrome.Options().addArguments(`load-extension=${__dirname}/../../dist`);
  return new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
}

async function isRedirected() {
  let result = false;
  await browser.getCurrentUrl().then((url) => {
    if (url === defaults.redirectUrl) result = true;
  });
  return result;
}

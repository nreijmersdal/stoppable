const assert = require('../vendor/chai-4.1.1.js').assert;

module.exports = function locatorHelper(options) {
  if (!options.driver) throw Error('options.driver is required');
  const browser = options.driver;

  return {
    isHidden: (locator) => {
      browser.findElements(locator).then((elements) => {
        elements[0].isDisplayed().then((displayed) => {
          assert.equal(displayed, false, `expected ${locator} to be hidden`);
        });
      });
    },
  };
};


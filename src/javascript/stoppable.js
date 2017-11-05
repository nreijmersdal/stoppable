(function stoppable() {
  const storage = require('./storage.js');
  const time = require('./time.js')();
  const dom = require('./dom.js');
  const reason = require('./reason.js');
  const stoplist = require('./stoplist.js')({
    storage,
    time,
  });

  let Settings;
  let currentSite;

  storage.getSettings((data) => {
    Settings = data;
    stoplist.findStopItem(window.location.href, (item) => {
      if (item) {
        currentSite = item;
        dom.waitForBody(() => initializeStopScreen());
      }
    });
  });

  function initializeStopScreen() {
    if (isUnlocked()) stopAgainAfterTimeout(time.left(currentSite.unlockedTill));
    else createStopScreen();
  }

  function stopAgainAfterTimeout(seconds) {
    setTimeout(() => {
      stoplist.keywordIsUnlocked(currentSite.url, (secondsLeft) => {
        if (secondsLeft) stopAgainAfterTimeout(secondsLeft);
        else createStopScreen();
      });
    }, seconds);
  }

  function switchToProductiveSiteOnEsc(event) {
    if (event.keyCode === 27) {
      window.location = Settings.redirectUrl;
    }
  }

  function unlockSite() {
    return () => {
      if (!Settings.seconds) Settings.seconds = storage.getDefaults().seconds; // TODO: Bug fix for current users. Remove this line in next version.

      currentSite.unlockedTill = time.getTimeInSeconds() + Number(Settings.seconds);

      stoplist.updateItem(currentSite, () => {
        dom.remove('stoppable_div');
        window.removeEventListener('keydown', switchToProductiveSiteOnEsc, false);
        window.removeEventListener('keydown', unlockOnEnter, false);
        stopAgainAfterTimeout(time.left(currentSite.unlockedTill));
      });
    };
  }

  function addUnlockCheckEvent(button) {
    return (event) => {
      if (reason.isValid(event.target.value)) {
        dom.show(button);
        window.addEventListener('keydown', unlockOnEnter, false);
      }
    };
  }

  function unlockOnEnter(e) {
    if (e.keyCode === 13 && !isUnlocked()) unlockSite().call();
  }

  function createStopScreen() {
    const screen = dom.create({ tag: 'div', classname: 'stoppable_div' });
    const input = dom.create({
      tag: 'input', placeholder: 'Stop, Think, Act. Why do you really want to unstop? (min 30 chars.)', classname: 'stoppable_input' });
    const unlockButton = dom.create({
      tag: 'button', innerHTML: `Unstop for ${time.secondsToMinutes(Settings.seconds)} minutes \u279f`, classname: 'stoppable_button' });

    screen.appendChild(dom.create({ tag: 'h1', innerHTML: currentSite.url, classname: 'stoppable_header' }));
    screen.appendChild(dom.createCanvasText(currentSite.reason, 'stoppable_reason'));
    screen.appendChild(input);
    screen.appendChild(unlockButton);
    dom.hide(unlockButton);
    dom.addToBody(screen);

    input.onkeyup = addUnlockCheckEvent(unlockButton);
    unlockButton.onclick = unlockSite();
    window.addEventListener('keydown', switchToProductiveSiteOnEsc, false);

    atEndOfLoadingFocus(input);
  }

  function isUnlocked() {
    return currentSite.unlockedTill && time.getTimeInSeconds() < currentSite.unlockedTill;
  }

  function atEndOfLoadingFocus(el) {
    el.focus();
    window.onload = () => {
      // Wait some milliseconds because some sites have their own focus.
      sleep(200).then(() => {
        el.focus();
      });
    };
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}());

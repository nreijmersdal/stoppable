(function stoppable() {
  const storage = require('./storage.js');
  const time = require('./time.js')();
  const dom = require('./dom.js');
  const stoplist = require('./stoplist.js')({
    storage,
    time,
  });

  let Settings;
  let currentSite;

  storage.getSettings((data) => {
    Settings = data;
    currentSite = findSiteInStopList();
    if (currentSite) dom.waitForBody(() => initializeStopScreen());
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

  function addUnlockCheckEvent(button, input) {
    return (event) => {
      if (event.target.value.toLowerCase() === currentSite.reason.toLowerCase()) {
        dom.hide(input);
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
      tag: 'input', placeholder: 'Type your complete reason\u2934 to continue the visit...', classname: 'stoppable_input' });
    const unlockButton = dom.create({
      tag: 'button', innerHTML: `Unstop for ${time.secondsToMinutes(Settings.seconds)} minutes \u279f`, classname: 'stoppable_button' });

    screen.appendChild(dom.create({ tag: 'h1', innerHTML: currentSite.url, classname: 'stoppable_header' }));
    screen.appendChild(dom.createCanvasText(currentSite.reason, 'stoppable_reason'));
    screen.appendChild(input);
    screen.appendChild(unlockButton);
    dom.hide(unlockButton);
    dom.addToBody(screen);

    input.onkeyup = addUnlockCheckEvent(unlockButton, input);
    unlockButton.onclick = unlockSite();
    window.addEventListener('keydown', switchToProductiveSiteOnEsc, false);

    atEndOfLoadingFocus(input);
  }

  function findSiteInStopList() {
    if (Settings.list === undefined) return false;
    const result = Settings.list.filter((item) => {
      if (window.location.href.includes(item.url)) return true;
      return false;
    });
    return result[0];
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

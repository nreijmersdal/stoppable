/* globals MutationObserver */
(function stoppable() {
  const storage = require('./storage.js');
  const time = require('./time.js')();
  const stoplist = require('./stoplist.js')({
    storage,
    time,
  });

  let Settings;
  let currentSite;
  let input;
  let unlockButton;
  let stopScreen;

  storage.getSettings((data) => {
    Settings = data;
    currentSite = findSiteInStopList();
    if (currentSite) waitForBody(() => initializeStopScreen());
  });

  function initializeStopScreen() {
    stopScreen = createStopScreen();
    input.onkeyup = addUnlockCheckEvent();
    unlockButton.onclick = unlockSite();

    decideToShowOrHideStopScreen();
    atEndOfLoadingFocus();
  }

  function decideToShowOrHideStopScreen() {
    if (!isUnlocked()) {
      show(stopScreen);
      window.addEventListener('keydown', switchToProductiveSiteOnEsc, false);
    } else {
      hide(stopScreen);
      stopAgainAfterTimeout(time.left(currentSite.unlockedTill));
    }
  }

  function stopAgainAfterTimeout(seconds) {
    setTimeout(() => {
      stoplist.keywordIsUnlocked(currentSite.url, (secondsLeft) => {
        if (secondsLeft) stopAgainAfterTimeout(secondsLeft);
        else {
          show(stopScreen);
          window.addEventListener('keydown', switchToProductiveSiteOnEsc, false);
        }
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
        hide(unlockButton);
        input.value = '';
        show(input);
        hide(stopScreen);
        window.removeEventListener('keydown', switchToProductiveSiteOnEsc, false);
        stopAgainAfterTimeout(time.left(currentSite.unlockedTill));
      });
    };
  }

  function addUnlockCheckEvent() {
    return (event) => {
      if (event.target.value.toLowerCase() === currentSite.reason.toLowerCase()) {
        hide(input);
        show(unlockButton);
        window.addEventListener('keydown', (e) => {
          if (e.keyCode === 13 && !isUnlocked()) {
            unlockButton.click();
          }
        }, false);
      }
    };
  }

  function createStopScreen() {
    input = createInput('Type your complete reason\u2934 to continue the visit...', 'stoppable_input');
    unlockButton = createHiddenButton(`Unstop for ${time.secondsToMinutes(Settings.seconds)} minutes \u279f`, 'stoppable_button');
    const header = createHeader(currentSite.url, 'stoppable_header');
    const reason = createCanvasText(currentSite.reason, 'stoppable_reason');
    const container = createContainer();
    container.appendChild(header);
    container.appendChild(reason);
    container.appendChild(input);
    container.appendChild(unlockButton);
    return container;
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

  function createContainer() {
    const div = document.createElement('div');
    div.classList.add('stoppable_div');
    document.body.appendChild(div);
    return div;
  }

  function createHeader(text, className) {
    const h1 = document.createElement('h1');
    h1.innerHTML = text;
    h1.classList.add(className);
    return h1;
  }

  function createCanvasText(text, className) {
    const canvas = createHiResCanvas(800, 75);
    canvas.classList.add(className);
    const ctx = canvas.getContext('2d');
    ctx.font = '25px Helvetica Neue, Helvetica, sans-serif';
    ctx.fillStyle = '#AACCFF';
    ctx.fillText(text, 0, 50, 800);
    return canvas;
  }

  function createInput(placeholder, className) {
    const el = document.createElement('input');
    el.placeholder = placeholder;
    el.classList.add(className);
    return el;
  }

  function createHiddenButton(text, className) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.classList.add(className);
    hide(button);
    return button;
  }

  function createHiResCanvas(width, height) {
    const canvas = document.createElement('canvas');
    const ratio = window.devicePixelRatio;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
    return canvas;
  }

  function hide(element) {
    element.style.display = 'none'; // eslint-disable-line no-param-reassign
  }

  function show(element) {
    element.style.display = ''; // eslint-disable-line no-param-reassign
  }

  function atEndOfLoadingFocus() {
    input.focus();
    window.onload = () => {
      // Wait some milliseconds because some sites have their own focus.
      sleep(200).then(() => {
        input.focus();
      });
    };
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function waitForBody(callback) {
    if (!document.body) {
      const pageObserver = new MutationObserver(() => {
        if (document.body) {
          callback();
          pageObserver.disconnect();
        }
      });
      pageObserver.observe(document.documentElement, { childList: true });
    } else {
      callback();
    }
  }
}());

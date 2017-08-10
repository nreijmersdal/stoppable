/* globals MutationObserver */
(function stoppable() {
  const storage = require('./storage.js');
  const time = require('./time.js')();
  const stoplist = require('./stoplist.js')({
    storage: require('./storage.js'),
    time,
  });

  const PLACEHOLDER = 'Type your complete reason\u2934 to continue the visit...';
  const UNLOCK_TIME = 15;
  const UNSTOP_BUTTON = `Unstop for ${UNLOCK_TIME} minutes \u279f`;

  let redirectUrl = '';

  storage.getSettings((settings) => {
    redirectUrl = settings.redirectUrl;
    const site = isCurrentSiteInStoplist(settings.list);
    if (site) {
      const header = createHeader(site.url, 'stoppable_header');
      const reason = createCanvasText(site.reason, 'stoppable_reason');
      const input = createInput(PLACEHOLDER, 'stoppable_input');
      const unlockButton = createHiddenButton(UNSTOP_BUTTON, 'stoppable_button');

      if (!document.body) {
        const pageObserver = new MutationObserver(() => {
          if (document.body) {
            initializeAndShowStopScreen(header, reason, input, unlockButton, site);
            pageObserver.disconnect();
          }
        });
        pageObserver.observe(document.documentElement, { childList: true });
      } else {
        initializeAndShowStopScreen(header, reason, input, unlockButton, site);
      }
    }
  });

  function initializeAndShowStopScreen(header, reason, input, unlockButton, site) {
    const stopScreen = createStopScreen(header, reason, input, unlockButton);
    input.onkeyup = addUnlockCheckEvent(site, input, unlockButton); // eslint-disable-line no-param-reassign
    unlockButton.onclick = unlockSite(site, input, unlockButton, stopScreen); // eslint-disable-line no-param-reassign
    atEndOfLoadingFocus(input);
    window.addEventListener('keydown', switchToProductiveSiteOnEsc, false);
  }

  function stopAgainAfterTimeout(stopScreen) {
    setTimeout(() => {
      show(stopScreen);
    }, UNLOCK_TIME * 60 * 1000);
  }

  function switchToProductiveSiteOnEsc(event) {
    if (event.keyCode === 27) {
      window.location = redirectUrl;
    }
  }

  function unlockSite(site, input, unlockButton, stopScreen) {
    return () => {
      const data = {
        url: site.url,
        reason: site.reason,
        unlockedTill: time.getTimestampMinutesInTheFuture(UNLOCK_TIME),
      };

      stoplist.updateItem(data, () => {
        hide(unlockButton);
        input.value = ''; // eslint-disable-line no-param-reassign
        show(input);
        hide(stopScreen);
        stopAgainAfterTimeout(stopScreen);
      });
    };
  }

  function addUnlockCheckEvent(site, input, visitButton) {
    return (event) => {
      if (event.target.value.toLowerCase() === site.reason.toLowerCase()) {
        hide(input);
        show(visitButton);
      }
    };
  }

  function createStopScreen(header, reason, input, visitButton) {
    const container = createContainer();
    container.appendChild(header);
    container.appendChild(reason);
    container.appendChild(input);
    container.appendChild(visitButton);
    return container;
  }

  function isCurrentSiteInStoplist(stopList) {
    const tabUrl = window.location;
    if (stopList === undefined) return false;
    const result = stopList.filter((item) => {
      if (isOnStopList(tabUrl, item)) {
        if (isUnlocked(item)) return false;
        return true;
      }
      return false;
    });

    return result[0];
  }

  function isOnStopList(url, item) {
    return url.href.includes(item.url);
  }

  function isUnlocked(item) {
    return item.unlockedTill && time.getTimeInSeconds() < item.unlockedTill;
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
    const input = document.createElement('input');
    input.placeholder = placeholder;
    input.classList.add(className);
    return input;
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

  function atEndOfLoadingFocus(input) {
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
}());

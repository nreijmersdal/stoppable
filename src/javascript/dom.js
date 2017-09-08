/* globals MutationObserver */
(function dom() {
  exports.hide = (element) => {
    element.style.display = 'none'; // eslint-disable-line no-param-reassign
  };
  exports.show = (element) => {
    element.style.display = ''; // eslint-disable-line no-param-reassign
  };
  exports.remove = (classname) => {
    document.getElementsByClassName(classname)[0].remove();
  };

  exports.create = (options) => {
    if (!options.tag) return null;
    const el = document.createElement(options.tag);
    if (options.id) el.id = options.id;
    if (options.type) el.type = options.type;
    if (options.step) el.setAttribute('step', options.step);
    if (options.maxlength) el.setAttribute('maxLength', options.maxlength);
    if (options.required) el.required = options.required;
    if (options.classname) el.classList.add(options.classname);
    if (options.innerHTML) el.innerHTML = options.innerHTML;
    if (options.placeholder) el.placeholder = options.placeholder;
    return el;
  };

  exports.addToBody = (el) => {
    document.body.appendChild(el);
  };

  exports.waitForBody = (callback) => {
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
  };

  exports.createCanvasText = (text, className) => {
    const canvas = createHiResCanvas(800, 75);
    canvas.classList.add(className);
    const ctx = canvas.getContext('2d');
    ctx.font = '25px Helvetica Neue, Helvetica, sans-serif';
    ctx.fillStyle = '#AACCFF';
    ctx.fillText(text, 0, 50, 800);
    return canvas;
  };

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
}());

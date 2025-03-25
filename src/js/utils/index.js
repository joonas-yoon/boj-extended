const Utils = {
  loadCSS: function (url) {
    const path = chrome.runtime.getURL(url);
    const css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', path);
    document.getElementsByTagName('head')[0].appendChild(css);
  },
  loadScript: function (url) {
    const path = chrome.runtime.getURL(url);
    const tag = document.createElement('script');
    tag.setAttribute('type', 'text/javascript');
    tag.setAttribute('src', path);
    document.getElementsByTagName('body')[0].appendChild(tag);
  },
  createElement: function (tag, attrs) {
    const keys = Object.keys(attrs || {});
    const el = document.createElement(tag || 'div');
    for (const key of keys) {
      const value = attrs[key];
      if (key == 'children') {
        const iteration = Array.isArray(value) ? value : [value];
        for (const child of iteration) {
          el.appendChild(child);
        }
      } else {
        el.setAttribute(key, value);
      }
    }
    return el;
  },
  createRadioElement: function (labelText, changeEvent, checked) {
    const randID = Math.random().toString(36).substr(2);
    const div = Utils.createElement('div', {
      class: 'form-check form-check-inline',
      style: 'display: inline; margin-right: 1em;',
    });

    const input = Utils.createElement('input', {
      class: 'form-check-input',
      type: 'radio',
      id: randID,
      name: 'radio-extended',
    });
    input.addEventListener('change', changeEvent);
    input.checked = !!checked;

    const label = Utils.createElement('label', {
      class: 'form-check-label',
      for: randID,
      style: 'margin-left: 5px;',
    });
    label.innerText = labelText;

    div.appendChild(input);
    div.appendChild(label);
    return div;
  },
  createCheckboxElement: function (labelText, checkboxName) {
    const randID = Math.random().toString(36).substr(2);
    const div = Utils.createElement('div', {
      class: 'form-check form-check-inline',
      style: 'display: inline; margin-right: 1em;',
    });

    const input = Utils.createElement('input', {
      class: 'form-check-input',
      type: 'checkbox',
      id: randID,
      name: checkboxName,
    });

    const label = Utils.createElement('label', {
      class: 'form-check-label',
      for: randID,
      style: 'margin-left: 5px;',
    });
    label.innerText = labelText;

    div.appendChild(input);
    div.appendChild(label);
    return { container: div, input, label };
  },
  isElement: function (obj) {
    try {
      // Using W3 DOM2 (works for FF, Opera and Chrome)
      return obj instanceof HTMLElement;
    } catch (e) {
      // Browsers not supporting W3 DOM2 don't have HTMLElement and
      // an exception is thrown and we end up here. Testing some
      // properties that all elements have (works on IE7)
      return (
        typeof obj === 'object' &&
        obj.nodeType === 1 &&
        typeof obj.style === 'object' &&
        typeof obj.ownerDocument === 'object'
      );
    }
  },
  defaultAsTrue: (value) => !(value === false),
  defaultAsFalse: (value) => value === true,
};

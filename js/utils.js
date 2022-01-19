const Utils = {
  requestAjax: function (url, callback) {
    const httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      console.error('Can not create XMLHTTP instance.');
      return false;
    }
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
          try {
            callback(httpRequest.responseText, null);
          } catch (err) {
            console.error(err.message + ' in ' + httpRequest.responseText);
            callback(null, err.message);
          }
        } else {
          callback(null, httpRequest.status);
        }
      }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
  },
  loadCSS: function (url) {
    const path = chrome.extension.getURL(url);
    const css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', path);
    document.getElementsByTagName('head')[0].appendChild(css);
  },
  loadScript: function (url) {
    const path = chrome.extension.getURL(url);
    const tag = document.createElement('script');
    tag.setAttribute('type', 'text/javascript');
    tag.setAttribute('src', path);
    document.getElementsByTagName('body')[0].appendChild(tag);
  },
  createElement: function (tag, attrs) {
    const keys = Object.keys(attrs || {});
    const el = document.createElement(tag || 'div');
    for (let i = 0; i < keys.length; ++i) {
      el.setAttribute(keys[i], attrs[[keys[i]]]);
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
};

function getMyUsername() {
  const username = document.querySelector('ul.loginbar a.username');
  if (username) return username.innerText;
  else return null;
}

function isLoggedIn() {
  return getMyUsername() !== null;
}

// progress bar for timer
function progressTimer() {
  const progress = document.createElement('div');
  progress.setAttribute('class', 'progress');

  const barLeft = document.createElement('div');
  barLeft.setAttribute('class', 'progress-bar');
  progress.appendChild(barLeft);
  const barRight = document.createElement('div');
  barRight.setAttribute('class', 'progress-bar');
  barRight.innerText = 'Loading...';
  progress.appendChild(barRight);

  function timeHumanize(ms) {
    let txt = '';
    ms = parseInt(ms / 1000); // ms -> sec
    if (ms % 60 > 0) txt = (ms % 60) + '초 ' + txt;
    ms = parseInt(ms / 60); // sec -> min
    if (ms % 60 > 0) txt = (ms % 60) + '분 ' + txt;
    ms = parseInt(ms / 60); // min -> hour
    if (ms % 24 > 0) txt = (ms % 24) + '시간 ' + txt;
    ms = parseInt(ms / 24); // hour -> day
    if (ms > 0) txt = ms + '일 '; // n일부터는 시간 생략
    return txt ? txt : '1초 미만';
  }

  function updateProgress(startTime, endTime, callback) {
    const remainTime = endTime - new Date().getTime() + 1;
    const passedTime = new Date().getTime() - startTime;
    const percentage = (100 * remainTime) / (endTime - startTime);
    // overdue
    if (remainTime < 0) {
      barLeft.setAttribute('style', 'display: none;');
      barRight.setAttribute(
        'style',
        'float:left; transition-duration: .2s; width: 100%; background-color:#dc3545;'
      );
      barRight.innerText = timeHumanize(-remainTime) + ' 지남';
    } else {
      let bg = '';
      if (percentage <= 50) bg = 'background-color:#ffc107;';
      else if (percentage <= 10) bg = 'background-color:#dc3545;';
      barLeft.setAttribute(
        'style',
        'float:left; transition-duration: .2s; width:' +
          (100 - percentage) +
          '%;  background-color:transparent; color: inherit;'
      );
      barLeft.innerText = timeHumanize(passedTime) + ' 지남';
      barRight.setAttribute(
        'style',
        'float:right; transition-duration: .2s; width:' + percentage + '%;' + bg
      );
      barRight.innerText = timeHumanize(remainTime) + ' 남음';
    }
    if (progress.getAttribute('state') === 'running') {
      window.requestAnimationFrame(
        updateProgress.bind(null, startTime, endTime, callback)
      );
    } else {
      callback();
    }
  }

  return {
    element: function () {
      return progress;
    },
    start: function (startTime, endTime, callback) {
      if (progress.getAttribute('state') === 'running') {
        console.error('already started');
        return;
      }
      progress.setAttribute('state', 'running');
      updateProgress(startTime, endTime, callback);
    },
    stop: function () {
      progress.setAttribute('state', 'stop');
    },
    text: function (text) {
      // like jquery style
      if (text) barRight.innerText = text;
      return text;
    },
    show: function () {
      progress.style.display = 'block';
    },
    hide: function () {
      progress.style.display = 'none';
    },
  };
}

function createVsForm(name1, name2) {
  const div = Utils.createElement('div', {
    class: 'vs',
    style: 'margin-bottom: 10px',
  });
  const row = Utils.createElement('div', { class: 'row' });
  const colpad = Utils.createElement('div', {
    class: 'col col-sr-only col-md-1',
  });
  const colbtn = Utils.createElement('div', { class: 'col col-md-2' });
  const col1 = Utils.createElement('div', { class: 'col col-md-4' });
  const col2 = col1.cloneNode();
  row.appendChild(colpad.cloneNode());
  row.appendChild(col1);
  row.appendChild(colbtn);
  row.appendChild(col2);
  row.appendChild(colpad.cloneNode());
  div.appendChild(row);
  const input1 = Utils.createElement('input', {
    type: 'text',
    class: 'form-control',
    value: name1 || '',
    placeholder: 'Username',
  });
  const input2 = Utils.createElement('input', {
    type: 'text',
    class: 'form-control',
    value: name2 || '',
    placeholder: 'Username',
  });
  col1.appendChild(input1);
  col2.appendChild(input2);
  const btn = Utils.createElement('button', {
    type: 'button',
    class: 'btn btn-primary btn-block',
  });
  btn.innerText = 'VS';
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const v1 = input1.value;
    const v2 = input2.value;
    input1.setAttribute(
      'class',
      'form-control' + (v1 ? '' : ' text-border-red bg-color-red')
    );
    input2.setAttribute(
      'class',
      'form-control' + (v2 ? '' : ' text-border-red bg-color-red')
    );
    if (v1 && v2) window.location = `https://www.acmicpc.net/vs/${v1}/${v2}`;
  });
  colbtn.appendChild(btn);
  return div;
}

function addElementToBar(element) {
  const bar = document.querySelector('ul.loginbar');
  const divider = Utils.createElement('li', { class: 'topbar-devider' });
  bar.appendChild(divider);
  bar.appendChild(element);
}

// return { pid: className, 1001: 'result-ac', 1002: 'result-pac', 1003: 'result-wa', ... }
async function fetchProblemsByUser(id) {
  if (!id) return null;

  // parse user information
  function parse(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const problems = doc.querySelectorAll(
      'a[href^="/problem/"][class^="result-"]'
    );
    const results = {};
    for (const a of problems) {
      const pid = getLastNumberFromHref(a.href);
      const cls = a.getAttribute('class');
      results[pid] = cls;
    }
    return results;
  }

  const storageKey = Constants.STORAGE_PREFIX + 'problems_' + id;
  const storedValue = await localStorage.getItem(storageKey);
  console.log('fetch from storage:', storageKey, storedValue);
  const cacheData = JSON.parse(storedValue) || {};
  console.log('cacheData', cacheData);
  const result = {};

  const currentTimestamp = new Date().getTime();
  const duration = 5 * 60 * 1000; // 5 minutes, in milliseconds
  const isDateExpired =
    cacheData &&
    Number(cacheData.lastUpdated || 0) + duration < currentTimestamp;
  if (cacheData == null || cacheData.problems == null || isDateExpired) {
    // run request and parse
    const response = await fetch(`/user/${id}`);
    console.group(`request new problems solved by ${id}`);
    // on succeed
    if (response.status === 200) {
      result.problems = await parse(await response.text());
      result.lastUpdated = currentTimestamp;
    }
    await localStorage.setItem(storageKey, JSON.stringify(result));
    console.log('saved to localStorage', result);
    console.groupEnd();
    return result.problems;
  }
  return cacheData.problems;
}

function getLastNumberFromHref(href) {
  return parseInt(href.substr(href.lastIndexOf('/') + 1));
}

function getPathname(url) {
  try {
    if (/^http(s)?:\/\//.test(url)) url = new URL(url);
    else url = new URL(location.protocol + location.hostname + url);
    return url.pathname;
  } catch (error) {
    return null;
  }
}

function getProblemID(url) {
  url = getPathname(url);
  if (!url || !/^\/problem\/[0-9]{4,}$/.test(url)) return null;
  const pid = getLastNumberFromHref(url);
  return pid == null || isNaN(pid) ? null : pid;
}

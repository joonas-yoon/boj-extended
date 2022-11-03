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
  const colbtn = Utils.createElement('div', { class: 'col col-md-2' });
  const col1 = Utils.createElement('div', { class: 'col col-md-5' });
  const col2 = col1.cloneNode();
  row.appendChild(col1);
  row.appendChild(colbtn);
  row.appendChild(col2);
  div.appendChild(row);
  const input1 = Utils.createElement('input', {
    type: 'text',
    class: 'form-control text-right',
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
    class: 'btn btn-primary btn-vs btn-block',
  });
  btn.innerText = 'VS';
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const v1 = input1.value;
    const v2 = input2.value;
    input1.setAttribute(
      'class',
      'form-control text-right' + (v1 ? '' : ' text-border-red bg-color-red')
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

/**
 * fetch information for problems from user profile
 *
 * @param {string} id username
 * @return {Array} classes for problem color { pid: className, 1001: 'result-ac', ... }
 */
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
  const storedValue = LocalCache.get(storageKey, { expired: 5 * 60 * 1000 });
  console.groupCollapsed('fetch from storage');
  console.log(storageKey, storedValue);
  const cacheData = storedValue || {};
  console.log('cacheData', cacheData);
  console.groupEnd();
  const result = {};
  const isDateExpired = storedValue === null;
  if (!cacheData.problems || isDateExpired) {
    // run request and parse
    const response = await fetch(`/user/${id}`);
    console.group(`request new problems solved by ${id}`);
    // on succeed
    if (response.status === 200) {
      result.problems = await parse(await response.text());
    }
    LocalCache.add(storageKey, result);
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

function createProblemLinkElement(baseElement, problemsLookup, pid) {
  const a = baseElement.cloneNode();
  let pname = `(가져오기 실패)`;
  try {
    pname = problemsLookup[pid]['title'];
  } catch (err) {
    console.info(`No problem title for ${pid} yet`);
  }
  a.classList.add('problem-link-style-box');
  a.innerHTML =
    '<span class="pid">' +
    pid +
    '</span> <span class="pname">' +
    pname +
    '</span>';
  return a;
}

function createFontStyleElement({ url, family }) {
  const TAGS =
    'body, input, button, select, textarea, h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, .purchase span';
  const INHERITED_FONTS =
    "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans CJK KR', 'Noto Sans KR', '나눔바른고딕', '나눔고딕', '맑은고딕', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
  const importUrl = "@import url('" + url + "');";
  const overrideRule =
    TAGS +
    ' { font-family: ' +
    family +
    ', ' +
    INHERITED_FONTS +
    ' !important; }';
  const ruleString = (url ? importUrl : '') + (family ? overrideRule : '');
  const styleTag = document.createElement('style');
  styleTag.innerText = ruleString;
  return styleTag;
}

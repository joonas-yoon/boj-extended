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
    const keys = Object.keys(attrs);
    const el = document.createElement(tag || 'div');
    for (let i = 0; i < keys.length; ++i) {
      el.setAttribute(keys[i], attrs[[keys[i]]]);
    }
    return el;
  }
};

// progress bar for timer
function progressTimer() {
  const progress = document.createElement('div');
  progress.setAttribute('class', 'progress');

  const bar = document.createElement('div');
  bar.setAttribute('class', 'progress-bar');
  bar.innerText = 'Loading...';
  progress.appendChild(bar);

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
    const curTime = endTime - new Date().getTime() + 1;
    const percentage = (100 * curTime) / (endTime - startTime);
    // overdue
    if (curTime < 0) {
      bar.setAttribute(
        'style',
        'float:left; transition-duration: .2s; width: 100%; background-color:#dc3545;'
      );
      bar.innerText = timeHumanize(-curTime) + ' 지남';
    } else {
      let bg = '';
      if (percentage <= 50) bg = 'background-color:#ffc107;';
      else if (percentage <= 10) bg = 'background-color:#dc3545;';
      bar.setAttribute(
        'style',
        'float:right; transition-duration: .2s; width:' + percentage + '%;' + bg
      );
      bar.innerText = timeHumanize(curTime) + ' 남음';
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
      if (text) bar.innerText = text;
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

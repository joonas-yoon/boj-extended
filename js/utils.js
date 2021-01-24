const Utils = {
  requestAjax: function (url, callback) {
    const httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      console.error('Can not create XMLHTTP instance.');
      return false;
    }
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        try {
          callback(JSON.parse(httpRequest.responseText), null);
        } catch (err) {
          console.error(err.message + ' in ' + httpRequest.responseText);
          callback(null, err.message);
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
};

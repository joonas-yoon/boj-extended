(function () {
  Utils.loadCSS('css/theme-dark.css');

  setTimeout(() => {
    if (window.addEventListener) {
      window.addEventListener('load', pageLoaded);
    } else {
      window.attachEvent('onload', pageLoaded);
    }
  }, 10);

  function pageLoaded() {
    /* eslint-disable no-undef */
    const loc = window.location;

    if (loc.pathname.startsWith('/user/')) {
      extendUserPage();
    } else if (loc.pathname.startsWith('/status')) {
      extendStatusPage();
    }
  }
})();
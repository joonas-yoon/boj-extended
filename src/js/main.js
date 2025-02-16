/* eslint no-undef: "off" */
(function extend() {
  if (chrome.runtime.lastError) {
    console.warn(chrome.runtime.lastError.message);
    setTimeout(extend, 1000);
    return;
  }

  const url = window.location.pathname;

  if (url.startsWith('/user/')) {
    extendUserPage();
  } else if (url.startsWith('/status')) {
    extendStatusPage();
  } else if (url.startsWith('/rejudge/')) {
    extendRejudgePage();
  } else if (url.startsWith('/group/list')) {
    extendGroupListPage();
  } else if (url.startsWith('/board/')) {
    extendBoardPage();
  } else if (url.startsWith('/search')) {
    extendSearchPage();
  } else if (url.startsWith('/vs/')) {
    extendVs();
  } else if (url.startsWith('/submit/')) {
    extendTest();
  } else if (isSettingPage(url)) {
    extendSettingPage();
  }

  extendGlobal();

  function isSettingPage(path) {
    return (
      path.startsWith('/my/files') ||
      path.startsWith('/modify') ||
      path.startsWith('/password/change') ||
      path.startsWith('/setting/') ||
      path.startsWith('/support')
    );
  }
})();

/* eslint no-undef: "off" */
(function extend() {
  if (chrome.runtime.lastError) {
    console.warn(chrome.runtime.lastError.message);
    setTimeout(extend, 1000);
    return;
  }

  const loc = window.location;

  if (loc.pathname.startsWith('/user/')) {
    extendUserPage();
  } else if (loc.pathname.startsWith('/status')) {
    extendStatusPage();
  } else if (loc.pathname.startsWith('/rejudge/')) {
    extendRejudgePage();
  } else if (loc.pathname.startsWith('/group/list')) {
    extendGroupListPage();
  } else if (loc.pathname.startsWith('/group/member/')) {
    extendGroupMemberPage();
  } else if (loc.pathname.startsWith('/board/')) {
    extendBoardPage();
  } else if (loc.pathname.startsWith('/vs/')) {
    extendVs();
  } else if (loc.pathname.startsWith('/search')) {
    extendSearchPage();
  } else if (isSettingPage(loc.pathname)) {
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

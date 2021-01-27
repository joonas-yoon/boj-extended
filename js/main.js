(function extend() {
  /* eslint-disable no-undef */
  const loc = window.location;

  if (loc.pathname.startsWith('/user/')) {
    extendUserPage();
  } else if (loc.pathname.startsWith('/status')) {
    extendStatusPage();
  } else if (loc.pathname.startsWith('/group/member/')) {
    extendGroupMemberPage();
  } else if (isSettingPage(loc.pathname)) {
    extendSettingPage();
  }

  extendTheme();
  extendWide();

  function isSettingPage(path) {
    return path.startsWith('/my/files')
      || path.startsWith('/modify')
      || path.startsWith('/password/change')
      || path.startsWith('/setting/')
      || path.startsWith('/support');
  }
})();
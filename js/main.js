(function extend() {
  /* eslint-disable no-undef */
  const loc = window.location;

  if (loc.pathname.startsWith('/user/')) {
    extendUserPage();
  } else if (loc.pathname.startsWith('/status')) {
    extendStatusPage();
  } else if (loc.pathname.startsWith('/group/member/')) {
    extendGroupMemberPage();
  }

  extendTheme();
  extendWide();
})();
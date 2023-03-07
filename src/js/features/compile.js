(function extendCompile() {
  const url = window.location.pathname;

  if (!url.startsWith('/submit/')) {
    return;
  }

  console.log('Ready to compile');
})();

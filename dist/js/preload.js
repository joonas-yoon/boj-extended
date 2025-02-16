// preload theme from localStorage
(() => {
  const html = document.documentElement;
  let theme = localStorage.getItem(Constants.CONFIG_THEME);
  if (!theme) theme = localStorage.getItem(Config.getKey('theme')); // v1.7.8 compatibility
  html.setAttribute('theme', theme || 'light');
})();

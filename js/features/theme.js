(function extendThemePre() {
  window.addEventListener('DOMContentLoaded', () => {
    Config.load(Constants.CONFIG_THEME, (theme) => {
      applyTheme(null, theme);
    });
  });
})();

function extendTheme() {
  const container = Utils.createElement('li', { class: 'theme-selector' });
  const dropdown = Utils.createElement('div', { class: 'theme-dropdown' });
  const ul = Utils.createElement('ul', { class: 'theme-ul' });
  const themeList = Object.keys(Constants.THEMES) || [];

  // initialize button
  const themeButton = document.createElement('a');
  themeButton.innerHTML = '';
  for (let i = 1; i <= 3; ++i) {
    themeButton.innerHTML += `<div class="loading-bar bar-${i}"></div>`;
  }
  themeButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    showDropdown(!isShowDropdown());
  });

  // intialize theme dropdown
  for (const theme of themeList) {
    const li = Utils.createElement('li', {
      class: 'theme-li',
    });
    li.innerText = Constants.THEMES[theme];
    li.addEventListener('click', (evt) => {
      evt.preventDefault();
      applyTheme(themeButton, theme);
      saveTheme(theme);
    });
    ul.appendChild(li);
  }

  // release dropdown
  document.addEventListener('click', (evt) => {
    if (!evt.target.closest(`.${container.className}`)) {
      showDropdown(false);
    }
  });

  // add element to DOM
  dropdown.appendChild(ul);
  container.appendChild(themeButton);
  container.appendChild(dropdown);
  addElementToBar(container);

  // after page loaded
  Config.load(Constants.CONFIG_THEME, (storedTheme) => {
    applyTheme(themeButton, storedTheme);
  });

  const dAttrKey = 'data-dropdown';
  function isShowDropdown() {
    return dropdown.hasAttribute(dAttrKey);
  }

  function showDropdown(visible) {
    if (visible) {
      dropdown.setAttribute(dAttrKey, true);
    } else {
      dropdown.removeAttribute(dAttrKey);
    }
  }
}

function applyTheme(button, theme) {
  console.log('apply theme (requested):', theme);

  // detect dark mode by user preference
  // FIXME: flickering when page loaded
  if (hasNoPreferedTheme(theme)) {
    theme = getThemeBySystem();
    detectDarkmode();
  }

  console.log('apply theme (detected):', theme);

  setTimeout(() => {
    if (button) {
      button.innerText = Constants.THEMES[theme];
    }
  }, 100);
  document.body.parentNode.setAttribute('theme', theme);

  function hasNoPreferedTheme(theme) {
    return theme == null || theme == 'auto';
  }

  function detectDarkmode() {
    const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');
    saveTheme(getThemeBySystem(systemMedia));
    systemMedia.addEventListener('change', setThemeBySystem);
  }

  function getThemeBySystem(systemMedia) {
    systemMedia =
      systemMedia || window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = !!systemMedia.matches;
    return isDarkMode ? 'dark' : 'light';
  }
}

function saveTheme(theme, callback) {
  const defaultCallback = () => {};
  Config.save(Constants.CONFIG_THEME, theme, callback || defaultCallback);
}

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
  for (const theme of themeList) {
    const li = Utils.createElement('li', {
      class: 'theme-li',
    });
    li.innerText = Constants.THEMES[theme];
    li.addEventListener('click', (evt) => {
      evt.preventDefault();
      saveTheme(theme);
    });
    ul.appendChild(li);
  }
  const themeButton = document.createElement('a');
  themeButton.innerHTML = '';
  for (let i = 1; i <= 3; ++i) {
    themeButton.innerHTML += `<div class="loading-bar bar-${i}"></div>`;
  }
  themeButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    showDropdown(!isShowDropdown());
  });

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
  Config.load(Constants.CONFIG_THEME, selectTheme);

  function saveTheme(theme) {
    Config.save(Constants.CONFIG_THEME, theme, selectTheme);
  }

  function selectTheme(theme) {
    applyTheme(themeButton, theme);
  }

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
  setTimeout(() => {
    if (button) {
      button.innerText = Constants.THEMES[theme];
    }
  }, 100);
  // detect dark mode by user preference
  // FIXME: flickering when page loaded
  // if (theme == 'auto') {
  //   theme = getThemeBySystem();
  //   detectDarkmode();
  // }
  document.body.parentNode.setAttribute('theme', theme);
}

function detectDarkmode() {
  const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');
  setThemeBySystem(systemMedia);
  // add event listener
  systemMedia.addEventListener('change', setThemeBySystem);
}

function getThemeBySystem(systemMedia) {
  systemMedia =
    systemMedia || window.matchMedia('(prefers-color-scheme: dark)');
  const isDarkMode = !!systemMedia.matches;
  return isDarkMode ? 'dark' : 'light';
}

function setThemeBySystem(systemMedia) {
  const theme = getThemeBySystem(systemMedia);
  // NOTE: this do not save to config
  applyTheme(null, theme);
  // for caching
  localStorage.setItem('systemTheme', theme);
}

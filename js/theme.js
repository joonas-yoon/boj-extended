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
      onSelectTheme(theme);
    });
    ul.appendChild(li);
  }
  const btn = document.createElement('a');
  btn.innerText = '테마 불러오는 중...';
  btn.addEventListener('click', (evt) => {
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
  container.appendChild(btn);
  container.appendChild(dropdown);
  addElementToBar(container);

  // after page loaded
  Config.load(Constants.CONFIG_THEME, (appliedTheme) => {
    applyTheme(btn, appliedTheme);
  });

  function onSelectTheme(theme) {
    Config.save(Constants.CONFIG_THEME, theme, (appliedTheme) => {
      applyTheme(btn, appliedTheme);
    });
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
  document.body.parentNode.setAttribute('theme', theme);
  if (button) {
    button.innerText = Constants.THEMES[theme];
  }
}

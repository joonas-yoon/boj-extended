(function extendThemePre() {
  Config.load('theme', (theme) => {
    applyTheme(null, theme);
  });
})();

function extendTheme() {
  // add html element
  const bar = document.querySelector('ul.loginbar');
  const divider = document.createElement('li');
  divider.setAttribute('class', 'topbar-devider');
  bar.appendChild(divider);
  const li = document.createElement('li');
  const btn = document.createElement('a');
  btn.innerText = '테마 불러오는 중...';
  btn.style.cursor = 'pointer';
  li.appendChild(btn);
  bar.appendChild(li);
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const theme = document.body.getAttribute('theme');
    const newTheme = theme == 'dark' ? 'light' : 'dark';
    applyTheme(btn, newTheme);
    Config.save('theme', newTheme);
  });

  // after page loaded
  Config.load('theme', (theme) => {
    applyTheme(btn, theme);
  });
}

function applyTheme(button, theme) {
  document.body.setAttribute('theme', theme);
  if (button) {
    if (theme == 'dark') {
      button.innerText = '밝은 테마';
    } else {
      button.innerText = '어두운 테마';
    }
  }
}

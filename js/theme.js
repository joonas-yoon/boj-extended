(function extendThemePre() {
  window.addEventListener('DOMContentLoaded', () => {
    Config.load('theme', (theme) => {
      applyTheme(null, theme);
    });
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
    const theme = document.body.parentNode.getAttribute('theme');
    const newTheme = theme == 'dark' ? 'light' : 'dark';
    Config.save('theme', newTheme, (result) => {
      applyTheme(btn, result);
    });
  });

  // after page loaded
  Config.load('theme', (result) => {
    applyTheme(btn, result);
  });
}

function applyTheme(button, theme) {
  document.body.parentNode.setAttribute('theme', theme);
  if (button) {
    button.innerText = theme == 'dark' ? '밝은 테마' : '어두운 테마';
  }
}

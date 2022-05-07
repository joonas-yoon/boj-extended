(function extendThemePre() {
  window.addEventListener('DOMContentLoaded', () => {
    Config.load('theme', (theme) => {
      applyTheme(null, theme);
    });
  });
})();

function extendTheme() {
  const li = document.createElement('li');
  const btn = document.createElement('a');
  btn.innerText = '테마 불러오는 중...';
  li.appendChild(btn);
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const theme = document.body.parentNode.getAttribute('theme');
    const newTheme = theme == 'dark' ? 'light' : 'dark';
    Config.save('theme', newTheme, (result) => {
      applyTheme(btn, result);
    });
  });
  addElementToBar(li);

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

function extendWide() {
  const li = document.createElement('li');
  const btn = document.createElement('a');
  btn.innerText = '화면 크기';
  li.appendChild(btn);
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const wide = btn.getAttribute('wide') == 'true';
    Config.save('wide', !wide, (result) => {
      applyWide(btn, result);
    });
  });
  addElementToBar(li);

  // after page loaded
  Config.load('wide', (wide) => {
    applyWide(btn, wide);
  });
}

// TODO: /search 페이지에서는 안됨 (구조가 다름)
function applyWide(btn, wide) {
  const container = document.getElementsByClassName('content')[0];
  if (wide) {
    container.classList.remove('container');
    container.classList.add('container-fluid');
  } else {
    container.classList.remove('container-fluid');
    container.classList.add('container');
  }
  if (btn) {
    btn.setAttribute('wide', !!wide);
    btn.innerText = wide ? '기본 크기' : '넓은 크기';
  }
}

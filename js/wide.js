function extendWide() {
  // add html element
  const bar = document.querySelector('ul.loginbar');
  const divider = document.createElement('li');
  divider.setAttribute('class', 'topbar-devider');
  bar.appendChild(divider);
  const li = document.createElement('li');
  const btn = document.createElement('a');
  btn.innerText = '화면 크기';
  btn.style.cursor = 'pointer';
  li.appendChild(btn);
  bar.appendChild(li);
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const wide = btn.getAttribute('wide') == 'true';
    Config.save('wide', !wide, (result) => {
      applyWide(btn, result);
    });
  });

  // after page loaded
  Config.load('wide', (wide) => {
    applyWide(btn, wide);
  });
}

function applyWide(btn, wide) {
  const container = document.getElementsByClassName('content')[0];
  if (wide) {
    container.classList.remove('container');
    container.classList.add('container-fluid');
    container.style.padding = '40px 3em';
  } else {
    container.classList.remove('container-fluid');
    container.classList.add('container');
    container.style.padding = '40px 0';
  }
  if (btn) {
    btn.setAttribute('wide', !!wide);
    btn.innerText = wide ? '기본 크기' : '넓은 크기';
  }
}

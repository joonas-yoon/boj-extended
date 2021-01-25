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
    Config.load('wide', (wide) => {
      Config.save('wide', !wide, apply);
    });
  });

  // after page loaded
  Config.load('wide', apply);

  function apply(toWide) {
    const container = document.querySelector('.content');
    if (toWide) {
      container.classList.remove('container');
      container.classList.add('container-fluid');
      container.style.padding = '40px 3em';
      btn.innerText = '기본 보기';
    } else {
      container.classList.remove('container-fluid');
      container.classList.add('container');
      container.style.padding = '40px 0';
      btn.innerText = '넓게 보기';
    }
  }
}

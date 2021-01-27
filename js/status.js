function extendStatusPage() {
  Utils.loadCSS('css/status.css');
  Utils.loadScript('js/status-rte.js');

  // pre-update to rows
  const titles = document.querySelectorAll('a[href].problem_title');
  titles.forEach((e) => {
    if (e.getAttribute('data-original-id') == undefined) {
      e.setAttribute('data-original-id', e.innerText);
    }
  });

  // width to fit-content
  document
    .getElementById('status-table')
    .querySelectorAll('th')
    .forEach((e, i) => {
      if (i < 4) {
        e.style.width = 'auto';
      }
    });

  // highlight my result
  const username = document.querySelector('a.username');
  if (username) {
    document
      .getElementById('status-table')
      .querySelectorAll('a[href]')
      .forEach((e) => {
        if (
          e.getAttribute('href').startsWith('/user/') &&
          username.innerText == e.innerText
        ) {
          e.parentNode.parentNode.setAttribute('class', 'result-mine');
        }
      });
  }

  function display(showPid) {
    titles.forEach((e) => {
      if (showPid) {
        e.innerText = e.getAttribute('data-original-id');
      } else {
        const text = e.getAttribute('data-original-title');
        e.innerText = text.length > 20 ? text.substr(0, 17) + '…' : text;
      }
    });
  }

  // load and apply to display pid/pname
  Config.load('show-status-pid', (showPid) => {
    const form = document.querySelector('form[action="/status"]');
    const radio1 = createRadioElement(
      '문제 번호',
      (evt) => {
        Config.save('show-status-pid', true, display);
      },
      !!showPid
    );
    const radio2 = createRadioElement(
      '문제 제목',
      (evt) => {
        Config.save('show-status-pid', false, display);
      },
      !showPid
    );
    form.insertBefore(radio2, form.firstChild);
    form.insertBefore(radio1, form.firstChild);
    setTimeout(() => display(!!showPid), 10);
  });

  function createRadioElement(labelText, changeEvent, checked) {
    const randID = Math.random().toString(36).substr(2);
    const div = document.createElement('div');
    div.setAttribute('class', 'form-check form-check-inline');
    div.style.display = 'inline';
    div.style.marginRight = '1em';

    const input = document.createElement('input');
    input.setAttribute('class', 'form-check-input');
    input.setAttribute('type', 'radio');
    input.setAttribute('id', randID);
    input.setAttribute('name', 'radio-extended');
    input.addEventListener('change', changeEvent);
    input.checked = !!checked;

    const label = document.createElement('label');
    label.setAttribute('class', 'form-check-label');
    label.setAttribute('for', randID);
    label.style.marginLeft = '5px';
    label.innerText = labelText;

    div.appendChild(input);
    div.appendChild(label);
    return div;
  }
}

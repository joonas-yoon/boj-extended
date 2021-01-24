function extendUserPage() {
  Utils.loadCSS('css/style.css');

  const pnames = PROVISIONED_DB['problems'];
  const panels = document.querySelectorAll('.panel-body');
  panels.forEach((panel) => {
    const div = document.createElement('div');
    const labels = panel.querySelectorAll('a[href]');
    labels.forEach((e, i) => {
      const pid = e.innerText;
      const pname = pnames[pid] || '*New Problem';
      const newA = e.cloneNode();
      newA.innerHTML =
        '<span class="pid">' +
        pid +
        '</span> <span class="pname">' +
        pname +
        '</span>';
      div.appendChild(newA);
      if (i + 1 == labels.length) {
        setTimeout(() => {
          panel.innerHTML = '';
          panel.appendChild(div);
        }, 1000);
      }
    });
  });

  function display(containers, key, visible) {
    containers.forEach((panel) => {
      if (visible) {
        panel.setAttribute(key, true);
      } else {
        panel.removeAttribute(key);
      }
    });
  }

  const checkboxes = document.createElement('div');
  const checkbox1 = document.createElement('input');
  checkbox1.setAttribute('type', 'checkbox');
  checkbox1.setAttribute('id', 'show-pid');
  checkbox1.addEventListener('change', (evt) => {
    Config.save('show-pid', evt.target.checked);
    display(panels, 'show-id', evt.target.checked);
  });
  const checkbox2 = document.createElement('input');
  checkbox2.setAttribute('type', 'checkbox');
  checkbox1.setAttribute('id', 'show-pname');
  checkbox2.addEventListener('change', (evt) => {
    Config.save('show-pname', evt.target.checked);
    display(panels, 'show-name', evt.target.checked);
  });

  const label1 = document.createElement('label');
  label1.setAttribute('for', 'show-pid');
  label1.innerText = '문제 번호';
  const label2 = document.createElement('label');
  label2.setAttribute('for', 'show-pname');
  label2.innerText = '문제 제목';

  checkboxes.setAttribute('class', 'problem-toggles');
  checkboxes.appendChild(checkbox1);
  checkboxes.appendChild(label1);
  checkboxes.appendChild(checkbox2);
  checkboxes.appendChild(label2);

  const wrapper = document.querySelector('.col-md-9');
  wrapper.insertBefore(checkboxes, wrapper.firstChild);

  // sync with configs
  Config.load('show-pid', (checked) => {
    checked = checked === null ? true : checked;
    checkbox1.checked = checked;
    display(panels, 'show-id', checked);
  });
  Config.load('show-pname', (checked) => {
    checkbox2.checked = checked;
    display(panels, 'show-name', checked);
  });
}

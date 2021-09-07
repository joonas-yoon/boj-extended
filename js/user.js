function extendUserPage() {
  Utils.loadCSS('css/user.css');

  function display(containers, key, visible) {
    containers.forEach((panel) => {
      if (visible) {
        panel.setAttribute(key, true);
      } else {
        panel.removeAttribute(key);
      }
    });
  }

  function getCurrentUsername() {
    const { pathname } = window.location;
    return pathname.replace('/user/', '') || '';
  }

  const panels = document.querySelectorAll('.panel-body');

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
  // add checkboxes whether problem's id or name
  wrapper.insertBefore(checkboxes, wrapper.firstChild);
  // add vs form
  wrapper.insertBefore(
    createVsForm(getCurrentUsername(), getMyUsername()), // eslint-disable-line no-undef
    checkboxes
  );

  Config.getProblems((problems) => {
    panels.forEach((panelOrigin) => {
      const div = document.createElement('div');
      const labels = panelOrigin.querySelectorAll('a[href]');
      const panelResult = document.createElement('div');
      labels.forEach((e, i) => {
        const pid = e.innerText;
        const pname = problems[pid] || '*New Problem';
        const newA = e.cloneNode();
        newA.innerHTML =
          '<span class="pid">' +
          pid +
          '</span> <span class="pname">' +
          pname +
          '</span>';
        div.appendChild(newA);
        // split by group
        const isLastItem = i + 1 === labels.length;
        const countPerGroup = 100;
        if (i == countPerGroup || isLastItem) {
          const gid = isLastItem ? (i < countPerGroup ? 0 : 1) : 0;
          div.setAttribute('class', 'pgroup pg-' + gid);
          panelResult.appendChild(div.cloneNode(true));
          div.innerHTML = '';
          // end of items
          if (isLastItem) {
            setTimeout(() => {
              panelOrigin.innerHTML = panelResult.innerHTML;
            }, 10);

            // has more items
            if (i >= countPerGroup) {
              // add button to display all
              const panelFooter = document.createElement('div');
              panelFooter.setAttribute('class', 'panel-footer');
              const showButton = document.createElement('a');
              showButton.setAttribute('class', 'btn-display-all');
              showButton.innerText = '모두 보기';
              showButton.addEventListener('click', (evt) => {
                evt.preventDefault();
                panelOrigin.querySelectorAll('.pgroup').forEach((e) => {
                  e.style.display = 'inline';
                });
                evt.target.remove();
              });
              panelFooter.appendChild(showButton);
              panelOrigin.parentElement.appendChild(panelFooter);
            }
          }
        }
      });
    });

    // sync with configs
    Config.load('show-pid', (checked) => {
      checked = checked === null || checked === undefined ? true : checked;
      checkbox1.checked = checked;
      display(panels, 'show-id', checked);
    });
    Config.load('show-pname', (checked) => {
      checkbox2.checked = checked;
      display(panels, 'show-name', checked);
    });
  });
}

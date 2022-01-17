function extendProblemPage() {
  const menu = document.getElementsByClassName('problem-menu')[0];
  if (!menu) return;
  const pid = parseInt(
    menu
      .querySelector('a[href^="/problem"]')
      .getAttribute('href')
      .replace('/problem/', '')
  );

  const storageTimerList = 'problem-timers';

  const container = document
    .getElementsByClassName('content')[0]
    .getElementsByClassName('row')[0];
  const progress = progressTimer(); // eslint-disable-line no-undef
  container.insertBefore(progress.element(), container.firstChild);

  const dropdown = createTimerDropdown();
  menu.appendChild(dropdown);

  // the number of questions
  const searchMenu = document.querySelector(
    'ul.problem-menu li a[href^="/board/search/"]'
  );
  if (searchMenu) {
    Utils.requestAjax(
      'https://www.acmicpc.net/board/search/all/problem/' + pid,
      (response) => {
        const doc = new DOMParser().parseFromString(response, 'text/html');
        const pages = doc.querySelectorAll('ul.pagination li').length - 2;
        const rows = doc.querySelectorAll(
          '.table > tbody > tr:not(.success)'
        ).length;
        let estimates = rows;
        if (pages > 1) {
          estimates = (pages - 1) * rows + '+';
        }
        searchMenu.innerText += ' (' + estimates + ')';
      }
    );
  }

  function stopTimer() {
    // TODO: 옵션에서 메시지 설정
    window.alert('종료되었습니다.');
    // TODO: 기록 남기기
    progress.stop();
    // progress.hide();
  }

  function createTimerDropdown() {
    const li = Utils.createElement('li', {
      id: 'problem-timer',
      class: 'dropdown',
    });

    const a = Utils.createElement('a', {
      class: 'dropdown-toggle',
      style: 'cursor: pointer',
    });
    a.innerHTML = '타이머<b class="caret"></b>';
    a.addEventListener('click', (evt) => {
      li.classList.toggle('open');
    });
    li.appendChild(a);

    const form = Utils.createElement('form', { class: 'dropdown-menu' });
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const button = evt.target.getElementsByClassName('btn')[0];
      // can be started
      if (button.classList.contains('btn-primary')) {
        const inputs = evt.target.elements;
        const h = parseInt(inputs.h.value) || 0;
        const m = parseInt(inputs.m.value) || 0;
        const s = parseInt(inputs.s.value) || 0;
        const t = h * 3600 + m * 60 + s;
        if (t < 60) {
          window.alert('최소 1분 이상을 설정해주세요.');
        } else {
          // timer start
          button.innerText = '종료';
          button.classList.remove('btn-primary');
          button.classList.add('btn-danger');
          // save in storage
          const startTime = new Date().getTime();
          const endTime = startTime + t * 1000;
          Config.load(storageTimerList, (list) => {
            list = list || {};
            list[pid] = { startTime: startTime, endTime: endTime };
            Config.save(storageTimerList, list, (result) => {
              progress.show();
              progress.start(startTime, endTime);
              console.log('list updated', result);
            });
          });
        }
      } else {
        // timer stop
        button.innerText = '시작';
        button.classList.add('btn-primary');
        button.classList.remove('btn-danger');
        // sync setting
        Config.load(storageTimerList, (list) => {
          if (!list) return;
          delete list[pid];
          Config.save(storageTimerList, list, (result) => {
            progress.hide();
            progress.stop();
          });
        });
      }
      return false;
    });
    form.innerHTML =
      '<div style="margin-top: 5px;"><label style="width: 30%;">시간</label><label style="width: 33%;">분</label><label style="width: 33%;">초</label></div>';
    li.appendChild(form);

    const seperator = Utils.createElement('span', { class: 'timer-seperator' });
    seperator.innerText = ':';

    const inputH = Utils.createElement('input', {
      type: 'number',
      class: 'timer-number',
      value: '0',
      name: 'h',
    });
    form.appendChild(inputH);

    const inputM = inputH.cloneNode(true);
    inputM.setAttribute('name', 'm');
    form.appendChild(seperator.cloneNode(true));
    form.appendChild(inputM);

    const inputS = inputH.cloneNode(true);
    inputS.setAttribute('name', 's');
    form.appendChild(seperator.cloneNode(true));
    form.appendChild(inputS);

    inputH.addEventListener('change', (evt) => {
      if (evt.target.value < 0) {
        evt.target.value = 0;
        inputM.value = 0;
        inputS.value = 0;
      }
    });
    inputM.addEventListener('change', (evt) => {
      if (evt.target.value < 0) {
        if (inputH.value > 0) {
          inputH.value = parseInt(inputH.value) - 1;
          evt.target.value = 59;
        } else {
          evt.target.value = 0;
        }
        inputS.value = 0;
      } else if (evt.target.value >= 60) {
        inputH.value = parseInt(inputH.value) + 1;
        evt.target.value = 0;
      }
    });
    inputS.addEventListener('change', (evt) => {
      if (evt.target.value < 0) {
        if (inputM.value > 0) {
          inputM.value = parseInt(inputM.value) - 1;
          evt.target.value = 59;
        } else if (inputH.value > 0) {
          inputH.value = parseInt(inputH.value) - 1;
          inputM.value = 59;
          evt.target.value = 59;
        } else {
          evt.target.value = 0;
        }
      } else if (evt.target.value >= 60) {
        inputM.value = parseInt(inputM.value) + 1;
        if (inputM.value >= 60) {
          inputM.value = 0;
          inputH.value = parseInt(inputH.value) + 1;
        }
        evt.target.value = 0;
      }
    });

    const divider = Utils.createElement('li', { class: 'divider' });
    form.appendChild(divider);

    const button = document.createElement('button');
    Config.load(storageTimerList, (list) => {
      console.log(list);
      const info = list ? list[pid] : undefined;
      if (info) {
        button.setAttribute('class', 'btn btn-danger btn-block');
        button.innerText = '종료';
        progress.show();
        progress.start(info['startTime'], info['endTime'], stopTimer);
      } else {
        button.setAttribute('class', 'btn btn-primary btn-block');
        button.innerText = '시작';
        progress.hide();
        progress.stop();
      }
    });
    form.appendChild(button);

    return li;
  }
}

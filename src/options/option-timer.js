(async function () {
  Array.from(document.getElementsByClassName('btn-close-window')).forEach(
    (e) => {
      e.addEventListener('click', (evt) => {
        evt.preventDefault();
        window.close('', '_parent', '');
      });
    }
  );

  const container = document.getElementById('problem-timer-list');

  const PROBLEM_DB = await chrome.storage.local.get(Constants.BG_DB_PROBLEMS);
  const getProblemName = (pid) => {
    try {
      const dbJson = JSON.parse(PROBLEM_DB[Constants.BG_DB_PROBLEMS]);
      return dbJson['problems'][pid]['title'];
    } catch (error) {
      console.error(error);
      return '<문제 제목을 불러오는 데 실패했습니다>';
    }
  };

  // Timers
  Config.load('problem-timers', (list) => {
    const pids = Object.keys(list || {});
    if (pids.length) {
      for (let i = 0; i < pids.length; ++i) {
        const pid = pids[i];
        const timeInfo = list[pid];
        const pname = getProblemName(pid);
        container.appendChild(createTimerElement(pid, pname, timeInfo));
      }
    } else {
      // empty
      const p = document.createElement('p');
      p.innerText = '표시할 항목이 없습니다.';
      container.appendChild(p);
    }
  });

  function createTimerElement(pid, pname, timeInfo) {
    const div = document.createElement('div');
    const label = document.createElement('label');
    const a = Utils.createElement('a', {
      href: `https://www.acmicpc.net/problem/${pid}`,
    });
    a.innerText = `${pid}번 ${pname}`;
    label.appendChild(a);
    div.appendChild(label);

    const progress = progressTimer();
    div.appendChild(progress.element());

    progress.start(timeInfo['startTime'], timeInfo['endTime'], () => {
      console.log('finished!!');
    });

    return div;
  }
})();

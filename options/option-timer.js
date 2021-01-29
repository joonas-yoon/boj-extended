(function () {
  Array.from(document.getElementsByClassName('btn-close-window')).forEach(
    (e) => {
      e.addEventListener('click', (evt) => {
        evt.preventDefault();
        window.close('', '_parent', '');
      });
    }
  );

  const container = document.getElementById('problem-timer-list');

  // Timers
  Config.load('problem-timers', (list) => {
    let pids = Object.keys(list || {});
    for (let i = 0; i < pids.length; ++i) {
      let pid = pids[i];
      let timeInfo = list[pid];
      let pname = PROVISIONED_DB['problems'][pid];
      container.appendChild(createTimerElement(pid, pname, timeInfo));
    }
  });

  function createTimerElement(pid, pname, timeInfo) {
    const div = document.createElement('div');
    const label = document.createElement('label');
    label.innerHTML =
      '<a href="https://www.acmicpc.net/problem/' +
      pid +
      '">' +
      pid +
      '번 ' +
      pname +
      '</a>';
    div.appendChild(label);

    const progress = progressTimer();
    div.appendChild(progress.element());

    progress.start(timeInfo['startTime'], timeInfo['endTime'], () => {
      console.log('finished!!');
    });

    return div;
  }
})();

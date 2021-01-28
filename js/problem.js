function extendProblemPage() {
  const menu = document.getElementsByClassName('problem-menu')[0];
  if (!menu) return;
  const pid = parseInt(menu.querySelector('a[href^="/problem"]').getAttribute('href').replace('/problem/',''));
  console.log(pid);

  const container = document.getElementsByClassName('content')[0].getElementsByClassName('row')[0];
  const progressWrapper = document.createElement('div');
  progressWrapper.setAttribute('class', 'progress');
  progressWrapper.style.display = 'none';
  const bar = document.createElement('div');
  bar.setAttribute('class', 'progress-bar');
  bar.style.width = '100%';
  bar.innerText = 'Loading...';
  progressWrapper.appendChild(bar);
  container.insertBefore(progressWrapper, container.firstChild);

  const dropdown = createTimerDropdown((t) => {
    if (t < 60) {
      window.alert('최소 1분 이상을 설정해주세요.');
      return;
    }
    progressWrapper.style.display = 'block';
    const startTime = new Date().getTime();
    const endTime = startTime + t * 1000; // (ms)
    updateProgress(startTime, endTime, () => {
      // TODO: 옵션에서 메시지 설정
      window.alert('종료되었습니다.');
      // TODO: 기록 남기기
    });
  });
  menu.appendChild(dropdown);

  function updateProgress(startTime, endTime, finish) {
    const curTime = endTime - new Date().getTime() + 1;
    const percentage = 100 * curTime / (endTime - startTime);
    let bg = '';
    if (percentage <= 50) {
      bg = 'background-color:#ffc107;';
    } else if (percentage <= 10) {
      bg = 'background-color:#dc3545;';
    } else if (percentage < 0) {
      percentage = 0;
    }
    bar.setAttribute('style', 'float:right; transition-duration: .2s; width:' + percentage + '%;' + bg);
    bar.innerText = timeHumanize(curTime) + ' 남음';
    if (curTime > 0) {
      window.requestAnimationFrame(updateProgress.bind(null, startTime, endTime, finish));
    } else {
      finish();
    }
  }

  function timeHumanize(ms) {
    let txt = '';
    ms = parseInt(ms / 1000); // ms -> sec
    if (ms % 60 > 0) txt = (ms % 60) + '초 ' + txt;
    ms = parseInt(ms / 60); // sec -> min
    if (ms % 60 > 0) txt = (ms % 60) + '분 ' + txt;
    ms = parseInt(ms / 60); // min -> hour
    if (ms % 24 > 0) txt = (ms % 24) + '시간 ' + txt;
    ms = parseInt(ms / 24); // hour -> day
    if (ms > 0) txt = ms + '일 '; // n일부터는 시간 생략
    return txt ? txt : '1초 미만';
  }

  function createTimerDropdown(callback) {
    const li = document.createElement('li');
    li.setAttribute('id', 'problem-timer');
    li.setAttribute('class', 'dropdown');

    const a = document.createElement('a');
    a.setAttribute('class', 'dropdown-toggle');
    a.innerHTML = '타이머<b class="caret"></b>';
    a.style.cursor = 'pointer';
    a.addEventListener('click', (evt) => {
      li.classList.toggle('open');
    });
    li.appendChild(a);

    const form = document.createElement('form');
    form.setAttribute('class', 'dropdown-menu');
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const h = parseInt(evt.target.elements.h.value) || 0;
      const m = parseInt(evt.target.elements.m.value) || 0;
      const s = parseInt(evt.target.elements.s.value) || 0;
      const t = h * 3600 + m * 60 + s;
      callback(t);
      return false;
    });
    form.innerHTML = '<div style="margin-top: 5px;"><label style="width: 30%;">시간</label><label style="width: 33%;">분</label><label style="width: 33%;">초</label></div>';
    li.appendChild(form);

    const seperator = document.createElement('span');
    seperator.setAttribute('class', 'timer-seperator');
    seperator.innerText = ':';

    const inputH = document.createElement('input');
    inputH.setAttribute('type', 'number');
    inputH.setAttribute('class', 'timer-number');
    inputH.setAttribute('value', '0');
    inputH.setAttribute('name', 'h');
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
      }
      else if (evt.target.value >= 60) {
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
      }
      else if (evt.target.value >= 60) {
        inputM.value = parseInt(inputM.value) + 1;
        if (inputM.value >= 60) {
          inputM.value = 0;
          inputH.value = parseInt(inputH.value) + 1;
        }
        evt.target.value = 0;
      }
    });
    
    const divider = document.createElement('li');
    divider.setAttribute('class', 'divider');
    form.appendChild(divider);

    const button = document.createElement('button');
    button.setAttribute('class', 'btn btn-primary btn-block');
    button.innerText = '시작';
    form.appendChild(button);
    return li;
  }
}

/*
<li class="dropdown">
<a class="dropdown-toggle" id="drop-timer" role="button" data-toggle="dropdown" href="#">타이머<b class="caret"></b></a>
<form class="dropdown-menu p-4" style="
    padding: 5px;
" id="drop-timer">
  
  
  
  <div style="
    margin: 5px auto;
    text-align: center;
    width: 200px;
" class=""><input type="number" class="timer-n" value="0" min="0" max="99">:<input type="number" class="timer-n" value="0" min="0" max="59">:<input type="number" class="timer-n" value="0" min="0" max="59"><input type="hidden" name="problem-timer" <="" div=""></div><li class="divider"></li>
<button type="button" class="btn btn-primary btn-block">Start</button>
</form></li>
*/
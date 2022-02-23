function extendGlobal() {
  extendTheme();
  extendWide();
  extendReformatMessage();
  extendProblemPage();
  extendQuickSearch();
  extendProblemColor();

  async function extendProblemColor() {
    const problemInfo = await fetchProblemsByUser(getMyUsername());
    if (!problemInfo) return;
    // apply colors
    document.querySelectorAll('a[href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (href == '#') return;
      const pid = getProblemID(href);
      if (pid !== null && problemInfo[pid]) {
        el.classList.add(problemInfo[pid] || '');
      }
    });
  }

  function extendReformatMessage() {
    const resultPattern = {
      'result-ac': '맞았습니다!!',
      'result-pac': '맞았습니다!!',
      'result-wa': '틀렸습니다',
      'result-ce': '컴파일 에러',
      'result-rte': '런타임 에러',
      'result-tle': '시간 초과',
      'result-mle': '메모리 초과',
      'result-ole': '출력 초과',
      'result-pe': '출력 형식이 잘못되었습니다',
      'result-wait': '기다리는 중',
      'result-compile': '채점 준비 중',
      'result-judging': '채점 중',
      'result-del': '채점 불가',
    };

    Config.load(Constants.CONFIG_SHOW_STATUS_HISTORY, (showHistory) => {
      // load history from localStorage
      showHistory = showHistory !== false; // true or null (default)
      console.log('showHistory', showHistory);
      if (showHistory) {
        window.bojextStatusHistories = JSON.parse(
          localStorage.getItem(Constants.STORAGE_STATUS_HISTORY) || '{}'
        );
      }
      console.log('load', window.bojextStatusHistories);
      Config.load(Constants.CONFIG_SHOW_FAKE_RESULT, (showFakeResult) => {
        // add fake result for each texts
        showFakeResult = showFakeResult !== false; // true or null (default)
        console.log('showFakeResult', showFakeResult);
        document.querySelectorAll('span[class^=result-]').forEach((element) => {
          if (element.getAttribute('class') === 'result-text') return;
          const fakeText = document.createElement('span');
          fakeText.setAttribute('class', 'result-fake-text');
          fakeText.appendChild(element.firstChild.cloneNode(true));
          fakeText.style.display = 'none';
          const box = element.closest('.result-text');
          if (box !== null) {
            addFakeResult(box, fakeText);
            addObserver(box, (resultText) => {
              const res = resultText.querySelector('span') || resultText;
              const id = res.closest('tr').id;
              // save current percentage
              if (res.classList.contains('result-judging')) {
                const percent = parseInt(res.innerText.match(/\d+/)) || null;
                if (showHistory && percent !== null) updateHistory(id, percent);
              } else {
                const isAccept =
                  res.classList.contains('result-ac') ||
                  res.classList.contains('result-pac');
                if (isAccept) deleteHistory(id);
              }
              if (showFakeResult) formatting(res, fakeText);
            });
          } else {
            // /source, /share
            addFakeResult(element, fakeText);
          }
          if (showFakeResult) formatting(element, fakeText);
        });
      });
    });

    function addObserver(target, callback) {
      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          callback(mutation.target);
        });
      });
      const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      };
      observer.observe(target, config);
    }

    function addFakeResult(appendTo, element) {
      appendTo.parentNode.appendChild(element);
      const latestPercentage = Utils.createElement('span', {
        class: 'result-latest',
        style: 'float: right;color: #dd4124;',
      });
      appendTo.parentNode.appendChild(latestPercentage);
    }

    function outputAsHtml(output, html) {
      if (
        Utils.isElement(output.firstChild) &&
        output.firstChild.getAttribute('href')
      ) {
        output = output.firstChild;
      }
      output.innerHTML = html;
    }

    function formatting(input, output) {
      let classes = (input.getAttribute('class') || '').split(' ');
      classes = classes.filter(
        (c) => c != 'result-text' && c.startsWith('result-')
      );
      if (classes.length < 1) return;
      const type = classes[0];
      const inputText = input.innerText;
      const td = input.closest('td');
      // replace text by user's format
      Config.load(type, (format) => {
        if (!format) {
          if (td) td.setAttribute('class', 'result');
          input.style.display = '';
          output.style.display = 'none';
        } else {
          if (td) td.setAttribute('class', 'result has-fake');
          input.style.display = 'none';
          output.style.display = '';
          const outputText1 = input.innerText.replaceAll(
            resultPattern[type],
            ''
          );
          format = format.replace(
            /<span (.+)?>(.*)<\/span>/gi,
            '<span $1>$2 ' + outputText1 + '</span>'
          );
          const outputText2 = input.innerText.replaceAll(
            resultPattern[type],
            format
          );
          outputAsHtml(output, format);
        }
      });
      // display latest percentage when it is not accept
      const id = input.closest('tr').id;
      const ptext = td.querySelector('.result-latest');
      if (
        !input.classList.contains('result-ac') &&
        window.bojextStatusHistories &&
        window.bojextStatusHistories[id] !== undefined
      ) {
        ptext.innerText = '(' + window.bojextStatusHistories[id] + '%)';
      } else {
        ptext.innerText = '';
      }
    }

    // ISSUE: synchronization not guaranteed with multiple tabs
    function updateHistory(id, percent) {
      // load history from localStorage
      const histories = JSON.parse(
        localStorage.getItem(Constants.STORAGE_STATUS_HISTORY) || '{}'
      );
      const needsUpdate = histories[id] != percent;
      histories[id] = Math.max(histories[id] || 0, percent);
      if (needsUpdate) {
        localStorage.setItem(
          Constants.STORAGE_STATUS_HISTORY,
          JSON.stringify(histories)
        );
        window.bojextStatusHistories = histories;
      }
    }
  }

  function deleteHistory(id) {
    // load history from localStorage
    const histories = JSON.parse(
      localStorage.getItem(Constants.STORAGE_STATUS_HISTORY) || '{}'
    );
    delete histories[id];
    localStorage.setItem(
      Constants.STORAGE_STATUS_HISTORY,
      JSON.stringify(histories)
    );
    window.bojextStatusHistories = histories;
  }
}

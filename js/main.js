(function extend() {
  if (chrome.runtime.lastError) {
    console.warn(chrome.runtime.lastError.message);
    setTimeout(extend, 1000);
    return;
  }

  /* eslint-disable no-undef */
  const loc = window.location;

  if (loc.pathname.startsWith('/user/')) {
    extendUserPage();
  } else if (loc.pathname.startsWith('/status')) {
    extendStatusPage();
  } else if (loc.pathname.startsWith('/group/list')) {
    extendGroupListPage();
  } else if (loc.pathname.startsWith('/group/member/')) {
    extendGroupMemberPage();
  } else if (loc.pathname.startsWith('/board/')) {
    extendBoardPage();
  } else if (loc.pathname.startsWith('/vs/')) {
    extendVs();
  } else if (isSettingPage(loc.pathname)) {
    extendSettingPage();
  }

  extendTheme();
  extendWide();
  extendReformatMessage();
  extendProblemPage();

  function isSettingPage(path) {
    return (
      path.startsWith('/my/files') ||
      path.startsWith('/modify') ||
      path.startsWith('/password/change') ||
      path.startsWith('/setting/') ||
      path.startsWith('/support')
    );
  }

  function extendReformatMessage() {
    Config.load(Constants.CONFIG_SHOW_STATUS_HISTORY, (showHistory) => {
      // load history from localStorage
      showHistory = showHistory !== false; // true or null (default)
      if (showHistory) {
        window.bojextStatusHistories = JSON.parse(
          localStorage.getItem(Constants.STORAGE_STATUS_HISTORY) || '{}'
        );
      }
      console.log('load', window.bojextStatusHistories);
      // add fake result for each texts
      document.querySelectorAll('span[class^=result-]').forEach((element) => {
        if (element.classList.contains('result-text')) return;
        const fakeText = document.createElement('span');
        fakeText.setAttribute('class', 'result-fake-text');
        const box = isWillUpdate(element);
        if (box !== null) {
          addFakeResult(box, fakeText);
          addObserver(box, (resultText) => {
            const res = resultText.querySelector('span') || resultText;
            // save current percentage
            if (res.classList.contains('result-judging')) {
              const id = res.closest('tr').id;
              const percent = parseInt(res.innerText.match(/\d+/)) || null;
              if (showHistory && percent !== null) updateHistory(id, percent);
            }
            formatting(res, fakeText);
          });
        } else {
          // /source, /share
          addFakeResult(element, fakeText);
        }
        formatting(element, fakeText);
      });
    });

    function isWillUpdate(el) {
      for (let i = 0; i < 3; ++i) {
        if (el.classList.contains('result-text')) return el;
        el = el.parentNode;
      }
      return null;
    }

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

    function formatting(input, output) {
      const type = (input.getAttribute('class') || '').trim();
      if (!type.startsWith('result-')) return;
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
          const digits = (inputText.match(/[+-]?\d+(\.\d+)?/g) || [''])[0];
          const numberFormat = ':number:';
          if (format.indexOf(numberFormat) !== -1) {
            // user has number in format
            output.innerHTML = format.replaceAll(numberFormat, digits);
          } else if (digits !== '') {
            // user does not have in format, but there are digits (e.g. score)
            const prefix = (inputText.match(/점|%/) || [''])[0];
            const lastCloseIdx = format.lastIndexOf('</');
            output.innerHTML =
              format.substring(0, lastCloseIdx) +
              ' (' +
              digits +
              prefix +
              ')' +
              format.substring(lastCloseIdx, format.length);
          } else {
            // format for only text
            output.innerHTML = format;
          }
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
    async function updateHistory(id, percent) {
      // load history from localStorage
      const histories = JSON.parse(
        localStorage.getItem(Constants.STORAGE_STATUS_HISTORY) || '{}'
      );
      const needsUpdate = percent == 100 || histories[id] != percent;
      if (percent == 100) delete histories[id];
      else histories[id] = Math.max(histories[id] || 0, percent);
      if (needsUpdate) {
        localStorage.setItem(
          Constants.STORAGE_STATUS_HISTORY,
          JSON.stringify(histories)
        );
        window.bojextStatusHistories = histories;
      }
    }
  }
})();

/* eslint no-undef: "off" */
(function extend() {
  if (chrome.runtime.lastError) {
    console.warn(chrome.runtime.lastError.message);
    setTimeout(extend, 1000);
    return;
  }

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
        if (element.getAttribute('class') === 'result-text') return;
        const fakeText = document.createElement('span');
        fakeText.setAttribute('class', 'result-fake-text');
        fakeText.appendChild(element.firstChild.cloneNode(true));
        const box = element.closest('.result-text');
        if (box !== null) {
          addFakeResult(box, fakeText);
          addObserver(box, (resultText) => {
            const id = res.closest('tr').id;
            const res = resultText.querySelector('span') || resultText;
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
            formatting(res, fakeText);
          });
        } else {
          // /source, /share
          addFakeResult(element, fakeText);
        }
        formatting(element, fakeText);
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
        isElement(output.firstChild) &&
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
          const digits = (inputText.match(/[+-]?\d+(\.\d+)?/g) || [''])[0];
          const numberFormat = ':number:';
          if (format.indexOf(numberFormat) !== -1) {
            // user has number in format
            outputAsHtml(output, format.replaceAll(numberFormat, digits));
          } else if (digits !== '') {
            // user does not have in format, but there are digits (e.g. score)
            const prefix = (inputText.match(/점|%/) || [''])[0];
            const lastCloseIdx = format.lastIndexOf('</');
            outputAsHtml(
              output,
              format.substring(0, lastCloseIdx) +
                ' (' +
                digits +
                prefix +
                ')' +
                format.substring(lastCloseIdx, format.length)
            );
          } else {
            // format for only text
            outputAsHtml(output, format);
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

  function isElement(obj) {
    try {
      // Using W3 DOM2 (works for FF, Opera and Chrome)
      return obj instanceof HTMLElement;
    } catch (e) {
      // Browsers not supporting W3 DOM2 don't have HTMLElement and
      // an exception is thrown and we end up here. Testing some
      // properties that all elements have (works on IE7)
      return (
        typeof obj === 'object' &&
        obj.nodeType === 1 &&
        typeof obj.style === 'object' &&
        typeof obj.ownerDocument === 'object'
      );
    }
  }
})();

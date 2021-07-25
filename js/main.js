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
    document.querySelectorAll('span[class^=result-]').forEach((element) => {
      if (element.classList.contains('result-text')) return;
      const fakeText = document.createElement('span');
      fakeText.setAttribute('class', 'result-fake-text');
      const box = isWillUpdate(element);
      if (box !== null) {
        addFakeResult(box, fakeText);
        addObserver(box, (resultText) => {
          const res = resultText.querySelector('span') || resultText;
          formatting(res, fakeText);
        });
      } else {
        // /source, /share
        addFakeResult(element, fakeText);
      }
      formatting(element, fakeText);
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
    }

    function formatting(input, output) {
      const type = (input.getAttribute('class') || '').trim();
      if (!type.startsWith('result-')) return;
      const inputText = input.innerText;
      Config.load(type, (format) => {
        if (!format) {
          input.style.display = '';
          output.style.display = 'none';
        } else {
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
    }
  }
})();

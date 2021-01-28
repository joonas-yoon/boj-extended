(function extend() {
  /* eslint-disable no-undef */
  const loc = window.location;

  if (loc.pathname.startsWith('/user/')) {
    extendUserPage();
  } else if (loc.pathname.startsWith('/status')) {
    extendStatusPage();
  } else if (loc.pathname.startsWith('/group/member/')) {
    extendGroupMemberPage();
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
      Config.load(type, (format) => {
        if (!format) {
          input.style.display = '';
          output.style.display = 'none';
        } else {
          input.style.display = 'none';
          output.style.display = '';
          output.innerHTML = format;
        }
      });
    }
  }
})();

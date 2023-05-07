function extendGlobal() {
  extendTheme();
  extendWide();
  extendFontStyle();
  extendReformatMessage();
  extendProblemPage();
  extendQuickSearch();
  extendProblemColor();
  extendLastViewPopup();
  extendUserBadge();

  async function extendProblemColor() {
    const problemInfo = await fetchProblemsByUser(getMyUsername());
    if (!problemInfo) return;
    // apply colors
    document.querySelectorAll('a[href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (href == '#') return;
      const pid = getProblemID(href);
      const alreadyHavingColor = el.className.includes('result-');
      if (pid !== null && !alreadyHavingColor && problemInfo[pid]) {
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
        console.log('showFakeResult (default: true)', showFakeResult);
        const formattingIfHasFake = (element, fakeText) => {
          // true or null (default)
          if (showFakeResult !== false) {
            formatting(element, fakeText);
          }
        };
        // add fake result for each texts
        document.querySelectorAll('span[class^=result-]').forEach((element) => {
          if (element.getAttribute('class') === 'result-text') return;
          const fakeText = Utils.createElement('span', {
            class: 'result-fake-text',
            style: 'display: none',
            children: [element.firstChild.cloneNode(true)],
          });
          const box = element.closest('.result-text');
          if (box !== null) {
            addFakeResult(box, fakeText);
            addObserver(box, (resultText) => {
              const statusElement = getStatusElement(resultText);
              onStatusElementUpdated(statusElement, showHistory);
              formattingIfHasFake(statusElement, fakeText);
            });
          } else {
            // /source, /share
            addFakeResult(element, fakeText);
          }
          formattingIfHasFake(element, fakeText);
        });
      });
    });

    function onStatusElementUpdated(statusElement, showHistory) {
      const statusId = getStatusId(statusElement);
      // save current percentage
      if (isUpdatable(statusElement)) {
        const percent = parseInt(statusElement.innerText.match(/\d+/)) || null;
        if (showHistory && percent !== null) {
          updateHistory(statusId, percent);
        }
      } else if (isAcceptResult(statusElement)) {
        deleteHistory(statusId);
      }
    }

    function getStatusElement(el) {
      return el.querySelector('span') || el;
    }

    function getStatusId(el) {
      return el.closest('tr').id;
    }

    function isUpdatable(el) {
      return (
        el.classList.contains('result-judging') &&
        !el.innerText.includes('런타임 에러 이유를 찾는 중')
      );
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
      const td = input.closest('td');
      if (!td) return;
      // replace text by user's format
      Config.load(type, (format) => {
        if (!format) {
          td.setAttribute('class', 'result');
          input.style.display = '';
          output.style.display = 'none';
        } else {
          td.setAttribute('class', 'result has-fake');
          input.style.display = 'none';
          output.style.display = '';
          const outputText = input.textContent.replaceAll(
            resultPattern[type],
            ''
          );
          const replacedText = format.replace(
            /<span (.+)?>(.*)<\/span>/gi,
            '<span $1>$2 ' + outputText + '</span>'
          );
          outputAsHtml(output, replacedText);
        }
      });
      // display latest percentage when it is not accept
      const id = input.closest('tr').id;
      const ptext = td.querySelector('.result-latest');
      if (
        !isAcceptResult(input) &&
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

  function isAcceptResult(el) {
    return el.classList.contains('result-ac');
  }

  function extendLastViewPopup() {
    const NOW = new Date();

    // load and display message pop up
    Config.load(Constants.CONFIG_LOCATION_HISTORY, (location) => {
      console.log('location from config', location);
      if (isSoLong(location)) {
        displayMessage(location);
      }
    });

    // save
    setTimeout(() => {
      const currentLocation = {
        title: document.title,
        href: window.location.href,
        timestamp: NOW.toISOString(),
      };
      console.log('location', currentLocation);
      // for global sync
      Config.save(
        Constants.CONFIG_LOCATION_HISTORY,
        JSON.stringify(currentLocation)
      );
    }, 100);

    function isSoLong(location) {
      if (!location) return false;
      try {
        const loc = JSON.parse(location);
        if (loc.href == window.location.href) return false;
        return NOW - loc.timestamp >= Constants.CONFIG_LOCATION_EXPIRE_MS;
      } catch (error) {
        console.log('so long', error);
        return false;
      }
    }

    function displayMessage(location) {
      const loc = JSON.parse(location);
      const messageBox = Utils.createElement('div', {
        class: 'boj-ext-alert alert-default',
      });
      const title = Utils.createElement('div', {
        class: 'title',
      });
      const close = Utils.createElement('div', {
        class: 'close',
      });
      title.innerHTML = '마지막으로 본 페이지 : ';
      title.innerHTML += `<a href="${loc.href}">${loc.title}</a>`;
      close.innerHTML = '<i class="fa fa-close"></i>';
      close.addEventListener('click', () => {
        document.body.removeChild(messageBox);
      });
      messageBox.appendChild(title);
      messageBox.appendChild(close);
      document.body.appendChild(messageBox);
    }
  }

  function extendFontStyle() {
    Config.load(Constants.CONFIG_FONT_STYLE, (rulesStr) => {
      const rules = JSON.parse(rulesStr || '{}');
      if (rules['enabled']) {
        document.head.appendChild(createFontStyleElement(rules));
      }
    });
  }

  function extendUserBadge() {
    if (!isLoggedIn()) return;

    const fetchUserSolvedAc = (handle) => {
      return new Promise((resolve, reject) => {
        console.log('request solved.ac.fetch.user', handle);
        chrome.runtime.sendMessage(
          {
            action: 'solved.ac.user',
            data: {
              value: handle,
            },
          },
          (response) => {
            console.groupCollapsed('solved.ac.fetch.user');
            console.log('api request:', handle);
            console.log('api response:', response);
            console.groupEnd();
            resolve(response);
          }
        );
      });
    };

    const getTier = async (handle) => {
      const cacheKey = `user:${handle}`;
      // keep user data as local cache in 1 hour
      const cacheValue = LocalCache.get(cacheKey, { expired: 1000 * 3600 * 1 });
      if (cacheValue === null) return 0;
      if (cacheValue !== undefined) return cacheValue.tier;
      const info = await fetchUserSolvedAc(handle);
      LocalCache.add(cacheKey, info);
      console.log('cache updated', cacheKey, info);
      return info === null ? 0 : info.tier;
    };

    Config.load(Constants.CONFIG_SHOW_USER_TIER, (showUserTier) => {
      // default as true
      if (showUserTier === false) return;
      const userTags = document.querySelectorAll('a[href^="/user/"]');
      userTags.forEach(async (tag) => {
        const tier = await getTier(tag.innerText);
        tag.innerHTML = `<img src="https://static.solved.ac/tier_small/${tier}.svg" class="solvedac-tier"/> ${tag.innerHTML}`;
      });
    });
  }
}

function extendUserPage() {
  Utils.loadCSS('css/user.css');

  function display(containers, key, visible) {
    readyPanels();
    containers.forEach((panel) => {
      if (visible) {
        panel.setAttribute(key, true);
      } else {
        panel.removeAttribute(key);
      }
    });
  }

  function getCurrentUsername() {
    const { pathname } = window.location;
    return pathname.replace('/user/', '') || '';
  }

  const panels = Array.from(document.getElementsByClassName('problem-list'));

  const checkboxTurnOff = Utils.createElement('input', {
    id: 'turn-off-all',
    type: 'checkbox',
  });
  const checkboxProbId = Utils.createElement('input', {
    id: 'show-pid',
    type: 'checkbox',
  });
  const checkboxProbTitle = Utils.createElement('input', {
    id: 'show-pname',
    type: 'checkbox',
  });
  const checkboxProbTier = Utils.createElement('input', {
    id: 'show-tier',
    type: 'checkbox',
  });
  const checkboxProbTierColor = Utils.createElement('input', {
    id: 'show-tier-color',
    type: 'checkbox',
  });

  const updateCheckboxTurnOff = (checked) => {
    const isEnabledDecorations = !checked;
    Config.save(Constants.CONFIG_SHOW_USER_DECO, isEnabledDecorations);
    if (!isEnabledDecorations) {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const checkAllCheckboxOff = () => {
    // if all checkboxes are off, turn off all
    if (
      checkboxProbId.checked ||
      checkboxProbTitle.checked ||
      checkboxProbTier.checked ||
      checkboxProbTierColor.checked
    ) {
      return;
    }
    checkboxTurnOff.checked = true;
    updateCheckboxTurnOff(true);
  };

  checkboxTurnOff.addEventListener('change', (evt) => {
    console.log('checkbox turn-off-all', evt);
    updateCheckboxTurnOff(evt.target.checked);
  });
  checkboxProbId.addEventListener('change', (evt) => {
    console.log('checkbox show-pid', evt);
    const checked = evt.target.checked;
    Config.save(Constants.CONFIG_SHOW_PROBLEM_ID, checked);
    if (checked) {
      checkboxTurnOff.checked = false;
      updateCheckboxTurnOff(false);
    }
    display(panels, 'show-id', checked);
    checkAllCheckboxOff();
  });
  checkboxProbTitle.addEventListener('change', (evt) => {
    console.log('checkbox show-pname', evt);
    const checked = evt.target.checked;
    Config.save(Constants.CONFIG_SHOW_PROBLEM_TITLE, checked);
    if (checked) {
      checkboxTurnOff.checked = false;
      updateCheckboxTurnOff(false);
    }
    display(panels, 'show-name', checked);
    checkAllCheckboxOff();
  });
  checkboxProbTier.addEventListener('change', (evt) => {
    console.log('checkbox show-tier', evt);
    const checked = evt.target.checked;
    Config.save(Constants.CONFIG_SHOW_PROBLEM_TIER, checked);
    if (checked) {
      checkboxTurnOff.checked = false;
      updateCheckboxTurnOff(false);
    }
    display(panels, 'show-tier', checked);
    checkAllCheckboxOff();
  });
  checkboxProbTierColor.addEventListener('change', (evt) => {
    console.log('checkbox show-tier-color', evt);
    const checked = evt.target.checked;
    Config.save(Constants.CONFIG_SHOW_PROBLEM_TIER_COLOR, checked);
    if (checked) {
      checkboxTurnOff.checked = false;
      updateCheckboxTurnOff(false);
    }
    display(panels, 'show-tier-color', checked);
    checkAllCheckboxOff();
  });

  const labelTurnOff = Utils.createElement('label', {
    for: 'turn-off-all',
    children: document.createTextNode('전부 끄기'),
  });
  const labelPId = Utils.createElement('label', {
    for: 'show-pid',
    children: document.createTextNode('문제 번호'),
  });
  const labelPTitle = Utils.createElement('label', {
    for: 'show-pname',
    children: document.createTextNode('문제 제목'),
  });
  const labelPTier = Utils.createElement('label', {
    for: 'show-tier',
    children: document.createTextNode('티어 표시'),
  });
  const labelPColor = Utils.createElement('label', {
    for: 'show-tier-color',
    children: document.createTextNode('티어 색상 표시'),
  });

  const checkboxes = Utils.createElement('div', {
    class: 'problem-toggles',
    children: [
      checkboxTurnOff,
      labelTurnOff,
      checkboxProbId,
      labelPId,
      checkboxProbTitle,
      labelPTitle,
      checkboxProbTier,
      labelPTier,
      checkboxProbTierColor,
      labelPColor,
    ],
  });

  // Create VS form
  setTimeout(() => {
    try {
      const wrapper = document.getElementsByClassName('col-md-9')[0];
      // add checkboxes whether problem's id or name
      wrapper.insertBefore(checkboxes, wrapper.firstChild);
      // add vs form
      wrapper.insertBefore(
        createVsForm(getCurrentUsername(), getMyUsername()), // eslint-disable-line no-undef
        checkboxes
      );
    } catch (e) {
      console.error(e);
    }
  }, 0);

  function readyPanels() {
    const MAX_DISPLAY_ITEMS = 100;

    const isDataReady = panels
      .map((panel) => panel.getAttribute('data-ready'))
      .some(Boolean);

    console.log('isDataReady', isDataReady);
    if (isDataReady) return;

    // set data-problem-id
    panels.forEach((panel) => {
      panel.setAttribute('data-ready', true);

      const problemTags = Array.from(panel.getElementsByTagName('a'));
      problemTags.forEach((e) => {
        if (!e.href) return;
        e.classList.add('problem-link-style-box');
      });
      setProblemAttributes(problemTags);

      // add button to display all
      if (problemTags.length > MAX_DISPLAY_ITEMS) {
        panel.classList.add('collpased');
        const panelFooter = Utils.createElement('div', {
          class: 'panel-footer',
        });
        const showButton = Utils.createElement('a', {
          class: 'btn-display-all',
        });
        showButton.innerText = '모두 보기';
        showButton.addEventListener('click', (evt) => {
          evt.preventDefault();
          panel.classList.remove('collpased');
          panelFooter.classList.add('hidden');
        });
        panelFooter.appendChild(showButton);
        panel.closest('.panel').appendChild(panelFooter);
      }
    });

    function fetchProblems(problemIds) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            action: 'solved.ac.problems',
            data: {
              value: problemIds,
            },
          },
          (response) => {
            console.groupCollapsed('solved.ac.fetch.problems');
            console.log('api request:', problemIds);
            console.log('api response:', response);
            console.groupEnd();
            resolve(response);
          }
        );
      });
    }

    function setProblemAttributes(problemTags) {
      const getProblemCache = (problemId) =>
        LocalCache.get(`problem:${problemId}`);
      const saveProblemCache = (problemId, data) =>
        LocalCache.add(`problem:${problemId}`, data);
      const isProblemCached = (problemId) =>
        getProblemCache(problemId) !== undefined;

      const listToMap = (list) => new Map(list.map((obj) => [obj.id, obj]));

      const addProblemDetailsToElements = async (tags) => {
        for (let i = 0; i <= Math.ceil(tags.length / 100); ++i) {
          const batch = tags.slice(i * 100, (i + 1) * 100) || [];
          if (batch.length === 0) break;
          const pids = batch.map(({ id }) => id);
          const details = await fetchProblems(pids);
          const arr = details.map(({ problemId, titleKo, level }) => ({
            id: problemId,
            title: titleKo,
            level,
          }));

          const infoByPid = listToMap(arr);
          batch.forEach(({ element: e, id }) => {
            e.setAttribute('data-problem-id', id);
            try {
              const problemInfo = infoByPid.get(Number(id));
              const { level, title } = problemInfo;
              e.setAttribute('data-tier', level);
              e.setAttribute('data-problem-title', title);
              saveProblemCache(id, problemInfo);
            } catch (err) {
              console.log(`'data-problem-id': ${id}`, err);
              e.setAttribute('data-tier', 0);
              e.setAttribute('data-problem-title', '(가져오기 실패)');
            }
          });
        }
      };

      const getPidfromProblemHref = (tag) => Number(tag.textContent);
      const pids = problemTags
        .map((tag) => ({ element: tag, id: getPidfromProblemHref(tag) }))
        .filter((x) => !isNaN(x.id));

      // apply cache first
      pids
        .filter(({ id }) => isProblemCached(id))
        .forEach(({ element: e, id }) => {
          e.setAttribute('data-problem-id', id);
          const { title, level } = getProblemCache(id);
          e.setAttribute('data-tier', level);
          e.setAttribute('data-problem-title', title);
        });

      const notCachedTags = pids.filter(({ id }) => !isProblemCached(id));
      console.log('notCachedTags', notCachedTags);
      addProblemDetailsToElements(notCachedTags);
    }
  }

  // sync with configs
  Config.load(Constants.CONFIG_SHOW_USER_DECO, (isActivated) => {
    const _isActivated = Utils.defaultAsFalse(isActivated); // default as false
    checkboxTurnOff.checked = !_isActivated;
    console.info(
      'All features for problem beautify are',
      _isActivated ? 'activated' : 'turned off'
    );
    if (!_isActivated) {
      return;
    }

    readyPanels();

    // apply others when it is enabled only
    Config.load(Constants.CONFIG_SHOW_PROBLEM_ID, (checked) => {
      checkboxProbId.checked = Utils.defaultAsTrue(checked);
      display(panels, 'show-id', checkboxProbId.checked);
    });
    Config.load(Constants.CONFIG_SHOW_PROBLEM_TITLE, (checked) => {
      checkboxProbTitle.checked = Utils.defaultAsFalse(checked);
      display(panels, 'show-name', checkboxProbTitle.checked);
    });
    Config.load(Constants.CONFIG_SHOW_PROBLEM_TIER, (checked) => {
      checkboxProbTier.checked = Utils.defaultAsTrue(checked);
      display(panels, 'show-tier', checkboxProbTier.checked);
    });
    Config.load(Constants.CONFIG_SHOW_PROBLEM_TIER_COLOR, (checked) => {
      checkboxProbTierColor.checked = Utils.defaultAsFalse(checked);
      display(panels, 'show-tier-color', checkboxProbTierColor.checked);
    });
  });
}

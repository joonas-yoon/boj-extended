function extendUserPage() {
  Utils.loadCSS('css/user.css');

  function display(containers, key, visible) {
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

  checkboxProbId.addEventListener('change', (evt) => {
    console.log('checkbox show-pid', evt);
    Config.save(Constants.CONFIG_SHOW_PROBLEM_ID, evt.target.checked);
    display(panels, 'show-id', evt.target.checked);
  });
  checkboxProbTitle.addEventListener('change', (evt) => {
    console.log('checkbox show-pname', evt);
    Config.save(Constants.CONFIG_SHOW_PROBLEM_TITLE, evt.target.checked);
    display(panels, 'show-name', evt.target.checked);
  });
  checkboxProbTier.addEventListener('change', (evt) => {
    console.log('checkbox show-tier', evt);
    Config.save(Constants.CONFIG_SHOW_PROBLEM_TIER, evt.target.checked);
    display(panels, 'show-tier', evt.target.checked);
  });
  checkboxProbTierColor.addEventListener('change', (evt) => {
    console.log('checkbox show-tier-color', evt);
    Config.save(Constants.CONFIG_SHOW_PROBLEM_TIER_COLOR, evt.target.checked);
    display(panels, 'show-tier-color', evt.target.checked);
  });

  const label1 = Utils.createElement('label', {
    for: 'show-pid',
    children: document.createTextNode('문제 번호'),
  });
  const label2 = Utils.createElement('label', {
    for: 'show-pname',
    children: document.createTextNode('문제 제목'),
  });
  const label3 = Utils.createElement('label', {
    for: 'show-tier',
    children: document.createTextNode('티어 표시'),
  });
  const label4 = Utils.createElement('label', {
    for: 'show-tier-color',
    children: document.createTextNode('티어 색상 표시'),
  });

  const checkboxes = Utils.createElement('div', {
    class: 'problem-toggles',
    children: [
      checkboxProbId,
      label1,
      checkboxProbTitle,
      label2,
      checkboxProbTier,
      label3,
      checkboxProbTierColor,
      label4,
    ],
  });

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

  const MAX_DISPLAY_ITEMS = 100;

  // set data-problem-id
  panels.forEach((panel) => {
    const problemTags = Array.from(panel.getElementsByTagName('a'));
    problemTags.forEach((e) => {
      if (!e.href) return;
      e.classList.add('problem-link-style-box');
    });
    setProblemAttributes(problemTags);

    // add button to display all
    if (problemTags.length > MAX_DISPLAY_ITEMS) {
      panel.classList.add('collpased');
      const panelFooter = Utils.createElement('div', { class: 'panel-footer' });
      const showButton = Utils.createElement('a', { class: 'btn-display-all' });
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
            const { level, title } = infoByPid.get(Number(id));
            e.setAttribute('data-tier', level);
            e.setAttribute('data-problem-title', title);
            saveProblemCache(id, infoByPid[id]);
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
    addProblemDetailsToElements(notCachedTags);
  }

  // sync with configs
  Config.load(Constants.CONFIG_SHOW_PROBLEM_ID, (checked) => {
    checkboxProbId.checked = !(checked === false);
    display(panels, 'show-id', checkboxProbId.checked);
  });
  Config.load(Constants.CONFIG_SHOW_PROBLEM_TITLE, (checked) => {
    checkboxProbTitle.checked = checked;
    display(panels, 'show-name', checkboxProbTitle.checked);
  });
  Config.load(Constants.CONFIG_SHOW_PROBLEM_TIER, (checked) => {
    checkboxProbTier.checked = !(checked === false);
    display(panels, 'show-tier', checkboxProbTier.checked);
  });
  Config.load(Constants.CONFIG_SHOW_PROBLEM_TIER_COLOR, (checked) => {
    checkboxProbTierColor.checked = checked;
    display(panels, 'show-tier-color', checkboxProbTierColor.checked);
  });
}

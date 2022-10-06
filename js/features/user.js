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

  const checkbox1 = Utils.createElement('input', {
    id: 'show-pid',
    type: 'checkbox',
  });
  const checkbox2 = Utils.createElement('input', {
    id: 'show-pname',
    type: 'checkbox',
  });
  const checkbox3 = Utils.createElement('input', {
    id: 'show-tier',
    type: 'checkbox',
  });
  const checkbox4 = Utils.createElement('input', {
    id: 'show-tier-color',
    type: 'checkbox',
  });

  checkbox1.addEventListener('change', (evt) => {
    console.log('checkbox show-pid', evt);
    Config.save(Constants.CONFIG_SHOW_PROBLEM_ID, evt.target.checked);
    display(panels, 'show-id', evt.target.checked);
  });
  checkbox2.addEventListener('change', (evt) => {
    console.log('checkbox show-pname', evt);
    Config.save(Constants.CONFIG_SHOW_PROBLEM_TITLE, evt.target.checked);
    display(panels, 'show-name', evt.target.checked);
  });
  checkbox3.addEventListener('change', (evt) => {
    console.log('checkbox show-tier', evt);
    Config.save(Constants.CONFIG_SHOW_PROBLEM_TIER, evt.target.checked);
    display(panels, 'show-tier', evt.target.checked);
  });
  checkbox4.addEventListener('change', (evt) => {
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
      checkbox1,
      label1,
      checkbox2,
      label2,
      checkbox3,
      label3,
      checkbox4,
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

  function setProblemAttributes(problemTags) {
    const getPidfromProblemHref = (tag) => Number(tag.textContent);
    const pids = problemTags
      .map((tag) => ({ element: tag, id: getPidfromProblemHref(tag) }))
      .filter((x) => !isNaN(x.id));
    const listToMap = (list) =>
      [{ id: '' }].concat(list).reduce((p, c) => ({ ...(p || {}), [c.id]: c }));
    for (let i = 0; i <= Math.ceil(pids.length / 100); ++i) {
      const batch = pids.slice(i * 100, (i + 1) * 100) || [];
      if (batch.length === 0) break;
      const map = listToMap(batch);
      const query = encodeURIComponent(batch.map((b) => b.id).join(','));
      fetch(`https://solved.ac/api/v3/problem/lookup?problemIds=${query}`)
        .then((res) => res.json())
        .then((res) => {
          res.forEach(({ problemId, level, titleKo }) => {
            const e = map[problemId].element;
            e.setAttribute('data-tier', level);
            e.setAttribute('data-problem-id', problemId);
            e.setAttribute('data-problem-title', titleKo);
          });
        });
    }
  }

  // sync with configs
  Config.load(Constants.CONFIG_SHOW_PROBLEM_ID, (checked) => {
    checkbox1.checked = !(checked === false);
    display(panels, 'show-id', checkbox1.checked);
  });
  Config.load(Constants.CONFIG_SHOW_PROBLEM_TITLE, (checked) => {
    checkbox2.checked = checked;
    display(panels, 'show-name', checkbox2.checked);
  });
  Config.load(Constants.CONFIG_SHOW_PROBLEM_TIER, (checked) => {
    checkbox3.checked = !(checked === false);
    display(panels, 'show-tier', checkbox3.checked);
  });
  Config.load(Constants.CONFIG_SHOW_PROBLEM_TIER_COLOR, (checked) => {
    checkbox4.checked = checked;
    display(panels, 'show-tier-color', checkbox4.checked);
  });
}

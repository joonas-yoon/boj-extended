/**
 * location: /status/
 */
function extendStatusPage() {
  Utils.loadCSS('css/status.css');
  Utils.loadScript('js/features/status/rte.js');

  const table = document.getElementById('status-table');
  const form = document.querySelector('form[action="/status"]');
  _extendStatusTable(
    form,
    table,
    ['7%', '12%', '9%', '24%', '9%', '9%', '12%', '9%', '9%'],
    ['7%', '12%', '17%', '20%', 'auto', 'auto', '12%', '9%', '9%'],
    []
  );
}

/**
 * location: /rejudge/
 */
function extendRejudgePage() {
  Utils.loadCSS('css/status.css');

  const table = document.getElementById('rejudge-table');
  const form = table.parentNode;
  // rejudge has no attribute 'data-original-title'
  Config.getProblems((problems) => {
    _extendStatusTable(
      form,
      table,
      ['8%', '8%', '8%', '8%', '7%', '14%', '8%', '7%', '14%', '9%', '9%'],
      [
        'auto',
        'auto',
        'auto',
        '8%',
        '7%',
        'auto',
        '8%',
        '7%',
        'auto',
        'auto',
        'auto',
      ],
      problems
    );
  });
}

function createCheckboxForm(dispatchDisplay) {
  const { container: pidContainer, input: pidInput } =
    Utils.createCheckboxElement('문제 번호', 'option-status-pid');
  const { container: ptitleContainer, input: ptitleInput } =
    Utils.createCheckboxElement('문제 제목', 'option-status-ptitle');

  const dispatchChangeEvent = () => {
    dispatchDisplay({
      inputProblemId: pidInput,
      inputProblemTitle: ptitleInput,
    });
  };

  const onChangeCheckbox = (configKey) => (evt) => {
    Config.save(configKey, Boolean(evt.target.checked), dispatchChangeEvent);
  };

  pidInput.addEventListener(
    'change',
    onChangeCheckbox(Constants.CONFIG_SHOW_STATUS_PID)
  );
  ptitleInput.addEventListener(
    'change',
    onChangeCheckbox(Constants.CONFIG_SHOW_STATUS_PTITLE)
  );

  Config.load(Constants.CONFIG_SHOW_STATUS_PID, (showProbId) => {
    pidInput.checked = !(showProbId === false); // default as true
    dispatchChangeEvent();
  });

  Config.load(Constants.CONFIG_SHOW_STATUS_PTITLE, (showProbTitle) => {
    ptitleInput.checked = Boolean(showProbTitle);
    dispatchChangeEvent();
  });

  const container = Utils.createElement('div', {
    style: 'display: inline-block;',
  });
  container.appendChild(pidContainer);
  container.appendChild(ptitleContainer);
  return container;
}

function _extendStatusTable(
  container,
  table,
  beforeWidth,
  afterWidth,
  problemsLookup
) {
  // width to fit-content
  const tableHeadCols = table.querySelectorAll('th');
  const titles = table.querySelectorAll('a[href^="/problem/"]');

  // width to fit-content
  tableHeadCols.forEach((e, i) => {
    e.style.width = beforeWidth[i];
  });

  // highlight my result
  const username = getMyUsername();
  table.querySelectorAll('a[href^="/user/"]').forEach((e) => {
    const text = e.textContent;
    if (username == text) {
      e.closest('tr').setAttribute('class', 'result-mine');
    }
  });
  titles.forEach((e) => {
    const pid = e.textContent;
    if (e.getAttribute('data-original-id') == undefined) {
      e.setAttribute('data-original-id', pid);
    }
    if (e.getAttribute('data-original-title') == undefined) {
      e.setAttribute('data-original-title', problemsLookup[pid]['title']);
    }
  });

  function display({ inputProblemId, inputProblemTitle }) {
    const showPid = Boolean(inputProblemId.checked);
    const showTitle = Boolean(inputProblemTitle.checked);
    const createProblemText = (id, title) => {
      if (showPid && showTitle) {
        return `${id}번 (${title})`;
      } else if (showPid) {
        return `${id}`;
      } else if (showTitle) {
        return `${title}`;
      } else {
        return '';
      }
    };

    // apply for each titles
    titles.forEach((e) => {
      const pid = e.getAttribute('data-original-id');
      const ptitle = e.getAttribute('data-original-title');
      const problemText = createProblemText(pid, ptitle);
      e.textContent = problemText;
    });

    // fit column width
    tableHeadCols.forEach((e, i) => {
      e.style.width = afterWidth[i];
    });
  }

  container.insertBefore(createCheckboxForm(display), container.firstChild);
}

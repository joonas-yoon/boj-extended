/**
 * location: /status/
 */
function extendStatusPage() {
  Utils.loadCSS('css/status.css');
  Utils.loadScript('js/status-rte.js');

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

function _createRadioForm(form, callback) {
  // load and apply to display pid/pname
  Config.load(Constants.CONFIG_SHOW_STATUS_PID, (showPid) => {
    const radio1 = Utils.createRadioElement(
      '문제 번호',
      (evt) => {
        Config.save(Constants.CONFIG_SHOW_STATUS_PID, true, callback);
      },
      !!showPid
    );
    const radio2 = Utils.createRadioElement(
      '문제 제목',
      (evt) => {
        Config.save(Constants.CONFIG_SHOW_STATUS_PID, false, callback);
      },
      !showPid
    );
    form.insertBefore(radio2, form.firstChild);
    form.insertBefore(radio1, form.firstChild);
    if (callback && typeof callback === 'function') {
      setTimeout(() => callback(!!showPid), 10);
    }
  });
}

function _extendStatusTable(
  container,
  table,
  beforeWidth,
  afterWidth,
  problemNames
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
    if (username == e.innerText) {
      e.closest('tr').setAttribute('class', 'result-mine');
    }
  });
  titles.forEach((e) => {
    if (e.getAttribute('data-original-id') == undefined) {
      e.setAttribute('data-original-id', e.innerText);
    }
    if (e.getAttribute('data-original-title') == undefined) {
      // put data-original-title
      e.setAttribute('data-original-title', problemNames[e.innerText]);
    }
  });

  function display(showPid) {
    // apply for each titles
    titles.forEach((e) => {
      if (showPid) {
        e.innerText = e.getAttribute('data-original-id');
      } else {
        const text = e.getAttribute('data-original-title');
        e.innerText = text.length > 20 ? text.substr(0, 17) + '…' : text;
      }
    });
    // fit column width
    tableHeadCols.forEach((e, i) => {
      e.style.width = afterWidth[i];
    });
  }

  _createRadioForm(container, display);
}

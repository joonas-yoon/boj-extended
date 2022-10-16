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

function _createCheckForm(form, callback) {
  // load and apply to display pid/pname
  Config.load(Constants.CONFIG_SHOW_STATUS_PID, (showPid) => {
    Config.load(Constants.CONFIG_SHOW_STATUS_TITLE, (showTitle) => {
      const check1 = Utils.createCheckElement(
        '문제 번호',
        (evt) => {
          Config.save(
            Constants.CONFIG_SHOW_STATUS_PID,
            Boolean(evt.target.checked),
            callback
          );
        },
        showPid,
        'option-status-pid'
      );
      const check2 = Utils.createCheckElement(
        '문제 제목',
        (evt) => {
          Config.save(
            Constants.CONFIG_SHOW_STATUS_TITLE,
            Boolean(evt.target.checked),
            callback
          );
        },
        showTitle,
        'option-status-title'
      );
      form.insertBefore(check2, form.firstChild);
      form.insertBefore(check1, form.firstChild);
      if (callback && typeof callback === 'function') {
        setTimeout(() => callback(), 10);
      }
    });
  });
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

  function display() {
    // apply for each titles
    titles.forEach((e) => {
      const oStatusPid = document.getElementsByName('option-status-pid');
      const oStatusTitle = document.getElementsByName('option-status-Title');
      const showTitle = Boolean(oStatusTitle.checked);
      const showPid = Boolean(oStatusPid.checked);
      let problemText = '';
      if (showTitle) {
        problemText = e.getAttribute('data-original-title');
      }
      if (showPid) {
        if (problemText != '') {
          problemText += '(' + e.getAttribute('data-original-id') + ')';
        } else {
          problemText = e.getAttribute('data-original-id');
        }
      }
      e.innerText =
        problemText.length > 20 ? problemText.substr(0, 17) + '…' : problemText;
    });
    // fit column width
    tableHeadCols.forEach((e, i) => {
      e.style.width = afterWidth[i];
    });
  }

  _createCheckForm(container, display);
}

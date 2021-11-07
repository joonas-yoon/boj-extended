function extendNotificationsPage() {
  // TODO: save cache in local storage
  const currentId = getMyUsername();
  Utils.requestAjax('/user/' + currentId, (resultHtml) => {
    // parse user information
    const parser = new DOMParser();
    const doc = parser.parseFromString(resultHtml, 'text/html');
    const problems = doc.querySelectorAll(
      'a[href^="/problem/"][class^="result-"]'
    );
    const results = {};
    for (const a of problems) {
      const pid = getPid(a.href);
      const cls = a.getAttribute('class');
      results[pid] = cls;
    }
    // coloring
    coloringProblems(results);
  });

  function getPid(href) {
    return parseInt(href.substr(href.lastIndexOf('/') + 1));
  }

  function coloringProblems(problemsInfo) {
    const container = document.getElementById('notifications');
    container.querySelectorAll('a[href^="/problem/"]').forEach((el) => {
      el.classList.add(problemsInfo[getPid(el.href)]);
    });
  }
}

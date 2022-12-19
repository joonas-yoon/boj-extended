function extendBoardPage() {
  const pathname = window.location.pathname;
  if (
    pathname.startsWith('/board/list/') ||
    pathname.startsWith('/board/search/')
  ) {
    // pre-update to rows
    const titles = document.querySelectorAll('a[href].problem_title');
    titles.forEach((e) => {
      if (e.getAttribute('data-original-id') == undefined) {
        e.setAttribute('data-original-id', e.innerText);
      }
    });

    // width to fit-content
    const theads = document.querySelectorAll('table.table tr th');
    theads[1].style.width = 'auto';
    theads[2].style.width = 'auto';

    // load and apply to display pid/pname
    Config.load('show-status-pid', (showPid) => {
      setTimeout(() => display(titles, !!showPid, 10), 10);
    });
  }

  function display(titles, showPid, maxLength) {
    titles.forEach((e) => {
      if (showPid) {
        e.innerText = e.getAttribute('data-original-id');
      } else {
        const text = e.getAttribute('data-original-title');
        e.innerText =
          text.length > maxLength ? text.substr(0, maxLength - 3) + '…' : text;
      }
    });
  }
}

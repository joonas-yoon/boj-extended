function extendBoardPage() {
  const pathname = window.location.pathname;
  if (
    !pathname.startsWith('/board/list/') &&
    !pathname.startsWith('/board/search/')
  ) {
    // not board page
    return;
  }

  // display my button
  setTimeout(displayMyButton, 0);

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
    setTimeout(() => displayProblem(titles, !!showPid, 10), 0);
  });

  function displayProblem(titles, showPid, maxLength) {
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

  function displayMyButton() {
    const username = getMyUsername();
    if (!username) {
      // not logged in
      return;
    }
    const container = document.querySelector('.container.content ul.nav');
    const li = document.createElement('li');
    const a = document.createElement('a');
    const link = createMyButtonLink(username);
    a.href = link;
    a.textContent = '내가 작성한 글';
    if (link == pathname) {
      li.className = 'active';
    }
    li.appendChild(a);
    container.appendChild(li);
  }

  function createMyButtonLink(username) {
    const paths = pathname.split('/');
    const getBoardName = (name) => {
      // legacy board links
      if (name == '0') return 'all';
      else if (name == '1') return 'notice';
      else if (name == '2') return 'free';
      else if (name == '3') return 'question';
      else return name;
    };
    return `/board/search/${getBoardName(paths[3])}/author/${username}`;
  }
}

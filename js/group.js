function extendGroupListPage() {
  Config.load('show-group-link', (showGroupLink) => {
    console.log('show-group-link', showGroupLink);
    if (showGroupLink === false) return; // pass if it is null

    const table = document.querySelector('.table');
    const isMyList = window.location.pathname.indexOf('all') === -1;
    let colNames = [];
    let colWidths = [];

    // /group/list (only for logged user)
    if (isMyList) {
      colNames = [
        { text: '문제집', url: '/group/workbook/list/' },
        { text: '채점 현황', url: '/status?group_id=' },
        { text: '연습', url: '/group/practice/' },
        { text: '랭킹', url: '/group/ranklist/' },
        { text: '게시판', url: '/group/board/list/' },
        { text: '파일', url: '/group/files/' },
      ];
      colWidths = [40, 16, 5, 8, 10, 5, 5, 6, 5];
    } else {
      // /group/list/all
      colNames = [{ text: '가입 신청', url: '/group/join/' }];
      colWidths = [70, 15, 5, 10];
    }

    // add links for each all rows
    table.querySelectorAll('tr').forEach(addColumns);

    // re-balance columns width
    const headCols = table.getElementsByTagName('th');
    colWidths.forEach(
      (width, index) => (headCols[index].style.width = `${width}%`)
    );

    function addColumns(tr) {
      const gid = getGidFromRow(tr);
      colNames.forEach((info) => {
        if (gid !== null) {
          const td = document.createElement('td');
          td.innerHTML = `<a href="${info.url}${gid}">${info.text}</a>`;
          tr.appendChild(td);
        } else {
          const th = document.createElement('th');
          th.innerText = info.text;
          tr.appendChild(th);
        }
      });
    }

    function getGidFromRow(row) {
      const td = row.firstElementChild;
      const a = td.getElementsByTagName('a');
      if (a.length !== 0) return parseInt(a[0].pathname.replace('/group/', ''));
      else return null;
    }
  });
}

function extendGroupMemberPage() {
  function sortMemebers(container, comparator, asc) {
    const arr = Array.from(container.children);
    arr.sort(comparator);
    for (let i = 0; i < arr.length; ++i) {
      if (asc) container.appendChild(arr[i]);
      else container.insertBefore(arr[i], container.firstChild);
    }
    console.log(arr, container);
  }

  function sortByName(a, b) {
    return a.innerText
      .split(' ')[0]
      .toLowerCase()
      .localeCompare(b.innerText.split(' ')[0].toLowerCase());
  }

  function sortByTime(a, b) {
    return toTime(a) - toTime(b);
  }

  function toTime(e) {
    const s = e.innerText.split(' ').slice(1)[0];
    if (s.endsWith('년')) return parseInt(s.slice(0, -1)) * 24 * 365;
    else if (s.endsWith('개월')) return parseInt(s.slice(0, -2)) * 24 * 31;
    else if (s.endsWith('일')) return parseInt(s.slice(0, -1)) * 24;
    else if (s.endsWith('시간')) return parseInt(s.slice(0, -2));
    else if (s.endsWith('분')) return parseInt(s.slice(0, -2)) / 60;
    else if (s.endsWith('초')) return parseInt(s.slice(0, -2)) / 3600;
    else return 0;
  }

  const storageKey = 'group-mem-sort';
  const adMembers = document.getElementById('admin_member');
  const tmMembers = document.getElementById('team_member');

  const nav = document.querySelector('ul.nav.nav-pills');
  const btn = document.createElement('li');
  btn.setAttribute('class', 'active');
  btn.innerHTML = '<a>정렬 기준</a>';
  btn.style.cursor = 'pointer';
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();
    Config.load(storageKey, (sortBy) => {
      Config.save(
        storageKey,
        sortBy == 'name' ? 'time' : 'name',
        sortAndUpdate
      );
    });
  });
  nav.insertBefore(btn, nav.children[2]);

  function sortAndUpdate(sortBy) {
    sortBy = sortBy || 'name'; // default: name
    const desc = sortBy[0] == '-';
    if (sortBy.endsWith('time')) {
      btn.innerHTML = '<a>정렬: 최신순</a>';
      sortMemebers(adMembers, sortByTime, !desc);
      sortMemebers(tmMembers, sortByTime, !desc);
    } else if (sortBy.endsWith('name')) {
      btn.innerHTML = '<a>정렬: 이름순</a>';
      sortMemebers(adMembers, sortByName, !desc);
      sortMemebers(tmMembers, sortByName, !desc);
    }
  }

  Config.load(storageKey, sortAndUpdate);
}

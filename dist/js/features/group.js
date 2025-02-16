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
        { text: '문제집', url: '/group/workbook/' },
        { text: '채점 현황', url: '/status?group_id=' },
        { text: '연습', url: '/group/practice/' },
        { text: '랭킹', url: '/group/ranklist/' },
        { text: '게시판', url: '/group/board/list/' },
        { text: '파일', url: '/group/file/' },
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

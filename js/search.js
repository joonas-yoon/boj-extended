/* eslint-disable camelcase */
function extendQuickSearch() {
  // constants
  const TAB_INDEX_KEY = 'tidx';
  // variables
  let searchHandle = null;
  let lastSearchText = '';
  let problemInfo = {};
  let currentTabIndex = 0;
  let isOverlay = false;
  const tabs = [
    { title: '문제', c: 'Problems', active: true, el: null },
    { title: '문제집', c: 'Workbooks', el: null },
    { title: '출처', c: 'Categories', el: null },
    { title: '블로그', c: 'Blogs', el: null },
    { title: '게시판', c: 'Articles', el: null },
  ];

  // UI: overlay
  const bg = Utils.createElement('div', {
    id: 'quick-search',
    class: 'overlay',
  });
  const container = Utils.createElement('div', {
    class: 'container',
  });
  const form = Utils.createElement('div', {
    class: 'form-group',
  });
  const input = Utils.createElement('input', {
    class: 'form-control',
    placeholder: '검색',
    autofucus: true,
  });
  const resultBox = Utils.createElement('div', {
    class: 'results',
  });
  const resultFooter = Utils.createElement('div', {
    class: 'results-footer',
  });
  resultFooter.innerText = '결과 표시 (0.000초)';
  const moreButton = Utils.createElement('a', {
    class: 'btn btn-default more-button',
    href: '/search',
  });
  moreButton.innerText = '더 많은 검색 결과 보기';
  form.appendChild(input);
  form.appendChild(resultBox);
  // UI: tabs
  const tabsContainer = Utils.createElement('div', {
    class: 'tabs',
  });
  for (let i = 0; i < tabs.length; ++i) {
    const tab = tabs[i];
    const tabEl = Utils.createElement('div', {
      class: 'tab',
      tidx: i,
      tabindex: -1,
    });
    tabEl.innerText = tab.title;
    if (tab.active) tabEl.classList.add('active');
    tabEl.addEventListener('click', (evt) => {
      evt.preventDefault();
      activateTab(tabEl.getAttribute(TAB_INDEX_KEY));
    });
    tabs[i].el = tabEl; // refer
    tabsContainer.appendChild(tabEl);
  }
  container.appendChild(tabsContainer);
  container.appendChild(form);
  container.appendChild(resultFooter);
  container.appendChild(moreButton);
  bg.appendChild(container);
  document.body.appendChild(bg);
  // UI: add button to topbar
  const btnLi = document.createElement('li');
  const btnBar = document.createElement('a');
  btnBar.innerHTML = '<i class="fa fa-search"></i>';
  btnLi.appendChild(btnBar);
  btnBar.addEventListener('click', (evt) => {
    evt.preventDefault();
    activate(true);
  });
  addElementToBar(btnLi);

  // add event listener to input
  input.addEventListener('keyup', async (evt) => {
    evt.preventDefault();
    const text = evt.target.value;
    const textEval = text.replace(/\s/g, '');
    if (lastSearchText !== textEval) {
      lastSearchText = textEval;
      clearTimeout(searchHandle);
      searchHandle = setTimeout(() => {
        search(text);
      }, 100);
    }
  });

  // handle key event
  const keyPressed = new Set();
  document.addEventListener('keydown', (evt) => {
    keyPressed.add(evt.key);
    if (isOverlay) {
      // Tab: switch tab
      if (evt.key === 'Tab') {
        if (keyPressed.has('Shift')) {
          // shift: go previous tab
          currentTabIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
        } else {
          // go next tab
          currentTabIndex = (currentTabIndex + 1) % tabs.length;
        }
        activateTab(currentTabIndex);
        evt.preventDefault();
      }
    }
  });
  document.addEventListener('keyup', (evt) => {
    console.log(evt);
    // ESC: deactivate
    // Ctrl+/ or Alt+/: activate
    if (keyPressed.has('Escape')) {
      activate(false);
    } else if (
      keyPressed.has('/') &&
      (keyPressed.has('Control') || keyPressed.has('Alt'))
    ) {
      activate(true);
    }
    keyPressed.delete(evt.key);
  });

  // dismiss search overlay
  document.addEventListener('click', (evt) => {
    if (evt.target == bg) activate(false);
  });

  async function activate(on) {
    isOverlay = !!on;
    if (on === true) {
      // fetch problem status by current user
      problemInfo = await fetchProblemsByUser(getMyUsername());
      // set variables
      bg.style.display = 'flex';
      setTimeout(() => {
        input.focus();
      }, 10);
    } else {
      // deactivate
      bg.style.display = 'none';
    }
  }

  function activateTab(tabIndex) {
    for (const tab of tabs) {
      const isActive = tab.el.getAttribute(TAB_INDEX_KEY) == tabIndex;
      if (isActive) {
        tab.el.classList.add('active');
      } else {
        tab.el.classList.remove('active');
      }
    }
    currentTabIndex = Number(tabIndex);
    search(input.value);
  }

  async function search(searchText) {
    // scroll to top
    resultBox.scroll(0, 0);
    // hijack
    const currentIndexName = tabs[currentTabIndex].c || 'Problems';
    const dataForm = {
      requests: [
        {
          indexName: currentIndexName,
          params: encodeURI(
            'query=' + searchText + '&page=0&facets=[]&tagFilters='
          ),
        },
      ],
    };
    const { results } = await fetch(
      Constants.QUICK_SEARCH_URL + '?' + Constants.QUICK_SEARCH_QUERY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify(dataForm),
      }
    ).then((res) => res.json());

    const { hits, processingTimeMS, nbHits } = results[0];
    resultBox.innerHTML = '';
    console.groupCollapsed(`${currentIndexName}: "${searchText}"`);
    console.log('results', results[0]);
    for (const res of hits) {
      const item = createResultItem(res, currentIndexName);
      if (item) resultBox.appendChild(item);
      console.log(res);
    }
    console.groupEnd();
    moreButton.href = encodeURI(
      '/search#q=' + searchText + '&c=' + currentIndexName
    );
    resultFooter.innerHTML = `${nbHits}개의 결과 중 ${hits.length}개 표시 (${
      processingTimeMS / 1000
    }초)`;
  }

  function createResultItem(result, indexName) {
    if (result == null) return null;
    switch (indexName) {
      case 'Problems':
        return createItemFromHTML(htmlProblems(result));
      case 'Workbooks':
        return createItemFromHTML(htmlWorkbooks(result));
      case 'Categories':
        return createItemFromHTML(htmlCategories(result));
      case 'Blogs':
        return createItemFromHTML(htmlBlogs(result));
      case 'Articles':
        return createItemFromHTML(htmlArticles(result));
      default:
        return null;
    }
  }

  function createItemFromHTML(html) {
    const item = Utils.createElement('div', { class: 'quick-search-item' });
    item.innerHTML = html;
    return item;
  }

  function htmlProblems(result) {
    const { id, time, memory, _highlightResult } = result;
    const { title, description } = _highlightResult;
    return `\
      <div class="title"><a href="/problem/${id}">${id}번 - ${title.value}</a></div>\
      <div class="meta">시간 제한: ${time}초 &nbsp; 메모리 제한: ${memory}MB</div>\
      <div class="desc">${description.value}</div>\
      <div class="links"> \
        <a href="/submit/${id}">제출</a> \
        <a href="/problem/status/${id}">맞은 사람</a> \
        <a href="/status?from_problem=1&amp;problem_id=${id}">채점 현황</a> \
      </div> \
    `;
  }
  function htmlWorkbooks(result) {
    const { id, problems, creator: author, _highlightResult } = result;
    const { name, comment, creator, problem } = _highlightResult;
    const problemList = (problem || [])
      .filter(({ problem_id, title }) => {
        return problem_id.matchedWords.length || title.matchedWords.length;
      })
      .map(({ problem_id, title }) => {
        const pid = problem_id.value.replace(/(<([^>]+)>)/gi, '');
        const problemColor = problemInfo[pid] || '';
        return `<span class="problem">\
          <a href="/problem/${pid}" class="${problemColor}">${problem_id.value}번 ${title.value}</a>\
        </span>`;
      })
      .join('\n');
    return `\
      <div class="title"><a href="/workbook/view/${id}">${name.value}</a></div>\
      <div class="meta">
        <span class="author">만든 사람: <a href="/user/${author}">${creator.value}</a></span>\
        <span class="count">문제: ${problems}</span>\
      </div>\
      <div class="desc">${comment.value}</div>\
      <div class="links">\
        ${problemList}
      </div>\
    `;
  }
  function htmlCategories(result) {
    const { avail, id, parents, total, _highlightResult } = result;
    const { name } = _highlightResult;
    const breadcrumb = (parents || [])
      .map(
        (child) => `<li><a href="/category/${child.id}">${child.name}</a></li>`
      )
      .join('\n');
    return `\
      <ul class="list-inline up-ul search-breadcrumb">${breadcrumb}</ul>
      <div class="title"><a href="/category/detail/view/${id}">${name.value}</a></div>\
      <div class="meta">전체 문제: ${total} &nbsp; 풀 수 있는 문제: ${avail}</div>\
    `;
  }
  function htmlBlogs(result) {
    const { id, user, comments, date, tags } = result;
    const { title } = result._highlightResult;
    const { content } = result._snippetResult;
    const tagList = tags
      .filter((tag) => tag.length > 0)
      .map((tag) => `<span class="tag">#${tag}</span>`)
      .join('\n');
    return `\
      <div class="title"><a href="/blog/view/${id}">${title.value}</a></div>\
      <div class="meta">\
        <span class="date">${date}</span>\
        <a class="author" href="/user/${user}">${user}</a>\
        <a href="/blog/view/${id}#comments"><i class="fa fa-comments-o"></i> ${comments}</a>\
      </div>\
      <div class="desc">${content.value}</div>\
      <div class="links">${tagList}</div> \
    `;
  }
  function htmlArticles(result) {
    const { id, problem, category, created, user, comments, like } = result;
    const { subject } = result._highlightResult;
    const { content } = result._snippetResult;
    let problemTag = '';
    let problemColor = '';
    if (problem != null) {
      problemColor = problemInfo[problem] || '';
      problemTag = `<a href="/problem/${problem}" class="${problemColor}">${problem}번</a>&nbsp;`;
    }
    return `\
      <div class="meta ${problemColor}">\
        ${problemTag}<span>${category}</span>\
      </div>
      <div class="title"><a href="/board/view/${id}">${subject.value}</a></div>\
      <div class="meta">\
        <span class="date">${created}</span>\
        <a class="author" href="/user/${user}">${user}</a>\
        <a href="/board/view/${id}#comments" class="comments"><i class="fa fa-comments-o"></i> ${comments}</a>\
        <span><i class="fa fa-thumbs-o-up"></i> ${like}</span>\
      </div>\
      <div class="desc">${content.value}</div>\
    `;
  }
}

async function extendSearchPage() {
  const container = document
    .getElementById('result')
    .getElementsByClassName('results')[0];
  if (!container) {
    // retry in 10 seconds
    setTimeout(extendSearchPage, 1000 * 10);
    return;
  }

  const problemsInfo = await fetchProblemsByUser(getMyUsername());
  if (!problemsInfo) return;

  function coloringProblems(elementContainer) {
    elementContainer.querySelectorAll('a[href^="/problem/"]').forEach((el) => {
      const hrefText = el.href || '';
      // only for link to problem
      if (hrefText.match(/\/problem\/[0-9]+$/)) {
        const cls = problemsInfo[getLastNumberFromHref(hrefText)];
        if (cls) el.classList.add(cls);
      }
    });
  }

  // observe target
  const observer = new MutationObserver(function (mutations) {
    if (mutations.length == 0) return;
    coloringProblems(mutations[0].target);
  });

  // start to observe
  const config = { attributes: true, childList: true, characterData: true };
  observer.observe(container, config);
  // color first on load
  coloringProblems(container);
}

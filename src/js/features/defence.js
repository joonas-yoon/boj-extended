function extendRandomDefence() {
    // UI: add button to topbar
     const TAB_INDEX_KEY = 'tidx';
  const LAST_SEARCH_STATE = 'qs-last-state';
  // variables
  // let searchHandle = null; // for UI
  // let lastSearchText = '';
  // let currentTabIndex = 0;
  // let isOverlay = false; // for UI
  // let problemInfo = {};
  const searchState = {
    totalCount: 0,
    maxPage: 0,
    curPage: 0,
    lock: false,
  };
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
      [TAB_INDEX_KEY]: i,
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
  btnBar.innerHTML = '<i class="fa fa-shield"></i>';
  btnLi.appendChild(btnBar);
  btnBar.addEventListener('click', (evt) => {
    evt.preventDefault();
    activate(true);
  });
  addElementToBar(btnLi);
}
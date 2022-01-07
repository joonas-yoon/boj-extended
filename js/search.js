function extendQuickSearch() {
  let isActive = false;

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
  resultFooter.innerText = '-';
  const moreButton = Utils.createElement('a', {
    class: 'btn btn-default more-button',
    href: '/search',
  });
  moreButton.innerText = '더 많은 검색 결과 보기';
  form.appendChild(input);
  form.appendChild(resultBox);
  container.appendChild(form);
  container.appendChild(resultFooter);
  container.appendChild(moreButton);
  bg.appendChild(container);
  document.body.appendChild(bg);

  let searchHandle = null;
  let lastSearchText = '';

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

  const keyPressed = new Set();
  document.addEventListener('keydown', (evt) => {
    keyPressed.add(evt.key);
  });
  document.addEventListener('keyup', (evt) => {
    console.log(evt);
    if (keyPressed.has('Escape')) {
      isActive = false;
      bg.style.display = 'none';
    } else if (
      keyPressed.has('/') &&
      (keyPressed.has('Control') || keyPressed.has('Alt'))
    ) {
      isActive = true;
      bg.style.display = 'flex';
      setTimeout(() => {
        input.focus();
      }, 10);
    }
    keyPressed.delete(evt.key);
  });

  // dismiss search overlay
  document.addEventListener('click', (evt) => {
    if (evt.target == bg) {
      isActive = false;
      bg.style.display = 'none';
    }
  });

  async function search(searchText) {
    const dataForm = {
      requests: [
        {
          indexName: 'Problems',
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

    resultBox.innerHTML = '';
    const { hits, processingTimeMS, nbHits } = results[0];
    console.log(results[0]);
    for (const res of hits) {
      const { id, time, memory } = res;
      const { title, description } = res._highlightResult;
      const item = Utils.createElement('div', { class: 'quick-search-item' });
      item.innerHTML = `\
        <div class="title"><a href="/problem/${id}">${id}번 - ${title.value}</a></div>\
        <div class="meta">시간 제한: ${time}초 &nbsp; 메모리 제한: ${memory}MB</div>\
        <div class="desc">${description.value}</div>\
        <div class="links"> \
          <a href="/submit/${id}">제출</a> \
          <a href="/problem/status/${id}">맞은 사람</a> \
          <a href="/status?from_problem=1&amp;problem_id=${id}">채점 현황</a> \
        </div> \
      `;
      resultBox.appendChild(item);
    }
    moreButton.href = encodeURI('/search#q=' + searchText + '&c=Problems');
    resultFooter.innerHTML = `${nbHits}개의 결과 중 ${hits.length}개 표시 (${
      processingTimeMS / 1000
    }초)`;
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

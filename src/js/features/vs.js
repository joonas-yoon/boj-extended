function extendVs() {
  Utils.loadCSS('css/user.css');

  const { pathname } = window.location;
  const urlPrefix = '/vs/';
  const users = pathname.substr(urlPrefix.length).split('/') || [];
  if (users.length !== 2) {
    alert('비교 대상은 2명만 가능합니다.');
    window.history.back();
    return;
  }

  // main
  Config.getProblems((problemsLookup) => {
    // recreate page
    const container = document.getElementsByClassName('container content')[0];
    container.innerHTML = '';

    // add vs form
    const vsform = createVsForm(users[0], users[1]); // eslint-disable-line no-undef
    vsform.style.marginBottom = '20px';
    container.appendChild(vsform);

    // change title
    document.title = users[0] + ' vs ' + users[1];

    // text
    const TITLE_AC = '맞은 문제';
    const TITLE_PAC = '맞았지만';
    const TITLE_WA = '시도했지만';

    const tagByPid = {};

    fetchProblems(users[0], async (p1) => {
      let solved1 = [];
      let tried1 = [];
      let unsolved1 = [];
      await p1.forEach((p) => {
        if (p.title.startsWith(TITLE_AC)) solved1 = p.tags;
        else if (p.title.startsWith(TITLE_PAC)) tried1 = p.tags;
        else if (p.title.startsWith(TITLE_WA)) unsolved1 = p.tags;
      });
      fetchProblems(users[1], async (p2) => {
        let solved2 = [];
        let tried2 = [];
        let unsolved2 = [];
        await p2.forEach((p) => {
          if (p.title.startsWith(TITLE_AC)) solved2 = p.tags;
          else if (p.title.startsWith(TITLE_PAC)) tried2 = p.tags;
          else if (p.title.startsWith(TITLE_WA)) unsolved2 = p.tags;
        });

        const solvedBoth = solved1
          .filter((p) => solved2.includes(p))
          .map(createProblemLinkMapper);
        const solved1Only = solved1
          .filter((p) => !solved2.includes(p))
          .map(createProblemLinkMapper);
        const solved2Only = solved2
          .filter((p) => !solved1.includes(p))
          .map(createProblemLinkMapper);
        const tried1Only = tried1
          .filter((p) => !solved2.includes(p))
          .map(createProblemLinkMapper);
        const tried2Only = tried2
          .filter((p) => !solved1.includes(p))
          .map(createProblemLinkMapper);
        const solvedNobody = unsolved1
          .filter((p) => unsolved2.includes(p))
          .map(createProblemLinkMapper);

        const userHref1 = Utils.createElement('a', {
          href: '/user/' + users[0],
        });
        userHref1.innerText = users[0];
        const userHref2 = Utils.createElement('a', {
          href: '/user/' + users[1],
        });
        userHref2.innerText = users[1];
        const userTag1 = userHref1.outerHTML;
        const userTag2 = userHref2.outerHTML;

        // create panels
        const panels = [
          createPanel(
            userTag1 + '와 ' + userTag2 + ' 모두 푼 문제',
            solvedBoth
          ),
          createPanel(userTag1 + '만 푼 문제', solved1Only),
          createPanel(userTag2 + '만 푼 문제', solved2Only),
          createPanel(
            userTag1 + '만 맞았지만 만점을 받지 못한 문제',
            tried1Only
          ),
          createPanel(
            userTag2 + '만 맞았지만 만점을 받지 못한 문제',
            tried2Only
          ),
          createPanel('둘 다 시도했지만 맞지 못한 문제', solvedNobody),
        ];

        for (const panel of panels) {
          container.appendChild(panel);
        }

        // create checkboxes
        const checkboxes = document.createElement('div');
        const checkbox1 = document.createElement('input');
        checkbox1.setAttribute('type', 'checkbox');
        checkbox1.setAttribute('id', 'show-pid');
        checkbox1.addEventListener('change', (evt) => {
          Config.save('show-pid', evt.target.checked);
          display(panels, 'show-id', evt.target.checked);
        });
        const checkbox2 = document.createElement('input');
        checkbox2.setAttribute('type', 'checkbox');
        checkbox1.setAttribute('id', 'show-pname');
        checkbox2.addEventListener('change', (evt) => {
          Config.save('show-pname', evt.target.checked);
          display(panels, 'show-name', evt.target.checked);
        });

        const label1 = document.createElement('label');
        label1.setAttribute('for', 'show-pid');
        label1.innerText = '문제 번호';
        const label2 = document.createElement('label');
        label2.setAttribute('for', 'show-pname');
        label2.innerText = '문제 제목';

        checkboxes.setAttribute('class', 'problem-toggles');
        checkboxes.appendChild(checkbox1);
        checkboxes.appendChild(label1);
        checkboxes.appendChild(checkbox2);
        checkboxes.appendChild(label2);

        // add checkboxes whether problem's id or name
        container.insertBefore(checkboxes, vsform);

        // sync with configs
        Config.load('show-pid', (checked) => {
          checked = checked === null || checked === undefined ? true : checked;
          checkbox1.checked = checked;
          display(panels, 'show-id', checked);
        });
        Config.load('show-pname', (checked) => {
          checkbox2.checked = checked;
          display(panels, 'show-name', checked);
        });
      });
    });

    function createProblemLinkMapper(pid) {
      return createProblemLinkElement(tagByPid[pid], problemsLookup, pid);
    }

    // title: string, body: Node
    function createPanel(title, tags) {
      const panel = Utils.createElement('div', {
        class: 'panel panel-default',
      });
      const phead = Utils.createElement('div', { class: 'panel-heading' });
      const pbody = Utils.createElement('div', { class: 'panel-body' });
      phead.innerHTML = '<h3 class="panel-title">' + title + '</h3>';
      tags.forEach((t) => pbody.appendChild(t));
      panel.appendChild(phead);
      panel.appendChild(pbody);
      return panel;
    }

    function fetchProblems(username, response) {
      fetch('https://www.acmicpc.net/user/' + username)
        .catch((error) => {
          console.log(error);
          alert('존재하지 않거나 잘못된 아이디입니다.');
          window.history.back();
          return false;
        })
        .then((res) => res.text())
        .then((html) => new DOMParser().parseFromString(html, 'text/html'))
        .then((doc) => {
          const panels = doc.querySelectorAll('.panel');
          const problems = [];
          // first is heat chart
          for (let i = 1; i < panels.length; ++i) {
            const tags = [];
            const title = panels[i].querySelector('.panel-title').innerText;
            panels[i].querySelectorAll('a[href^="/problem/"]').forEach((a) => {
              const pid = parseInt(a.href.substr(a.href.lastIndexOf('/') + 1));
              tags.push(pid);
              tagByPid[pid] = a;
            });
            console.log(title);
            problems.push({
              title: title,
              tags: tags,
            });
          }
          return problems;
        })
        .then(response);
    }
  });

  function display(containers, key, visible) {
    containers.forEach((panel) => {
      if (visible) {
        panel.setAttribute(key, true);
      } else {
        panel.removeAttribute(key);
      }
    });
  }
}

function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){_defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function extendQuickSearch(){async function a(a){if(v=!!a,!0===a){const a=(await i())||{};C.value=a.text||"",0<=a.tabIndex&&b(a.tabIndex),w=await fetchProblemsByUser(getMyUsername()),z.style.display="flex",setTimeout(function(){C.focus()},10)}else z.style.display="none"}async function b(a){for(const b of y){const c=b.el.getAttribute(q)==a;c?b.el.classList.add("active"):b.el.classList.remove("active")}x.lock=!1,D.scroll(0,0),u=+a,await h({tabIndex:a}),c(C.value)}async function c(a,b){if(x.lock)return;if(x.lock=!0,b=b||0,0==b)D.innerHTML="",x.totalCount=0,D.scroll(0,0);else if(b>x.maxPage||b==x.curPage)return;await h({text:a});const c=y[u].c||"Problems",f=await d(a,c,b),{hits:g,processingTimeMS:i,nbHits:j,nbPages:k,page:l,message:m}=f;return m?void(x.lock=!0):void(x.totalCount+=g.length,x.maxPage=k,x.curPage=l,await e(D,c,f),F.href=encodeURI("/search#q="+a+"&c="+c),E.innerHTML=`${j}개의 결과 중 \
      ${x.totalCount}개 표시 (${i/1e3}초)`,x.lock=!1)}async function d(a,b,c){c=c||0,a=a||"";const d={requests:[{indexName:b,params:encodeURI(`query=${a}&page=${c}&facets=[]&tagFilters=`)}]},{results:e}=await fetch(Constants.QUICK_SEARCH_URL+"?"+Constants.QUICK_SEARCH_QUERY,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:JSON.stringify(d)}).then(function(a){return a.json()});return e[0]}function e(a,b,c){const{hits:d}=c;for(const e of d){const c=j(e,b);c&&a.appendChild(c)}}function f(a){return null==w?"":w[a]||""}function g(a){const b=a.clientHeight,c=a.scrollHeight-b,d=a.scrollTop;return d/c}async function h(a){const b=Constants.STORAGE_PREFIX+r,c=(await i())||{},d=_objectSpread(_objectSpread({},c),a);await localStorage.setItem(b,JSON.stringify(d))}async function i(){const a=Constants.STORAGE_PREFIX+r;return JSON.parse(await localStorage.getItem(a))||{}}function j(a,b){if(null==a)return null;return"Problems"===b?k(l(a)):"Workbooks"===b?k(m(a)):"Categories"===b?k(n(a)):"Blogs"===b?k(o(a)):"Articles"===b?k(p(a)):null}function k(a){const b=Utils.createElement("div",{class:"quick-search-item"});return b.innerHTML=a,b}function l(a){const{id:b,time:c,memory:d,_highlightResult:e}=a,{title:g,description:h}=e,i=f(b);return`\
      <div class="title">\
        <a href="/problem/${b}" class="${i}">\
          ${b}번 - ${g.value}\
        </a>\
      </div>\
      <div class="meta">시간 제한: ${c}초 &nbsp; 메모리 제한: ${d}MB</div>\
      <div class="desc">${h.value}</div>\
      <div class="links"> \
        <a href="/submit/${b}">제출</a> \
        <a href="/problem/status/${b}">맞은 사람</a> \
        <a href="/status?from_problem=1&amp;problem_id=${b}">채점 현황</a> \
      </div> \
    `}function m(a){const{id:b,problems:c,creator:d,_highlightResult:e}=a,{name:g,comment:h,creator:i,problem:j}=e,k=(j||[]).filter(function({problem_id:a,title:b}){return a.matchedWords.length||b.matchedWords.length}).map(function({problem_id:a,title:b}){const c=a.value.replace(/(<([^>]+)>)/gi,""),d=f(c);return`<span class="problem">\
          <a href="/problem/${c}" class="${d} problem-link-style-box">\
            ${a.value}번 ${b.value}\
          </a>\
        </span>`}).join("\n");return`\
      <div class="title"><a href="/workbook/view/${b}">${g.value}</a></div>\
      <div class="meta">\
        <span class="author">\
          만든 사람: <a href="/user/${d}">${i.value}</a>\
        </span>\
        <span class="count">문제: ${c}</span>\
      </div>\
      <div class="desc">${h.value}</div>\
      <div class="links">\
        ${k}
      </div>\
    `}function n(a){const{avail:b,id:c,parents:d,total:e,_highlightResult:f}=a,{name:g}=f,h=(d||[]).map(function(a){return`<li><a href="/category/${a.id}">${a.name}</a></li>`}).join("\n");return`\
      <ul class="list-inline up-ul search-breadcrumb">${h}</ul>
      <div class="title">\
        <a href="/category/detail/view/${c}">${g.value}</a>\
      </div>\
      <div class="meta">전체 문제: ${e} &nbsp; 풀 수 있는 문제: ${b}</div>\
    `}function o(a){const{id:b,user:c,comments:d,date:e,tags:f}=a,{title:g}=a._highlightResult,{content:h}=a._snippetResult,i=f.filter(function(a){return 0<a.length}).map(function(a){return`<span class="tag">#${a}</span>`}).join("\n");return`\
      <div class="title"><a href="/blog/view/${b}">${g.value}</a></div>\
      <div class="meta">\
        <span class="date">${e}</span>\
        <a class="author" href="/user/${c}">${c}</a>\
        <a href="/blog/view/${b}#comments">\
          <i class="fa fa-comments-o"></i> ${d}\
        </a>\
      </div>\
      <div class="desc">${h.value}</div>\
      <div class="links">${i}</div> \
    `}function p(a){const{id:b,problem:c,category:d,created:e,user:g,comments:h,like:i}=a,{subject:j}=a._highlightResult,{content:k}=a._snippetResult;let l="",m="";return null!=c&&(m=f(c),l=`<a href="/problem/${c}" class="${m}">\
        ${c}번\
      </a>&nbsp;`),`\
      <div class="meta ${m}">\
        ${l}<span>${d}</span>\
      </div>
      <div class="title"><a href="/board/view/${b}">${j.value}</a></div>\
      <div class="meta">\
        <span class="date">${e}</span>\
        <a class="author" href="/user/${g}">${g}</a>\
        <a href="/board/view/${b}#comments" class="comments">\
          <i class="fa fa-comments-o"></i> ${h}\
        </a>\
        <span><i class="fa fa-thumbs-o-up"></i> ${i}</span>\
      </div>\
      <div class="desc">${k.value}</div>\
    `}const q="tidx",r="qs-last-state";let s=null,t="",u=0,v=!1,w={};const x={totalCount:0,maxPage:0,curPage:0,lock:!1},y=[{title:"\uBB38\uC81C",c:"Problems",active:!0,el:null},{title:"\uBB38\uC81C\uC9D1",c:"Workbooks",el:null},{title:"\uCD9C\uCC98",c:"Categories",el:null},{title:"\uBE14\uB85C\uADF8",c:"Blogs",el:null},{title:"\uAC8C\uC2DC\uD310",c:"Articles",el:null}],z=Utils.createElement("div",{id:"quick-search",class:"overlay"}),A=Utils.createElement("div",{class:"container"}),B=Utils.createElement("div",{class:"form-group"}),C=Utils.createElement("input",{class:"form-control",placeholder:"\uAC80\uC0C9",autofucus:!0}),D=Utils.createElement("div",{class:"results"}),E=Utils.createElement("div",{class:"results-footer"});E.innerText="\uACB0\uACFC \uD45C\uC2DC (0.000\uCD08)";const F=Utils.createElement("a",{class:"btn btn-default more-button",href:"/search"});F.innerText="\uB354 \uB9CE\uC740 \uAC80\uC0C9 \uACB0\uACFC \uBCF4\uAE30",B.appendChild(C),B.appendChild(D);const G=Utils.createElement("div",{class:"tabs"});for(let a=0;a<y.length;++a){const c=y[a],d=Utils.createElement("div",{class:"tab",[q]:a,tabindex:-1});d.innerText=c.title,c.active&&d.classList.add("active"),d.addEventListener("click",function(a){a.preventDefault(),b(d.getAttribute(q))}),y[a].el=d,G.appendChild(d)}A.appendChild(G),A.appendChild(B),A.appendChild(E),A.appendChild(F),z.appendChild(A),document.body.appendChild(z);const H=document.createElement("li"),I=document.createElement("a");I.innerHTML="<i class=\"fa fa-search\"></i>",H.appendChild(I),I.addEventListener("click",function(b){b.preventDefault(),a(!0)}),addElementToBar(H),C.addEventListener("keyup",async function(a){a.preventDefault();const b=a.target.value,d=b.replace(/\s/g,"");t!==d&&(t=d,clearTimeout(s),s=setTimeout(function(){b&&(x.lock=!1),c(b)},100))});const J=new Set;document.addEventListener("keydown",function(a){J.add(a.key),v&&"Tab"===a.key&&(u=J.has("Shift")?(u-1+y.length)%y.length:(u+1)%y.length,b(u),a.preventDefault())}),document.addEventListener("keyup",function(b){J.has("Escape")?a(!1):J.has("/")&&(J.has("Control")||J.has("Alt"))&&a(!0),J.delete(b.key)}),document.addEventListener("click",function(b){b.target==z&&a(!1)}),window.addEventListener("blur",function(){J.clear()}),D.addEventListener("scroll",function(){const a=g(D);.99<=a&&c(C.value,x.curPage+1)})}async function extendSearchPage(){function a(a){a.querySelectorAll("a[href^=\"/problem/\"]").forEach(function(a){const b=getProblemID(a.href);b&&c[b]&&a.classList.add(c[b])})}const b=document.getElementById("result").getElementsByClassName("results")[0];if(!b)return void setTimeout(extendSearchPage,10000);const c=await fetchProblemsByUser(getMyUsername());if(!c)return;const d=new MutationObserver(function(b){0==b.length||a(b[0].target)});d.observe(b,{attributes:!0,childList:!0,characterData:!0}),a(b)}
"use strict";function extendQuickSearch(){async function a(a){!0===a?(v=await fetchProblemsByUser(getMyUsername()),k.style.display="flex",setTimeout(()=>{n.focus()},10)):k.style.display="none"}function b(a){for(const b of s){const c=b.el.getAttribute("tabIndex")==a;c?b.el.classList.add("active"):b.el.classList.remove("active")}w=+a,c(n.value)}async function c(a){o.scroll(0,0);const b=s[w].c||"Problems",c={requests:[{indexName:b,params:encodeURI("query="+a+"&page=0&facets=[]&tagFilters=")}]},{results:e}=await fetch(Constants.QUICK_SEARCH_URL+"?"+Constants.QUICK_SEARCH_QUERY,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:JSON.stringify(c)}).then(a=>a.json()),{hits:f,processingTimeMS:g,nbHits:h}=e[0];o.innerHTML="";for(const c of f){const a=d(c,b);a&&o.appendChild(a)}q.href=encodeURI("/search#q="+a+"&c="+b),p.innerHTML=`${h}개의 결과 중 ${f.length}개 표시 (${g/1e3}초)`}function d(a,b){if(null==a)return null;return"Problems"===b?e(f(a)):"Workbooks"===b?e(g(a)):"Categories"===b?e(h(a)):"Blogs"===b?e(i(a)):"Articles"===b?e(j(a)):null}function e(a){const b=Utils.createElement("div",{class:"quick-search-item"});return b.innerHTML=a,b}function f(a){const{id:b,time:c,memory:d,_highlightResult:e}=a,{title:f,description:g}=e;return`\
      <div class="title"><a href="/problem/${b}">${b}번 - ${f.value}</a></div>\
      <div class="meta">시간 제한: ${c}초 &nbsp; 메모리 제한: ${d}MB</div>\
      <div class="desc">${g.value}</div>\
      <div class="links"> \
        <a href="/submit/${b}">제출</a> \
        <a href="/problem/status/${b}">맞은 사람</a> \
        <a href="/status?from_problem=1&amp;problem_id=${b}">채점 현황</a> \
      </div> \
    `}function g(a){const{id:b,problems:c,_highlightResult:d}=a,{name:e,comment:f,creator:g,problem:h}=d;return`\
      <div class="title"><a href="/workbook/view/${b}">${e.value}</a></div>\
      <div class="meta">만든 사람: ${g.value} &nbsp; 문제: ${c}</div>\
      <div class="desc">${f.value}</div>\
    `}function h(a){const{avail:b,id:c,parents:d,total:e,_highlightResult:f}=a,{name:g}=f,h=(d||[]).map(a=>`<li><a href="/category/${a.id}">${a.name}</a></li>`).join("\n");return`\
      <ul class="list-inline up-ul search-breadcrumb">${h}</ul>
      <div class="title"><a href="/category/detail/view/${c}">${g.value}</a></div>\
      <div class="meta">전체 문제: ${e} &nbsp; 풀 수 있는 문제: ${b}</div>\
    `}function i(a){const{id:b,user:c,comments:d,date:e,tags:f}=a,{title:g}=a._highlightResult,{content:h}=a._snippetResult,i=f.filter(a=>0<a.length).map(a=>`<span class="tag">#${a}</span>`).join("\n");return`\
      <div class="title"><a href="/blog/view/${b}">${g.value}</a></div>\
      <div class="meta">\
        <span class="date">${e}</span>\
        <a class="author" href="/user/${c}">${c}</a>\
        <a href="/blog/view/${b}#comments"><i class="fa fa-comments-o"></i> ${d}</a>\
      </div>\
      <div class="desc">${h.value}</div>\
      <div class="links">${i}</div> \
    `}function j(a){const{id:b,problem:c,category:d,created:e,user:f,comments:g,like:h}=a,{subject:i}=a._highlightResult,{content:j}=a._snippetResult;let k="",l="";return null!=c&&(l=v[c]||"",k=`<a href="/problem/${c}" class="${l}">${c}번</a>&nbsp;`),`\
      <div class="meta ${l}">\
        ${k}<span>${d}</span>\
      </div>
      <div class="title"><a href="/board/view/${b}">${i.value}</a></div>\
      <div class="meta">\
        <span class="date">${e}</span>\
        <a class="author" href="/user/${f}">${f}</a>\
        <a href="/board/view/${b}#comments" class="comments"><i class="fa fa-comments-o"></i> ${g}</a>\
        <span><i class="fa fa-thumbs-o-up"></i> ${h}</span>\
      </div>\
      <div class="desc">${j.value}</div>\
    `}const k=Utils.createElement("div",{id:"quick-search",class:"overlay"}),l=Utils.createElement("div",{class:"container"}),m=Utils.createElement("div",{class:"form-group"}),n=Utils.createElement("input",{class:"form-control",placeholder:"\uAC80\uC0C9",autofucus:!0}),o=Utils.createElement("div",{class:"results"}),p=Utils.createElement("div",{class:"results-footer"});p.innerText="-";const q=Utils.createElement("a",{class:"btn btn-default more-button",href:"/search"});q.innerText="\uB354 \uB9CE\uC740 \uAC80\uC0C9 \uACB0\uACFC \uBCF4\uAE30",m.appendChild(n),m.appendChild(o);const r=Utils.createElement("div",{class:"tabs"}),s=[{title:"\uBB38\uC81C",c:"Problems",active:!0,el:null},{title:"\uBB38\uC81C\uC9D1",c:"Workbooks",el:null},{title:"\uCD9C\uCC98",c:"Categories",el:null},{title:"\uBE14\uB85C\uADF8",c:"Blogs",el:null},{title:"\uAC8C\uC2DC\uD310",c:"Articles",el:null}];for(let a=0;a<s.length;++a){const c=s[a],d=Utils.createElement("div",{class:"tab",tabIndex:a});d.innerText=c.title,c.active&&d.classList.add("active"),d.addEventListener("click",a=>{a.preventDefault(),b(d.getAttribute("tabIndex"))}),s[a].el=d,r.appendChild(d)}l.appendChild(r),l.appendChild(m),l.appendChild(p),l.appendChild(q),k.appendChild(l),document.body.appendChild(k);let t=null,u="",v={},w=0;n.addEventListener("keyup",async a=>{a.preventDefault();const b=a.target.value,d=b.replace(/\s/g,"");u!==d&&(u=d,clearTimeout(t),t=setTimeout(()=>{c(b)},100))});const x=new Set;document.addEventListener("keydown",a=>{x.add(a.key)}),document.addEventListener("keyup",b=>{x.has("Escape")?a(!1):x.has("/")&&(x.has("Control")||x.has("Alt"))&&a(!0),x.delete(b.key)}),document.addEventListener("click",b=>{b.target==k&&a(!1)})}async function extendSearchPage(){function a(a){a.querySelectorAll("a[href^=\"/problem/\"]").forEach(a=>{const b=a.href||"";if(b.match(/\/problem\/[0-9]+$/)){const d=c[getLastNumberFromHref(b)];d&&a.classList.add(d)}})}const b=document.getElementById("result").getElementsByClassName("results")[0];if(!b)return void setTimeout(extendSearchPage,10000);const c=await fetchProblemsByUser(getMyUsername());if(!c)return;const d=new MutationObserver(function(b){0==b.length||a(b[0].target)});d.observe(b,{attributes:!0,childList:!0,characterData:!0}),a(b)}
"use strict";function extendQuickSearch(){async function a(a){p=!!a,!0===a?(n=await fetchProblemsByUser(getMyUsername()),r.style.display="flex",setTimeout(()=>{u.focus()},10)):r.style.display="none"}function b(a){for(const b of q){const c=b.el.getAttribute(k)==a;c?b.el.classList.add("active"):b.el.classList.remove("active")}o=+a,c(u.value)}async function c(a){v.scroll(0,0);const b=q[o].c||"Problems",c={requests:[{indexName:b,params:encodeURI("query="+a+"&page=0&facets=[]&tagFilters=")}]},{results:e}=await fetch(Constants.QUICK_SEARCH_URL+"?"+Constants.QUICK_SEARCH_QUERY,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:JSON.stringify(c)}).then(a=>a.json()),{hits:f,processingTimeMS:g,nbHits:h}=e[0];v.innerHTML="";for(const c of f){const a=d(c,b);a&&v.appendChild(a)}x.href=encodeURI("/search#q="+a+"&c="+b),w.innerHTML=`${h}개의 결과 중 ${f.length}개 표시 (${g/1e3}초)`}function d(a,b){if(null==a)return null;return"Problems"===b?e(f(a)):"Workbooks"===b?e(g(a)):"Categories"===b?e(h(a)):"Blogs"===b?e(i(a)):"Articles"===b?e(j(a)):null}function e(a){const b=Utils.createElement("div",{class:"quick-search-item"});return b.innerHTML=a,b}function f(a){const{id:b,time:c,memory:d,_highlightResult:e}=a,{title:f,description:g}=e;return`\
      <div class="title"><a href="/problem/${b}">${b}번 - ${f.value}</a></div>\
      <div class="meta">시간 제한: ${c}초 &nbsp; 메모리 제한: ${d}MB</div>\
      <div class="desc">${g.value}</div>\
      <div class="links"> \
        <a href="/submit/${b}">제출</a> \
        <a href="/problem/status/${b}">맞은 사람</a> \
        <a href="/status?from_problem=1&amp;problem_id=${b}">채점 현황</a> \
      </div> \
    `}function g(a){const{id:b,problems:c,creator:d,_highlightResult:e}=a,{name:f,comment:g,creator:h,problem:i}=e,j=(i||[]).filter(({problem_id:a,title:b})=>a.matchedWords.length||b.matchedWords.length).map(({problem_id:a,title:b})=>{const c=a.value.replace(/(<([^>]+)>)/gi,""),d=n[c]||"";return`<span class="problem">\
          <a href="/problem/${c}" class="${d}">${a.value}번 ${b.value}</a>\
        </span>`}).join("\n");return`\
      <div class="title"><a href="/workbook/view/${b}">${f.value}</a></div>\
      <div class="meta">
        <span class="author">만든 사람: <a href="/user/${d}">${h.value}</a></span>\
        <span class="count">문제: ${c}</span>\
      </div>\
      <div class="desc">${g.value}</div>\
      <div class="links">\
        ${j}
      </div>\
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
    `}function j(a){const{id:b,problem:c,category:d,created:e,user:f,comments:g,like:h}=a,{subject:i}=a._highlightResult,{content:j}=a._snippetResult;let k="",l="";return null!=c&&(l=n[c]||"",k=`<a href="/problem/${c}" class="${l}">${c}번</a>&nbsp;`),`\
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
    `}const k="tidx";let l=null,m="",n={},o=0,p=!1;const q=[{title:"\uBB38\uC81C",c:"Problems",active:!0,el:null},{title:"\uBB38\uC81C\uC9D1",c:"Workbooks",el:null},{title:"\uCD9C\uCC98",c:"Categories",el:null},{title:"\uBE14\uB85C\uADF8",c:"Blogs",el:null},{title:"\uAC8C\uC2DC\uD310",c:"Articles",el:null}],r=Utils.createElement("div",{id:"quick-search",class:"overlay"}),s=Utils.createElement("div",{class:"container"}),t=Utils.createElement("div",{class:"form-group"}),u=Utils.createElement("input",{class:"form-control",placeholder:"\uAC80\uC0C9",autofucus:!0}),v=Utils.createElement("div",{class:"results"}),w=Utils.createElement("div",{class:"results-footer"});w.innerText="\uACB0\uACFC \uD45C\uC2DC (0.000\uCD08)";const x=Utils.createElement("a",{class:"btn btn-default more-button",href:"/search"});x.innerText="\uB354 \uB9CE\uC740 \uAC80\uC0C9 \uACB0\uACFC \uBCF4\uAE30",t.appendChild(u),t.appendChild(v);const y=Utils.createElement("div",{class:"tabs"});for(let a=0;a<q.length;++a){const c=q[a],d=Utils.createElement("div",{class:"tab",tidx:a,tabindex:-1});d.innerText=c.title,c.active&&d.classList.add("active"),d.addEventListener("click",a=>{a.preventDefault(),b(d.getAttribute(k))}),q[a].el=d,y.appendChild(d)}s.appendChild(y),s.appendChild(t),s.appendChild(w),s.appendChild(x),r.appendChild(s),document.body.appendChild(r);const z=document.createElement("li"),A=document.createElement("a");A.innerHTML="<i class=\"fa fa-search\"></i>",z.appendChild(A),A.addEventListener("click",b=>{b.preventDefault(),a(!0)}),addElementToBar(z),u.addEventListener("keyup",async a=>{a.preventDefault();const b=a.target.value,d=b.replace(/\s/g,"");m!==d&&(m=d,clearTimeout(l),l=setTimeout(()=>{c(b)},100))});const B=new Set;document.addEventListener("keydown",a=>{B.add(a.key),p&&"Tab"===a.key&&(o=B.has("Shift")?(o-1+q.length)%q.length:(o+1)%q.length,b(o),a.preventDefault())}),document.addEventListener("keyup",b=>{B.has("Escape")?a(!1):B.has("/")&&(B.has("Control")||B.has("Alt"))&&a(!0),B.delete(b.key)}),document.addEventListener("click",b=>{b.target==r&&a(!1)})}async function extendSearchPage(){function a(a){a.querySelectorAll("a[href^=\"/problem/\"]").forEach(a=>{const b=a.href||"";if(b.match(/\/problem\/[0-9]+$/)){const d=c[getLastNumberFromHref(b)];d&&a.classList.add(d)}})}const b=document.getElementById("result").getElementsByClassName("results")[0];if(!b)return void setTimeout(extendSearchPage,10000);const c=await fetchProblemsByUser(getMyUsername());if(!c)return;const d=new MutationObserver(function(b){0==b.length||a(b[0].target)});d.observe(b,{attributes:!0,childList:!0,characterData:!0}),a(b)}
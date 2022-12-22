function extendSettingPage() {
  const nav = document.getElementsByClassName('list-group sidebar-nav-v1')[1];
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item');
  li.innerHTML = '<a href="#">BOJ Extended</a>';
  li.addEventListener('click', (evt) => {
    evt.preventDefault();
    chrome.runtime.sendMessage({ action: 'openSettingPage' });
  });
  nav.insertBefore(li, nav.firstChild);
}

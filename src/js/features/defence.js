function extendRandomDefence() {
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
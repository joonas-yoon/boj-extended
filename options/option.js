(function(){
  Array.from(document.getElementsByClassName('btn-close-window')).forEach((e) => {
    e.addEventListener('click', (evt) => {
      evt.preventDefault();
      window.close('', '_parent', '');
    });
  });

  // theme
  const oTheme = document.getElementsByClassName('option-theme');
  for(let i=0; i<oTheme.length; ++i){
    oTheme[i].addEventListener('change', (evt) => {
      applyTheme(null, evt.target.value);
    });
  };

  Config.load('theme', (theme) => {
    oTheme[theme == 'light' ? 0 : 1].checked = true;
    applyTheme(null, theme);
  });
  
  const oWide = document.getElementsByClassName('option-wide');
  for(let i=0; i<oWide.length; ++i){
    oWide[i].addEventListener('change', (evt) => {
      applyWide(null, !!parseInt(evt.target.value));
    });
  };

  // wide
  Config.load('wide', (wide) => {
    oWide[wide ? 1 : 0].checked = true;
    applyWide(null, wide);
  });

  // status:pid
  const oStatusPid = document.getElementsByClassName('option-status-pid');
  for(let i=0; i<oStatusPid.length; ++i){
    oStatusPid[i].addEventListener('change', (evt) => {
      Config.save('show-status-pid', !!parseInt(evt.target.value));
    });
  };

  Config.load('show-status-pid', (showPid) => {
    oStatusPid[showPid ? 0 : 1].checked = true;
  });
})();
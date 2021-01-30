(function main() {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
    setTimeout(main, 100);
    return;
  }
  Array.from(document.getElementsByClassName('btn-close-window')).forEach(
    (e) => {
      e.addEventListener('click', (evt) => {
        evt.preventDefault();
        window.close('', '_parent', '');
      });
    }
  );

  // theme
  const oTheme = document.getElementsByClassName('option-theme');
  for (let i = 0; i < oTheme.length; ++i) {
    oTheme[i].addEventListener('change', (evt) => {
      applyTheme(null, evt.target.value);
    });
  }

  Config.load('theme', (theme) => {
    oTheme[theme == 'light' ? 0 : 1].checked = true;
    applyTheme(null, theme);
  });

  const oWide = document.getElementsByClassName('option-wide');
  for (let i = 0; i < oWide.length; ++i) {
    oWide[i].addEventListener('change', (evt) => {
      applyWide(null, !!parseInt(evt.target.value));
    });
  }

  // wide
  Config.load('wide', (wide) => {
    oWide[wide ? 1 : 0].checked = true;
    applyWide(null, wide);
  });

  // status:pid
  const oStatusPid = document.getElementsByClassName('option-status-pid');
  for (let i = 0; i < oStatusPid.length; ++i) {
    oStatusPid[i].addEventListener('change', (evt) => {
      Config.save('show-status-pid', !!parseInt(evt.target.value));
    });
  }

  Config.load('show-status-pid', (showPid) => {
    oStatusPid[showPid ? 0 : 1].checked = true;
  });

  // status:re-text
  const oReText = document.getElementsByClassName('msg-code');
  for (let i = 0; i < oReText.length; ++i) {
    Config.load(oReText[i].getAttribute('name') + '-code', (format) => {
      if (format) {
        oReText[i].value = format;
        document.getElementById(
          oReText[i].getAttribute('data-preview')
        ).innerHTML = reformat(format);
      }
    });

    oReText[i].addEventListener('input', (evt) => {
      const key = evt.target.getAttribute('name');
      const value = evt.target.value || evt.target.getAttribute('placeholder');
      const previewId = evt.target.getAttribute('data-preview');
      const formatted = reformat(value);
      document.getElementById(previewId).innerHTML = formatted;
      Config.save(key, formatted);
      Config.save(key + '-code', value);
    });
  }

  function reformat(text) {
    let rs = RegExp(/<([a-z]+)>/),
      re = RegExp(/<\/[a-z]+>/g);
    while (rs.test(text)) text = text.replace(rs, '<span class="result-$1">');
    text = text.replace(re, '</span>');
    return text;
  }
})();

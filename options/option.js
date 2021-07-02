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
      Config.save('theme', evt.target.value, (result) => {
        applyTheme(null, result);
      });
    });
  }

  Config.load('theme', (theme) => {
    oTheme[theme == 'light' ? 0 : 1].checked = true;
    applyTheme(null, theme);
  });

  const oWide = document.getElementsByClassName('option-wide');
  for (let i = 0; i < oWide.length; ++i) {
    oWide[i].addEventListener('change', (evt) => {
      Config.save('wide', !!parseInt(evt.target.value), (result) => {
        applyWide(null, result);
      });
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
        ).innerHTML = reformatPreview(format);
      }
    });

    oReText[i].addEventListener('input', (evt) => {
      const key = evt.target.getAttribute('name');
      const value = evt.target.value;
      const formatPreview = reformatPreview(
        value || evt.target.getAttribute('placeholder')
      );
      const previewId = evt.target.getAttribute('data-preview');
      document.getElementById(previewId).innerHTML = formatPreview;
      Config.save(key, reformat(value));
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

  function reformatPreview(text) {
    return reformat(text).replaceAll(':number:', '00');
  }
})();

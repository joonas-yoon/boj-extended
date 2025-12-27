(function main() {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
    setTimeout(main, 100);
    return;
  }

  // close button
  Array.from(document.getElementsByClassName('btn-close-window')).forEach(
    (e) => {
      e.addEventListener('click', (evt) => {
        evt.preventDefault();
        window.close('', '_parent', '');
      });
    }
  );

  // theme (image-filter)
  const oImageFilter = document.getElementsByClassName(
    'option-image-filter'
  )[0];
  oImageFilter.addEventListener('change', (evt) => {
    const enable = Utils.defaultAsTrue(evt.target.checked);
    applyImageFilter(enable);
    saveImageFilter(enable, (result) => {
      console.log('image-filter saved', result);
    });
  });
  const enableCheckboxImageFilter = (enable) =>
    (oImageFilter.disabled = !enable);

  Config.load(Constants.CONFIG_THEME_IMAGE_FILTER, (value) => {
    const enable = Utils.defaultAsTrue(value);
    oImageFilter.checked = enable;
    applyImageFilter(enable);
  });

  // theme
  const oTheme = document.getElementsByClassName('option-theme');
  for (let i = 0; i < oTheme.length; ++i) {
    oTheme[i].addEventListener('change', (evt) => {
      Config.save(Constants.CONFIG_THEME, evt.target.value, (result) => {
        const themeApplied = applyTheme(null, result);
        enableCheckboxImageFilter(themeApplied !== 'light');
      });
    });
  }

  const onLoadTheme = (theme) => {
    for (let i = 0; i < oTheme.length; ++i) {
      oTheme[i].checked = oTheme[i].value == theme;
    }
    const themeApplied = applyTheme(null, theme);
    enableCheckboxImageFilter(themeApplied !== 'light');
  };

  // wide
  const oWide = document.getElementsByClassName('option-wide');
  for (let i = 0; i < oWide.length; ++i) {
    oWide[i].addEventListener('change', (evt) => {
      Config.save('wide', !!parseInt(evt.target.value), (result) => {
        applyWide(null, result);
      });
    });
  }

  // wide
  const onLoadWide = (wide) => {
    oWide[wide ? 1 : 0].checked = true;
    applyWide(null, wide);
  };

  // status:pid
  // status:ptitle
  const oStatusPid = document.getElementById('option-status-pid');
  const oStatusTitle = document.getElementById('option-status-ptitle');
  oStatusPid.addEventListener('change', (evt) => {
    Config.save(Constants.CONFIG_SHOW_STATUS_PID, Boolean(evt.target.checked));
  });
  oStatusTitle.addEventListener('change', (evt) => {
    Config.save(
      Constants.CONFIG_SHOW_STATUS_PTITLE,
      Boolean(evt.target.checked)
    );
  });
  const onLoadShowStatusPid = (isChecked) => {
    oStatusPid.checked = Utils.defaultAsTrue(isChecked);
  };
  const onLoadShowStatusPtitle = (isChecked) => {
    oStatusTitle.checked = Boolean(isChecked);
  };

  // status:history
  const oStatusHistory = document.getElementsByClassName(
    'option-status-history'
  );
  for (let i = 0; i < oStatusHistory.length; ++i) {
    oStatusHistory[i].addEventListener('change', (evt) => {
      Config.save(
        Constants.CONFIG_SHOW_STATUS_HISTORY,
        !!parseInt(evt.target.value)
      );
    });
  }

  const onLoadShowStatusHistory = (showHistory) => {
    oStatusHistory[Utils.defaultAsTrue(showHistory) ? 0 : 1].checked = true;
  };

  // group:link
  const oGroupLink = document.getElementsByClassName('option-group-link');
  for (let i = 0; i < oGroupLink.length; ++i) {
    oGroupLink[i].addEventListener('change', (evt) => {
      Config.save(
        Constants.CONFIG_SHOW_GROUP_LINK,
        !!parseInt(evt.target.value)
      );
    });
  }

  const onLoadShowGroupLink = (showGroupLink) => {
    oGroupLink[showGroupLink ? 0 : 1].checked = true;
  };

  // global:user-tier
  const oUserTier = document.getElementsByClassName('option-user-tier');
  for (let i = 0; i < oUserTier.length; ++i) {
    oUserTier[i].addEventListener('change', (evt) => {
      Config.save(
        Constants.CONFIG_SHOW_USER_TIER,
        !!parseInt(evt.target.value)
      );
    });
  }

  const onLoadShowUserTier = (showUserTier) => {
    console.log(
      '[load] option-user-tier',
      Constants.CONFIG_SHOW_USER_TIER,
      showUserTier
    );
    oUserTier[Utils.defaultAsTrue(showUserTier) ? 0 : 1].checked = true;
  };

  // user:problem-tier
  const oProblemTier = document.getElementById('option-problem-tier');
  const oProblemTierColor = document.getElementById(
    'option-problem-tier-color'
  );
  oProblemTier.addEventListener('change', (evt) => {
    console.log(evt.target.checked);
    Config.save(
      Constants.CONFIG_SHOW_PROBLEM_TIER,
      Boolean(oProblemTier.checked)
    );
  });
  oProblemTierColor.addEventListener('change', (evt) => {
    console.log(evt.target.checked);
    Config.save(
      Constants.CONFIG_SHOW_PROBLEM_TIER_COLOR,
      Boolean(oProblemTierColor.checked)
    );
  });

  const onLoadShowProblemTier = (show) => {
    oProblemTier.checked = !Utils.defaultAsTrue(show);
  };
  const onLoadShowProblemTierColor = (show) => {
    oProblemTierColor.checked = show;
  };

  // status:fake-text
  const oFakeText = document.getElementsByClassName('msg-code');
  const bindLoadFakeTextEvent = (textInput) => (format) => {
    if (format) {
      textInput.value = format;
      document.getElementById(
        textInput.getAttribute('data-preview')
      ).innerHTML = reformat(format);
    }
  };
  for (let i = 0; i < oFakeText.length; ++i) {
    Config.load(
      oFakeText[i].getAttribute('name') + '-code',
      bindLoadFakeTextEvent(oFakeText[i])
    );

    oFakeText[i].addEventListener('input', onReformatChanged);
    oFakeText[i].addEventListener('keyup', onReformatChanged);
  }

  // input table for fake text
  const tableFakeResult = document.getElementById('fake-result-table');

  // active button
  const oFakeTextActives = document.getElementsByClassName(
    'option-status-result'
  );

  const applyFakeResultTableState = (enabled) => {
    if (enabled) {
      tableFakeResult.removeAttribute('disabled');
    } else {
      tableFakeResult.setAttribute('disabled', '');
    }
  };

  const onLoadShowFakeResult = (showFakeResult) => {
    console.log('CONFIG_SHOW_FAKE_RESULT', showFakeResult);
    const enabled = Utils.defaultAsTrue(showFakeResult);
    oFakeTextActives[enabled ? 0 : 1].checked = true;
    applyFakeResultTableState(enabled);
  };

  const onSelectFakeResultEnabled = (enabled) => {
    Config.save(Constants.CONFIG_SHOW_FAKE_RESULT, enabled);
    applyFakeResultTableState(enabled);
  };

  for (let i = 0; i < oFakeTextActives.length; ++i) {
    oFakeTextActives[i].addEventListener('change', (evt) =>
      onSelectFakeResultEnabled(!!parseInt(evt.target.value))
    );
  }

  // help:reformat
  {
    const inputReformat = document.getElementById('reformat-practice');
    onReformatChanged({ target: inputReformat });
    const table = document.getElementById('reformat-tag-table');
    const tbody = table.querySelector('tbody');
    const tags = [
      'ac',
      'green',
      'acc',
      'accept',
      'wa',
      'red',
      'wrong',
      'fail',
      'pac',
      'yellow',
      'partial',
      'ce',
      'blue',
      'rte',
      're',
      'purple',
      'runtime',
      'ple',
      'tle',
      'ole',
      'time',
      'wait',
      'gray',
      'grey',
      'compile',
      'judging',
      'del',
      // default tags
      'b',
      'strong',
      'i',
      'u',
      'strike',
    ];
    for (const tag of tags) {
      const row = document.createElement('tr');
      const text = '적용된 결과 미리보기';
      const val = reformat(`<${tag}>${text}</${tag}>`);
      row.innerHTML = `<td><code>&lt;${tag}&gt;</td><td class="result-fake-text">${val}</td>`;
      tbody.appendChild(row);
    }
  }

  function reformat(text) {
    const rs = RegExp(/<([a-z]+)>/);
    const re = RegExp(/<\/[a-z]+>/g);
    while (rs.test(text)) text = text.replace(rs, '<span class="result-$1">');
    text = text.replace(re, '</span>');
    return text;
  }

  function onReformatChanged(evt) {
    const key = evt.target.getAttribute('name');
    const value = evt.target.value;
    const formatPreview = reformat(
      value || evt.target.getAttribute('placeholder')
    );
    const previewId = evt.target.getAttribute('data-preview');
    document.getElementById(previewId).innerHTML = formatPreview;
    Config.save(key, reformat(value));
    Config.save(key + '-code', value);
  }

  // global:font
  const oExternalFontEnable = document.getElementById(
    'option-global-font-enable'
  );
  const oExternalFontDisable = document.getElementById(
    'option-global-font-disable'
  );
  const oFontForms = document.getElementById('global-font-setting');
  const oFontFormURL = document.getElementById('font-url');
  const oFontFormFamily = document.getElementById('font-family');
  const exampleStyleTag = document.createElement('style');
  oExternalFontEnable.addEventListener('change', () => {
    enableFontStyleSetting(true);
  });
  oExternalFontDisable.addEventListener('change', () => {
    enableFontStyleSetting(false);
  });
  oFontFormURL.addEventListener('keyup', () => {
    updateAndSaveFontStyle(createFontRules(true));
  });
  oFontFormFamily.addEventListener('keyup', () => {
    updateAndSaveFontStyle(createFontRules(true));
  });

  function enableFontStyleSetting(enabled) {
    if (enabled) {
      oExternalFontEnable.checked = true;
      oFontForms.style.display = 'block';
      if (!document.head.contains(exampleStyleTag)) {
        document.head.appendChild(exampleStyleTag);
      }
    } else {
      oExternalFontDisable.checked = true;
      oFontForms.style.display = 'none';
      if (document.head.contains(exampleStyleTag)) {
        document.head.removeChild(exampleStyleTag);
      }
    }
    updateAndSaveFontStyle(createFontRules(enabled));
  }

  function createFontRules(enabled) {
    const url = oFontFormURL.value || '';
    const family = oFontFormFamily.value || '';
    return {
      enabled,
      url,
      family,
    };
  }

  function updateAndSaveFontStyle(rules) {
    const tag = createFontStyleElement(rules);
    exampleStyleTag.innerText = tag.innerText;
    Config.save(Constants.CONFIG_FONT_STYLE, JSON.stringify(rules));
  }

  const onLoadFontStyle = (rulesStr) => {
    const rules = JSON.parse(rulesStr || '{}');
    console.log('font rules', rules);
    oFontFormURL.value = rules['url'] || '';
    oFontFormFamily.value = rules['family'] || '';
    enableFontStyleSetting(rules['enabled'] || false);
  };

  // load config from local storage
  const ConfigLoaders = {
    [Constants.CONFIG_FONT_STYLE]: onLoadFontStyle,
    [Constants.CONFIG_SHOW_FAKE_RESULT]: onLoadShowFakeResult,
    [Constants.CONFIG_SHOW_GROUP_LINK]: onLoadShowGroupLink,
    [Constants.CONFIG_SHOW_PROBLEM_TIER_COLOR]: onLoadShowProblemTierColor,
    [Constants.CONFIG_SHOW_PROBLEM_TIER]: onLoadShowProblemTier,
    [Constants.CONFIG_SHOW_STATUS_HISTORY]: onLoadShowStatusHistory,
    [Constants.CONFIG_SHOW_STATUS_PID]: onLoadShowStatusPid,
    [Constants.CONFIG_SHOW_STATUS_PTITLE]: onLoadShowStatusPtitle,
    [Constants.CONFIG_SHOW_USER_TIER]: onLoadShowUserTier,
    [Constants.CONFIG_THEME]: onLoadTheme,
    [Constants.CONFIG_WIDE]: onLoadWide,
  };

  // load all configs when page loaded
  Object.keys(ConfigLoaders).forEach((key) => {
    Config.load(key, ConfigLoaders[key]);
  });

  const FIELDS_EXCLUDES = ['CONFIG_PREFIX', 'CONFIG_LOCATION_HISTORY'];
  const FIELDS_PUBLIC = Object.keys(Constants).filter((key) => {
    return key.startsWith('CONFIG_') && FIELDS_EXCLUDES.indexOf(key) === -1;
  });
  const FIELDS_FAKES = 'FAKE_RESULTS';

  // export settings
  const buttonExport = document.getElementById('btnExport');
  buttonExport.addEventListener('click', (evt) => {
    evt.preventDefault();
    console.log('export settings');

    const exportAndDownloadFile = (exportData, filename) => {
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // gather settings
    Promise.all(FIELDS_PUBLIC.map((key) => Config.loadAsync(Constants[key])))
      .then((values) => {
        let isValid = Boolean(values);
        isValid &= FIELDS_PUBLIC.length === values.length;
        if (!isValid) {
          console.error('export.keys', FIELDS_PUBLIC);
          console.error('export.values', values);
          throw new Error('Failed to load all config values to export');
        }
        return Array.from({ length: FIELDS_PUBLIC.length })
          .map((_, i) => ({
            key: FIELDS_PUBLIC[i].replace(/^CONFIG_/, ''),
            value: values[i],
          }))
          .filter((item) => item.key !== null && item.value !== null)
          .reduce(
            (acc, cur) => ({
              ...acc,
              [cur.key]: cur.value,
            }),
            {}
          );
      })
      .then((exportData) => {
        // append fake result settings
        const fakeTextElements = Array.from(oFakeText);
        const fakeResults = fakeTextElements
          .filter((element) => {
            const type = element.getAttribute('name') || '';
            return type.startsWith('result-') && element.value;
          })
          .map((element) => ({
            type: element.getAttribute('name'),
            value: element.value,
          }))
          .reduce((acc, cur) => ({ ...acc, [cur.type]: cur.value }), {});
        return fakeResults.length === 0
          ? exportData
          : {
              ...exportData,
              [FIELDS_FAKES]: fakeResults,
            };
      })
      .then((keyValueZipObject) => JSON.stringify(keyValueZipObject, null, 2))
      .then((exportData) => {
        exportAndDownloadFile(exportData, 'boj-extended-settings.json');
      })
      .catch((err) => {
        console.error('export failed', err);
        window.alert('내보내기에 실패했습니다.');
      });
  });

  // import settings
  const buttonImport = document.getElementById('btnImport');
  buttonImport.addEventListener('click', (evt) => {
    evt.preventDefault();
    console.log('import settings');
    const fileForm = document.createElement('input');
    fileForm.setAttribute('type', 'file');
    fileForm.setAttribute('accept', '.json');
    fileForm.setAttribute('directory', false);

    const importJSON = (settings) => {
      console.log('settings', settings);
      const saveTasks = Object.keys(settings)
        .filter((key) => FIELDS_PUBLIC.indexOf('CONFIG_' + key) !== -1)
        .map((key) => {
          const configKey = Constants['CONFIG_' + key];
          const configValue = settings[key];
          console.log('import:', configKey, configValue);
          const response = Config.saveAsync(configKey, configValue);
          if (ConfigLoaders[configKey]) {
            ConfigLoaders[configKey](configValue);
          }
          return response;
        });

      const applyFakeResults = (fakeResults) => {
        Object.keys(fakeResults).forEach((key) => {
          const target = document.querySelector(`[name="${key}"]`);
          if (target) {
            const value = fakeResults[key];
            target.value = value;
            onReformatChanged({ target });
          }
        });
      };

      Promise.all(saveTasks).then(() => {
        // apply fake results
        try {
          const fakeResults = settings[FIELDS_FAKES];
          if (fakeResults) {
            applyFakeResults(fakeResults);
          }
        } catch (e) {
          console.error('Importing fake results failed', e);
        }
        console.log('Import completed.');
      });
    };

    fileForm.addEventListener('change', (evt) => {
      const file = evt.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          importJSON(JSON.parse(content));
        } catch (e) {
          console.error('Invalid JSON format', e);
          window.alert('잘못된 파일 형식입니다.');
        }
      };
      reader.readAsText(file);
    });
    fileForm.click();
    return false;
  });
})();

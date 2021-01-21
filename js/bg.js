function request(url, callback) {
  const httpRequest = new XMLHttpRequest();

  if(!httpRequest) {
    console.error('Can not create XMLHTTP instance.');
    return false;
  }
  httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
      try {
          callback(JSON.parse(httpRequest.responseText), null);
        } catch(err) {
          console.error(err.message + " in " + httpRequest.responseText);
          callback(null, err.message);
      }
    }
  };
  httpRequest.open('GET', url);
  httpRequest.send();
}

function postupdate() {
  request('https://raw.githubusercontent.com/joonas-yoon/actions-test/main/db.json', function(data){
    document.querySelectorAll('.panel-body a[href]').forEach((e, i) => {
      if (e.getAttribute('loaded')) return;
      const pid = e.innerText;
      const pname = data.problems[pid];
      e.innerHTML = '<span class="pid">'+pid+'</span> <span class="pname">'+pname+'</span>';
    });
  });
}

(function () {
  const path = chrome.extension.getURL('css/style.css');
  const css = document.createElement('link');
  css.setAttribute('rel', 'stylesheet');
  css.setAttribute('type', 'text/css');
  css.setAttribute('href', path);
  document.getElementsByTagName('head')[0].appendChild(css);

  const pnames = PROVISIONED_DB['problems'];
  const panels = document.querySelectorAll('.panel-body');
  panels.forEach((panel) => {
    const div = document.createElement('div');
    const labels = panel.querySelectorAll('a[href]');
    labels.forEach((e, i) => {
      const pid = e.innerText;
      const pname = pnames[pid] || '*New Problem';
      const newA = e.cloneNode();
      newA.innerHTML = '<span class="pid">'+pid+'</span> <span class="pname">'+pname+'</span>';
      div.appendChild(newA);
      if (i + 1 == labels.length) {
        setTimeout(() => {
          panel.innerHTML = '';
          panel.appendChild(div);
        }, 1000);
      }
    });
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

  let checkboxes = document.createElement('div');
  let checkbox1 = document.createElement('input');
  checkbox1.setAttribute('type', 'checkbox');
  checkbox1.setAttribute('id', 'show-pid');
  checkbox1.addEventListener('change', (evt) => {
    Config.save('show-pid', evt.target.checked);
    display(panels, 'show-id', evt.target.checked);
  });
  let checkbox2 = document.createElement('input');
  checkbox2.setAttribute('type', 'checkbox');
  checkbox1.setAttribute('id', 'show-pname');
  checkbox2.addEventListener('change', (evt) => {
    Config.save('show-pname', evt.target.checked);
    display(panels, 'show-name', evt.target.checked);
  });
  
  let label1 = document.createElement('label');
  label1.setAttribute('for', 'show-pid');
  label1.innerText = '문제 번호';
  let label2 = document.createElement('label');
  label2.setAttribute('for', 'show-pname');
  label2.innerText = '문제 제목';

  checkboxes.setAttribute('class', 'problem-toggles');
  checkboxes.appendChild(checkbox1);
  checkboxes.appendChild(label1);
  checkboxes.appendChild(checkbox2);
  checkboxes.appendChild(label2);

  let wrapper = document.querySelector('.col-md-9');
  wrapper.insertBefore(checkboxes, wrapper.firstChild);

  // sync with configs
  Config.load('show-pid', (checked) => {
    checked = checked === null ? true : checked;
    checkbox1.checked = checked;
    display(panels, 'show-id', checked);
  });
  Config.load('show-pname', (checked) => {
    checkbox2.checked = checked;
    display(panels, 'show-name', checked);
  });
})();
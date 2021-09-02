function openSettingPage() {
  chrome.runtime.openOptionsPage();
}

class _Config {
  constructor() {
    this.storage =
      typeof browser !== 'undefined'
        ? browser.storage.sync
        : chrome.storage.sync;
    this.storageName = 'config';
    this.buffer = {};
    const self = this;
    this.storage.get(this.storageName, (items) => {
      if (items[self.storageName]) {
        self.buffer = items[self.storageName];
      }
    });
  }

  // can be bufferred
  save(key, value, callback) {
    this.buffer[key] = value;
    const obj = {};
    obj[this.storageName] = this.buffer;
    this.storage.set(obj, () => {
      if (typeof callback === 'function') callback(value);
    });
  }

  load(key, callback) {
    // find in buffer first (but not synchronized yet)
    if (this.buffer[key] !== undefined) {
      if (typeof callback === 'function') callback(this.buffer[key]);
    } else {
      const storageName = this.storageName;
      this.storage.get(storageName, (items) => {
        if (typeof callback !== 'function') return;
        if (!items || !items[storageName]) {
          callback(null);
        } else {
          callback(items[storageName][key]);
        }
      });
    }
  }

  // callback(true/false := deleted as well)
  remove(key, callback) {
    if (this.buffer[key] !== undefined) {
      delete this.buffer[key];
      const obj = {};
      obj[this.storageName] = this.buffer;
      this.storage.set(obj, () => {
        if (typeof callback === 'function') callback(true);
      });
    } else {
      if (typeof callback === 'function') callback(false);
    }
  }
}

const Config = new _Config(); // as singleton

const Problems = {
  data: {},

  fetchFromRemote: function () {
    const self = this;
    const url =
      'https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/db.json';
    const httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      console.error('Can not create XMLHTTP instance.');
      return false;
    }
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        try {
          const newDB = JSON.parse(httpRequest.responseText);
          if (!newDB) {
            console.error('Can not fetch data from remote');
            return;
          }
          const oldDB = JSON.parse(
            localStorage.getItem('boj-extended-DB_PROBLEMS')
          );
          if (
            !oldDB ||
            !oldDB['last_updated'] ||
            newDB['last_updated'] != oldDB['last_updated']
          ) {
            localStorage.setItem(
              'boj-extended-DB_PROBLEMS',
              JSON.stringify(newDB)
            );
            self.data = newDB;
          } else {
            self.data = oldDB;
          }
        } catch (err) {
          console.error(err.message + ' in ' + httpRequest.responseText);
        }
      }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
  },

  get: function (callback) {
    callback(this.data['problems']);
  },
};

Problems.fetchFromRemote();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.action) {
    case 'openSettingPage':
      openSettingPage();
      break;
    case 'config.save':
      Config.save(message.data.key, message.data.value, sendResponse);
      break;
    case 'config.load':
      Config.load(message.data.key, sendResponse);
      break;
    case 'config.load.problems':
      Problems.get(sendResponse);
      break;
    case 'config.remove':
      Config.remove(message.data.key, sendResponse);
      break;
    default:
      break;
  }
  return true;
});

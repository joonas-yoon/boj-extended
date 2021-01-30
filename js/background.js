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
      callback(value);
    });
  }

  load(key, callback) {
    // find in buffer first (but not synchronized yet)
    if (this.buffer[key] !== undefined) {
      callback(this.buffer[key]);
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
        callback(true);
      });
    } else {
      callback(false);
    }
  }
}

const Config = new _Config(); // as singleton

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
    case 'config.remove':
      Config.remove(message.data.key, sendResponse);
      break;
    default:
      break;
  }
  return true;
});

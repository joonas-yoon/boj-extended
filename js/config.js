'use strict';

class ConfigClass {
  constructor() {
    this.storage = 'config';
    this.buffer = { enable: false, lang: undefined }; // lang as i18n code like 'ko'
    const self = this;
    chrome.storage.sync.get(this.storage, (items) => {
      if (items[self.storage]) {
        self.buffer = items[self.storage];
      }
    });
  }

  // can be bufferred
  save(key, value, callback) {
    this.buffer[key] = value;
    const obj = {};
    obj[this.storage] = this.buffer;
    chrome.storage.sync.set(obj, () => {
      if (typeof callback === 'function') callback(value);
    });
  }

  load(key, callback) {
    const storage = this.storage;
    // find in buffer first (but not synchronized yet)
    if (this.buffer[key] !== undefined) {
      callback(this.buffer[key]);
    } else {
      chrome.storage.sync.get(storage, (items) => {
        if (typeof callback !== 'function') return;
        if (!items || !items[storage]) {
          callback(null);
        } else {
          callback(items[storage][key]);
        }
      });
    }
  }
}

const Config = new ConfigClass();

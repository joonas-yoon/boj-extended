'use strict';

class ConfigClass {
  constructor() {
    this.storage = 'ytcf-config';
    this.a = { enable: false, lang: undefined }; // lang as i18n code like 'ko'
    const self = this;
    chrome.storage.sync.get(this.storage, (items) => {
      if (items[self.storage]) {
        self.a = items[self.storage];
      }
    });
  }

  // can be bufferred
  save(key, value, callback) {
    this.a[key] = value;
    const obj = {};
    obj[this.storage] = this.a;
    chrome.storage.sync.set(obj, () => {
      callback(value);
    });
  }

  load(key, callback) {
    const storage = this.storage;
    chrome.storage.sync.get(storage, (items) => {
      if (!items || !items[storage]) {
        callback(null);
      } else {
        callback(items[storage][key]);
      }
    });
  }
}

const Config = new ConfigClass();

'use strict';

class ConfigClass {
  constructor() {
    this.storage =
      typeof browser !== 'undefined'
        ? browser.storage.sync
        : chrome.storage.sync;
    this.storageName = 'config';
    this.buffer = { enable: false, lang: undefined }; // lang as i18n code like 'ko'
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
        if (typeof callback === 'function') callback(true);
      });
    } else {
      if (typeof callback === 'function') callback(false);
    }
  }
}

const Config = new ConfigClass();

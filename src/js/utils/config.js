class ConfigModel {
  constructor() {
    this.storageKeyPrefix = Constants.CONFIG_PREFIX;
    console.log(this);
  }

  getKey(key) {
    return this.storageKeyPrefix + key;
  }

  // can be bufferred
  save(key, value, callback) {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message);
      setTimeout(this.save.bind(null, key, value, callback), 100);
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'config.save',
        data: {
          key: key,
          value: value,
        },
      },
      callback
    );
    // Duplicate for HA (High Availability)
    window.localStorage.setItem(this.getKey(key), value);
  }

  async saveAsync(key, value) {
    return new Promise((resolve) => {
      this.save(key, value, (result) => {
        resolve(result);
      });
    });
  }

  load(key, callback) {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message);
      setTimeout(this.load.bind(null, key, callback), 100);
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'config.load',
        data: {
          key: key,
        },
      },
      (value) => {
        callback(value);
        window.localStorage.setItem(this.getKey(key), value);
      }
    );
  }

  async loadAsync(key) {
    return new Promise((resolve) => {
      this.load(key, (value) => {
        resolve(value);
      });
    });
  }

  remove(key, callback) {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message);
      setTimeout(this.remove.bind(null, key, callback), 100);
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'config.remove',
        data: {
          key: key,
        },
      },
      callback
    );
    window.localStorage.removeItem(this.getKey(key));
  }

  getProblems(callback) {
    chrome.runtime.sendMessage(
      {
        action: 'config.load.problems',
      },
      callback
    );
  }
}

// global variable
const Config = new ConfigModel();

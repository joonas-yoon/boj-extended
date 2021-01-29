class ConfigClass {
  // can be bufferred
  save(key, value, callback) {
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
  }

  load(key, callback) {
    chrome.runtime.sendMessage(
      {
        action: 'config.load',
        data: {
          key: key,
        },
      },
      callback
    );
  }

  remove(key, callback) {
    chrome.runtime.sendMessage(
      {
        action: 'config.remove',
        data: {
          key: key,
        },
      },
      callback
    );
  }
}

const Config = new ConfigClass();

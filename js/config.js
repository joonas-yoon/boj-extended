const Config = {
  // can be bufferred
  save: function (key, value, callback) {
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
  },

  load: function (key, callback) {
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
      callback
    );
  },

  remove: function (key, callback) {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message);
      setTimeout(this.save.remove(null, key, callback), 100);
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
  },
};

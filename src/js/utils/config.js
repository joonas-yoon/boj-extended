/**
 * ConfigModel class for managing configuration storage and retrieval.
 * Handles both chrome runtime messaging and localStorage as fallback (High Availability).
 */
class ConfigModel {
  /**
   * Creates a ConfigModel instance.
   * Initializes the storage key prefix from Constants.
   */
  constructor() {
    this.storageKeyPrefix = Constants.CONFIG_PREFIX;
    console.log(this);
  }

  /**
   * Generates a prefixed storage key.
   * @param {string} key - The key to prefix
   * @return {string} The prefixed key
   */
  getKey(key) {
    return this.storageKeyPrefix + key;
  }

  /**
   * Saves a configuration value with retry logic on error
   * and this can be buffered in localStorage for High Availability.
   * @param {string} key - The configuration key
   * @param {*} value - The value to save
   * @param {Function} callback - Callback function invoked after save completes
   */
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

  /**
   * Asynchronously saves a configuration value.
   * @param {string} key - The configuration key
   * @param {*} value - The value to save
   * @return {Promise<*>} Promise that resolves with the save result
   */
  async saveAsync(key, value) {
    return new Promise((resolve) => {
      this.save(key, value, (result) => {
        resolve(result);
      });
    });
  }

  /**
   * Loads a configuration value with retry logic on error.
   * @param {string} key - The configuration key to load
   * @param {Function} callback - Callback function invoked with the loaded value
   */
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

  /**
   * Asynchronously loads a configuration value.
   * @param {string} key - The configuration key to load
   * @return {Promise<*>} Promise that resolves with the loaded value
   */
  async loadAsync(key) {
    return new Promise((resolve) => {
      this.load(key, (value) => {
        resolve(value);
      });
    });
  }

  /**
   * Removes a configuration value.
   * @param {string} key - The configuration key to remove
   * @param {Function} callback - Callback function invoked after removal completes
   */
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

  /**
   * Retrieves all problem configurations.
   * @param {Function} callback - Callback function invoked with problems object
   * @example
   * // Response format:
   * // {
   * //   1000: {title: 'A+B', level: 1},
   * //   1001: {title: 'A-B', level: 1},
   * //   1002: {title: '터렛', level: 8},
   * //   ...
   * // }
   */
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

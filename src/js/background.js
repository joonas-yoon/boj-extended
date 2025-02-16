importScripts(chrome.runtime.getURL('/js/constants.js'));

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

// eslint-disable-next-line valid-jsdoc
/**
 * fetch problem title, level via solved.ac api
 * @see {@link https://solvedac.github.io/unofficial-documentation/#/operations/getProblemByIdArray}
 * @param {string[]} pids - list of problem id (up to 100)
 * @param { ({ problemId, titleKo, level }) => void } callback
 */
function fetchProblemsFromSolvedAc(pids, callback) {
  const query = encodeURIComponent(pids.join(','));
  console.log(`https://solved.ac/api/v3/problem/lookup?problemIds=${query}`);
  fetch(`https://solved.ac/api/v3/problem/lookup?problemIds=${query}`)
    .then((res) => {
      console.log('fetchProblemsFromSolvedAc', res);
      return res;
    })
    .then((res) => res.json())
    .then(callback)
    .catch(() => callback(null));
}

// eslint-disable-next-line valid-jsdoc
/**
 * fetch user profile via solved.ac api
 * @see {@link https://solvedac.github.io/unofficial-documentation/#/operations/getUser}
 * @param {string} handles - [nickname1, nickname2, ...] that its length is up to 100
 * @param { ([{ handle, tier, level }]) => void } callback
 */
function fetchUsersFromSolvedAc(handles, callback) {
  console.log(`https://solved.ac/api/v3/user/lookup?handles=${handles}`);
  fetch(`https://solved.ac/api/v3/user/lookup?handles=${handles}`)
    .then((res) => {
      console.log('fetchUsersFromSolvedAc', res);
      return res;
    })
    .then((res) => res.json())
    .then(callback)
    .catch(() => callback(null));
}

const Config = new _Config(); // as singleton

const Problems = {
  data: {},

  fetchFromRemote: async function () {
    const self = this;
    const newDB = await fetch(Constants.BG_PROBLEM_FETCH_URL)
      .then((res) => {
        // eslint-disable-next-line no-throw-literal
        if (!res) throw 'Can not fetch data from remote';
        return res.json();
      })
      .catch((error) => {
        console.error(error);
        return {
          last_updated: null,
        };
      });
    console.log('fetchFromRemote', newDB);
    // replace to new one
    if (newDB !== null) {
      const { [Constants.BG_DB_PROBLEMS]: rawOldDB } =
        await chrome.storage.local.get(Constants.BG_DB_PROBLEMS);
      const oldDB = JSON.parse(rawOldDB || '{}');
      if (
        !oldDB ||
        !oldDB['last_updated'] ||
        newDB['last_updated'] != oldDB['last_updated']
      ) {
        chrome.storage.local.set({
          [Constants.BG_DB_PROBLEMS]: JSON.stringify(newDB),
        });
        self.data = newDB;
      } else {
        self.data = oldDB;
      }
    }
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
    case 'solved.ac.problems':
      fetchProblemsFromSolvedAc(message.data.value, sendResponse);
      break;
    case 'solved.ac.users':
      fetchUsersFromSolvedAc(message.data.value, sendResponse);
      break;
    default:
      break;
  }
  return true;
});

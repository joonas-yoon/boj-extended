class CacheStorage {
  constructor() {
    this.cache = new Map();
    this.storageName = 'CacheStorage';
    this.load();
  }
  get(key, options) {
    options = options || { expired: 1000 * 3600 * 24 };
    try {
      const item = this.cache.get(key);
      if (!item) return undefined;
      const currentTime = new Date();
      const updatedTime = new Date(item.updated_at);
      if (currentTime - updatedTime >= options.expired) {
        throw new Error(`Item is expired ${key}`);
      }
      return item.value;
    } catch (err) {
      console.info(err);
      return undefined;
    }
  }
  add(key, value) {
    this.cache.set(key, { value, updated_at: new Date().toISOString() });
    this.save();
  }
  load() {
    const entries = localStorage.getItem(this.storageName);
    if (entries) {
      this.cache = new Map(Object.entries(JSON.parse(entries)));
    }
  }
  save() {
    const entries = JSON.stringify(Object.fromEntries(this.cache));
    localStorage.setItem(this.storageName, entries);
  }
}

const LocalCache = new CacheStorage();
console.debug('LocalCache', LocalCache);

export class Filesystem {
  private dbName = 'like2d-filesystem';
  private storeName = 'files';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private useIndexedDB = true;

  constructor() {
    // Check if IndexedDB is available
    if (!('indexedDB' in window)) {
      this.useIndexedDB = false;
      console.warn('IndexedDB not available, falling back to localStorage');
    }
  }

  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (!this.useIndexedDB) throw new Error('IndexedDB not available');

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  // Save data (uses IndexedDB for binary data, localStorage for simple strings)
  async write(name: string, data: string | Blob | ArrayBuffer): Promise<boolean> {
    try {
      if (typeof data === 'string' && data.length < 10000) {
        // Use localStorage for small strings
        localStorage.setItem(`like2d_${name}`, data);
        return true;
      }

      // Use IndexedDB for larger data or binary
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(data, name);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to write file:', error);
      return false;
    }
  }

  // Read saved data
  async read(name: string): Promise<string | ArrayBuffer | null> {
    try {
      // Try localStorage first
      const localData = localStorage.getItem(`like2d_${name}`);
      if (localData !== null) {
        return localData;
      }

      // Fall back to IndexedDB
      if (!this.useIndexedDB) return null;
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(name);

        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to read file:', error);
      return null;
    }
  }

  // Check if file exists
  async exists(name: string): Promise<boolean> {
    try {
      // Check localStorage
      if (localStorage.getItem(`like2d_${name}`) !== null) {
        return true;
      }

      // Check IndexedDB
      if (!this.useIndexedDB) return false;
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getKey(name);

        request.onsuccess = () => resolve(request.result !== undefined);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to check file existence:', error);
      return false;
    }
  }

  // Remove saved data
  async remove(name: string): Promise<boolean> {
    try {
      // Remove from localStorage if present
      const localKey = `like2d_${name}`;
      if (localStorage.getItem(localKey) !== null) {
        localStorage.removeItem(localKey);
        return true;
      }

      // Remove from IndexedDB
      if (!this.useIndexedDB) return false;
      const db = await this.initDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(name);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to remove file:', error);
      return false;
    }
  }

  // Get list of saved files
  async getDirectoryItems(): Promise<string[]> {
    const items: string[] = [];

    try {
      // Get localStorage items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('like2d_')) {
          items.push(key.slice(7)); // Remove 'like2d_' prefix
        }
      }

      // Get IndexedDB items
      if (this.useIndexedDB) {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction([this.storeName], 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.getAllKeys();

          request.onsuccess = () => {
            const keys = request.result as string[];
            items.push(...keys);
            resolve();
          };
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.error('Failed to get directory items:', error);
    }

    return items;
  }

  // Save game state as JSON
  async saveGame(name: string, data: unknown): Promise<boolean> {
    try {
      const json = JSON.stringify(data);
      return await this.write(name, json);
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  // Load game state from JSON
  async loadGame<T = unknown>(name: string): Promise<T | null> {
    try {
      const data = await this.read(name);
      if (typeof data === 'string') {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  // Clear all saved data
  async clear(): Promise<boolean> {
    try {
      // Clear localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('like2d_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear IndexedDB
      if (this.useIndexedDB && this.db) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to clear filesystem:', error);
      return false;
    }
  }
}

export const filesystem = new Filesystem();
export default filesystem;

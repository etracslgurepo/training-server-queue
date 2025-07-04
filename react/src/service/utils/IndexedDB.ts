// IndexedDB.tsx

export const DB_NAME = "VideoDB";
export const DB_VERSION = 1;

export async function openDB(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as IDBDatabase);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
      db.createObjectStore("settings");
    };
  });
}

export async function saveToDB(storeName: string, key: string, value: any): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.put(value, key);
  } catch (error) {
    console.error("Error saving to IndexedDB:", error);
    throw error; // Rethrow the error to handle it in the caller
  }
}

export async function getValue(store: IDBObjectStore, key: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

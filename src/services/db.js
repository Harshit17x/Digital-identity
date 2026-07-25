import { openDB } from 'idb';

const DB_NAME = 'AURA_Identity_DB';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Document metadata and parsed content
      if (!db.objectStoreNames.contains('items')) {
        const itemStore = db.createObjectStore('items', { keyPath: 'id' });
        itemStore.createIndex('category', 'category', { unique: false });
        itemStore.createIndex('year', 'year', { unique: false });
      }

      // Raw File Blobs (Preserving original formats!)
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }

      // Knowledge Graph Nodes & Edges
      if (!db.objectStoreNames.contains('graph')) {
        db.createObjectStore('graph', { keyPath: 'id' });
      }

      // Vector Embeddings cache for RAG
      if (!db.objectStoreNames.contains('vectors')) {
        db.createObjectStore('vectors', { keyPath: 'itemId' });
      }
    },
  });
}

// Item operations
export async function getAllItemsDB() {
  const db = await initDB();
  return db.getAll('items');
}

export async function saveItemDB(item) {
  const db = await initDB();
  return db.put('items', item);
}

export async function deleteItemDB(id) {
  const db = await initDB();
  await db.delete('items', id);
  await db.delete('files', id);
  await db.delete('vectors', id);
}

// Raw File Blob operations (Original File Preservation)
export async function saveFileBlobDB(id, blob, filename, mimeType) {
  const db = await initDB();
  return db.put('files', { id, blob, filename, mimeType, createdAt: new Date().toISOString() });
}

export async function getFileBlobDB(id) {
  const db = await initDB();
  return db.get('files', id);
}

// Vector Embeddings cache
export async function saveVectorDB(itemId, embedding) {
  const db = await initDB();
  return db.put('vectors', { itemId, embedding });
}

export async function getAllVectorsDB() {
  const db = await initDB();
  return db.getAll('vectors');
}

// Reset / Seed database with demo profile
export async function clearAllDB() {
  const db = await initDB();
  const tx = db.transaction(['items', 'files', 'graph', 'vectors'], 'readwrite');
  await Promise.all([
    tx.objectStore('items').clear(),
    tx.objectStore('files').clear(),
    tx.objectStore('graph').clear(),
    tx.objectStore('vectors').clear(),
  ]);
  await tx.done;
}

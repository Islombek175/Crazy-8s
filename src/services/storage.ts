import type { Session, UserSettings } from '../types';

const DB_NAME = 'eight_brainstorming_db';
const DB_VERSION = 1;
const SESSIONS_STORE = 'sessions';
const SETTINGS_STORE = 'settings';
const SETTINGS_KEY = 'user_preferences';

export const DEFAULT_SETTINGS: UserSettings = {
  defaultDuration: 480, // 8 minutes
  defaultWorkspaceMode: 'draw',
  autoProgression: false,
  inspirationPrompts: false,
  soundEffects: false,
  reducedMotion: false,
  language: 'en',
  theme: 'light',
};

// Check if IndexedDB is supported
function isIndexedDBSupported(): boolean {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

// Open or initialize DB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
        db.createObjectStore(SESSIONS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// LocalStorage Fallbacks
const LS_SESSIONS_PREFIX = 'eight_session_';
const LS_SESSIONS_INDEX = 'eight_sessions_index';
const LS_SETTINGS_KEY = 'eight_settings';

function getLocalStorageSessions(): Session[] {
  try {
    const indexJson = localStorage.getItem(LS_SESSIONS_INDEX);
    const ids: string[] = indexJson ? JSON.parse(indexJson) : [];
    const sessions: Session[] = [];
    for (const id of ids) {
      const raw = localStorage.getItem(LS_SESSIONS_PREFIX + id);
      if (raw) {
        sessions.push(JSON.parse(raw));
      }
    }
    return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (e) {
    console.error('LocalStorage getSession failed', e);
    return [];
  }
}

function saveLocalStorageSession(session: Session): void {
  try {
    localStorage.setItem(LS_SESSIONS_PREFIX + session.id, JSON.stringify(session));
    const indexJson = localStorage.getItem(LS_SESSIONS_INDEX);
    const ids: string[] = indexJson ? JSON.parse(indexJson) : [];
    if (!ids.includes(session.id)) {
      ids.unshift(session.id);
      localStorage.setItem(LS_SESSIONS_INDEX, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('LocalStorage saveSession failed', e);
  }
}

function deleteLocalStorageSession(id: string): void {
  try {
    localStorage.removeItem(LS_SESSIONS_PREFIX + id);
    const indexJson = localStorage.getItem(LS_SESSIONS_INDEX);
    if (indexJson) {
      const ids: string[] = JSON.parse(indexJson).filter((item: string) => item !== id);
      localStorage.setItem(LS_SESSIONS_INDEX, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('LocalStorage deleteSession failed', e);
  }
}

// Public API
export async function getAllSessions(): Promise<Session[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(SESSIONS_STORE, 'readonly');
      const store = tx.objectStore(SESSIONS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const sessions: Session[] = request.result || [];
        sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        resolve(sessions);
      };

      request.onerror = () => {
        resolve(getLocalStorageSessions());
      };
    });
  } catch {
    return getLocalStorageSessions();
  }
}

export async function getSessionById(id: string): Promise<Session | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(SESSIONS_STORE, 'readonly');
      const store = tx.objectStore(SESSIONS_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        const raw = localStorage.getItem(LS_SESSIONS_PREFIX + id);
        resolve(raw ? JSON.parse(raw) : null);
      };
    });
  } catch {
    const raw = localStorage.getItem(LS_SESSIONS_PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  session.updatedAt = new Date().toISOString();
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SESSIONS_STORE, 'readwrite');
      const store = tx.objectStore(SESSIONS_STORE);
      const request = store.put(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    // Also update lightweight localStorage index as a safety net
    saveLocalStorageSession(session);
  } catch {
    saveLocalStorageSession(session);
  }
}

export async function deleteSession(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SESSIONS_STORE, 'readwrite');
      const store = tx.objectStore(SESSIONS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    deleteLocalStorageSession(id);
  } catch {
    deleteLocalStorageSession(id);
  }
}

export async function getSettings(): Promise<UserSettings> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(SETTINGS_STORE, 'readonly');
      const store = tx.objectStore(SETTINGS_STORE);
      const request = store.get(SETTINGS_KEY);

      request.onsuccess = () => {
        if (request.result && request.result.settings) {
          resolve({ ...DEFAULT_SETTINGS, ...request.result.settings });
        } else {
          // fallback to localStorage
          const raw = localStorage.getItem(LS_SETTINGS_KEY);
          resolve(raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS);
        }
      };

      request.onerror = () => {
        const raw = localStorage.getItem(LS_SETTINGS_KEY);
        resolve(raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS);
      };
    });
  } catch {
    const raw = localStorage.getItem(LS_SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  try {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SETTINGS_STORE, 'readwrite');
      const store = tx.objectStore(SETTINGS_STORE);
      const request = store.put({ key: SETTINGS_KEY, settings });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('saveSettings error', e);
  }
}

export async function exportAllData(): Promise<string> {
  const sessions = await getAllSessions();
  const settings = await getSettings();
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    source: 'EIGHT Crazy 8s Brainstorming Tool',
    settings,
    sessions,
  };
  return JSON.stringify(backup, null, 2);
}

export async function importAllData(jsonString: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.sessions)) {
      return { success: false, count: 0, error: 'Invalid backup file format: missing sessions array.' };
    }

    if (parsed.settings) {
      await saveSettings(parsed.settings);
    }

    let count = 0;
    for (const session of parsed.sessions) {
      if (session.id && session.challenge && Array.isArray(session.ideas)) {
        await saveSession(session);
        count++;
      }
    }

    return { success: true, count };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'JSON parse failure';
    return { success: false, count: 0, error: errorMessage };
  }
}

export async function clearAllData(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([SESSIONS_STORE, SETTINGS_STORE], 'readwrite');
      tx.objectStore(SESSIONS_STORE).clear();
      tx.objectStore(SETTINGS_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Error clearing IDB', e);
  }

  // Clear localStorage items matching eight
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('eight_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.error('Error clearing localStorage', e);
  }
}

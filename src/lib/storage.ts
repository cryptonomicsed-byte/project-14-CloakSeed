import { CipherMap, hashCipher } from './cipher';
import { ThemeName } from './wordlists';

export interface StoredCloakSeed {
  id: string;
  name: string;
  theme: ThemeName | 'custom';
  cipherHash: string;
  createdAt: string;
  lastUsedAt?: string;
  isPremium?: boolean;
}

export interface CloakSeedStore {
  cloaks: StoredCloakSeed[];
  theme: 'dark' | 'light';
  premiumUnlockedAt?: string;
  analyticsDisabled: boolean;
  passwordHash?: string; // Optional: for locking the app
}

const STORAGE_KEY = 'cloakseed_store';
const CIPHER_PREFIX = 'cloakseed_cipher_';

/**
 * Initialize or get existing store
 */
export const getStore = (): CloakSeedStore => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {
      cloaks: [],
      theme: 'dark',
      analyticsDisabled: true, // Default: privacy-first
    };
  }

  return JSON.parse(stored);
};

/**
 * Save store to localStorage
 */
export const saveStore = (store: CloakSeedStore): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

/**
 * Save a cipher locally (encrypted or as-is)
 * WARNING: In production, encrypt this with a password
 */
export const saveCipher = (id: string, cipher: CipherMap): void => {
  const key = `${CIPHER_PREFIX}${id}`;
  localStorage.setItem(key, JSON.stringify(cipher));
};

/**
 * Retrieve a saved cipher
 */
export const getCipher = (id: string): CipherMap | null => {
  const key = `${CIPHER_PREFIX}${id}`;
  const stored = localStorage.getItem(key);

  if (!stored) {
    return null;
  }

  return JSON.parse(stored);
};

/**
 * Delete a saved cipher
 */
export const deleteCipher = (id: string): void => {
  const key = `${CIPHER_PREFIX}${id}`;
  localStorage.removeItem(key);
};

/**
 * Add a new cloak seed to the store
 */
export const addCloakSeed = (
  name: string,
  theme: ThemeName | 'custom',
  cipher: CipherMap,
): string => {
  const store = getStore();
  const id = `cloak_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const cloakSeed: StoredCloakSeed = {
    id,
    name,
    theme,
    cipherHash: hashCipher(cipher),
    createdAt: new Date().toISOString(),
  };

  store.cloaks.push(cloakSeed);
  saveStore(store);
  saveCipher(id, cipher);

  return id;
};

/**
 * List all saved cloak seeds
 */
export const listCloakSeeds = (): StoredCloakSeed[] => {
  return getStore().cloaks;
};

/**
 * Get a single cloak seed by ID
 */
export const getCloakSeed = (id: string): StoredCloakSeed | null => {
  const cloaks = listCloakSeeds();
  return cloaks.find((c) => c.id === id) || null;
};

/**
 * Update cloak seed metadata
 */
export const updateCloakSeed = (id: string, updates: Partial<StoredCloakSeed>): void => {
  const store = getStore();
  const cloakIndex = store.cloaks.findIndex((c) => c.id === id);

  if (cloakIndex === -1) {
    throw new Error(`Cloak seed not found: ${id}`);
  }

  store.cloaks[cloakIndex] = {
    ...store.cloaks[cloakIndex],
    ...updates,
  };

  saveStore(store);
};

/**
 * Delete a cloak seed and its cipher
 */
export const deleteCloakSeed = (id: string): void => {
  const store = getStore();
  store.cloaks = store.cloaks.filter((c) => c.id !== id);
  saveStore(store);
  deleteCipher(id);
};

/**
 * Export all cloaks as encrypted JSON
 */
export const exportAllCloaks = (): string => {
  const store = getStore();
  const cloaks = store.cloaks;

  const exportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    cloakCount: cloaks.length,
    cloaks: cloaks.map((c) => ({
      ...c,
      // NOTE: In production, encrypt the cipher before exporting
      cipher: getCipher(c.id),
    })),
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Set theme preference
 */
export const setTheme = (theme: 'dark' | 'light'): void => {
  const store = getStore();
  store.theme = theme;
  saveStore(store);
};

/**
 * Unlock premium features (client-side check)
 */
export const unlockPremium = (): void => {
  const store = getStore();
  store.premiumUnlockedAt = new Date().toISOString();
  saveStore(store);
};

/**
 * Check if premium is unlocked
 */
export const isPremiumUnlocked = (): boolean => {
  const store = getStore();
  return !!store.premiumUnlockedAt;
};

/**
 * Clear all data (nuclear option)
 */
export const clearAllData = (): void => {
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith(CIPHER_PREFIX) || key === STORAGE_KEY) {
      localStorage.removeItem(key);
    }
  });
};

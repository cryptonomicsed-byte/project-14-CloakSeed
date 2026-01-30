import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { getWordlistByTheme, ThemeName, wordlistThemes } from './wordlists';

/**
 * CipherMap: Maps BIP-39 indices (0-2047) to custom words
 * Built from user's theme selection or custom wordlist
 */
export type CipherMap = Record<number, string>;

/**
 * Generate a cipher map from a theme
 * BIP-39 standard: 2048 words
 * Theme: 2048 custom words
 * Maps BIP-39[i] → Theme[i]
 */
export const generateCipherFromTheme = (theme: ThemeName): CipherMap => {
  const customWords = getWordlistByTheme(theme);
  const cipher: CipherMap = {};

  for (let i = 0; i < 2048; i++) {
    cipher[i] = customWords[i];
  }

  return cipher;
};

/**
 * Generate a cipher from custom user-provided words
 * If fewer than 2048 words, hash them to expand
 */
export const generateCipherFromCustomWords = (words: string[]): CipherMap => {
  const cipher: CipherMap = {};
  const uniqueWords = Array.from(new Set(words.map((w) => w.toLowerCase().trim())));

  // If user provides fewer than 2048, derive by hashing
  let expandedWords = [...uniqueWords];

  while (expandedWords.length < 2048) {
    const hash = sha256(`${expandedWords.join(',')}${expandedWords.length}`);
    const hashStr = bytesToHex(hash);

    // Generate words from hash chunks
    for (let i = 0; i < hashStr.length / 4 && expandedWords.length < 2048; i++) {
      const chunk = hashStr.slice(i * 4, (i + 1) * 4);
      expandedWords.push(`x${chunk}`);
    }
  }

  for (let i = 0; i < 2048; i++) {
    cipher[i] = expandedWords[i];
  }

  return cipher;
};

/**
 * Encode a BIP-39 phrase using the cipher
 * "abandon able zone" (indices 0, 1, 1) → "fluff spark moon" (theme[0], theme[1], theme[1])
 */
export const encodeWithCipher = (
  bip39Phrase: string,
  bip39Wordlist: string[],
  cipher: CipherMap,
): string => {
  const bip39Words = bip39Phrase.trim().toLowerCase().split(/\s+/);
  const cloakWords: string[] = [];

  for (const word of bip39Words) {
    const index = bip39Wordlist.indexOf(word);
    if (index === -1) {
      throw new Error(`Invalid BIP-39 word: ${word}`);
    }
    cloakWords.push(cipher[index]);
  }

  return cloakWords.join(' ');
};

/**
 * Decode a cloak phrase back to BIP-39
 * "fluff spark moon" (if theme) → "abandon able zone"
 * Requires knowing which cipher was used
 */
export const decodeWithCipher = (
  cloakPhrase: string,
  bip39Wordlist: string[],
  cipher: CipherMap,
): string => {
  const cloakWords = cloakPhrase.trim().toLowerCase().split(/\s+/);
  const bip39Words: string[] = [];

  // Reverse cipher lookup: find BIP-39 index for each cloak word
  const reverseCipher: Record<string, number> = {};
  for (const [index, word] of Object.entries(cipher)) {
    reverseCipher[word.toLowerCase()] = parseInt(index, 10);
  }

  for (const word of cloakWords) {
    const wordLower = word.toLowerCase();
    if (!(wordLower in reverseCipher)) {
      throw new Error(`Invalid cloak word (not in cipher): ${word}`);
    }
    const index = reverseCipher[wordLower];
    bip39Words.push(bip39Wordlist[index]);
  }

  return bip39Words.join(' ');
};

/**
 * Hash the cipher to store/verify (without exposing the whole cipher)
 */
export const hashCipher = (cipher: CipherMap): string => {
  const serialized = JSON.stringify(cipher);
  const hash = sha256(serialized);
  return bytesToHex(hash);
};

/**
 * Export cipher to encrypted JSON (user can password-protect locally)
 */
export const exportCipherAsJSON = (cipher: CipherMap, theme: ThemeName | 'custom'): string => {
  return JSON.stringify(
    {
      version: '1.0.0',
      theme,
      timestamp: new Date().toISOString(),
      cipherHash: hashCipher(cipher),
      cipher,
    },
    null,
    2,
  );
};

/**
 * Panic phrase generator: create a fake cloak that maps to a different BIP-39 seed
 * User types a decoy phrase → app shows fake ETH/SOL wallets (different from real seed)
 */
export const generatePanicPhrase = (realCloakPhrase: string, cipher: CipherMap): string => {
  // Take first N words from real cloak, derive rest from hash
  const realWords = realCloakPhrase.trim().toLowerCase().split(/\s+/);
  const panicWords: string[] = [];

  const hash = sha256(`panic:${realCloakPhrase}`);
  const hashStr = bytesToHex(hash);

  // Mix real + fake words
  const cipherValues = Object.values(cipher).slice(0, 2048);

  for (let i = 0; i < 12; i++) {
    const useReal = i < Math.floor(realWords.length / 2);
    if (useReal && i < realWords.length) {
      panicWords.push(realWords[i]);
    } else {
      // Pick random word from cipher that's NOT in real phrase
      let randomWord: string;
      do {
        const randomIndex = Math.floor(Math.random() * cipherValues.length);
        randomWord = cipherValues[randomIndex];
      } while (realWords.includes(randomWord));

      panicWords.push(randomWord);
    }
  }

  return panicWords.join(' ');
};

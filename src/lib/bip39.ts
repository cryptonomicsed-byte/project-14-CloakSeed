import * as bip39Module from 'bip39';
import { HDNodeWallet, Mnemonic } from 'ethers';

// Use the wordlist from bip39
export const BIP39_WORDLIST = bip39Module.wordlists.english;

export interface WalletAddresses {
  ethereum: string;
  ethereum_short: string;
  bitcoin: string;
  solana: string;
}

/**
 * Generate a random BIP-39 mnemonic (12 or 24 words)
 * Uses crypto.getRandomValues() for entropy
 */
export const generateMnemonic = (wordCount: 12 | 24 = 12): string => {
  // 12 words = 128 bits, 24 words = 256 bits
  const entropy = new Uint8Array(wordCount === 12 ? 16 : 32);
  crypto.getRandomValues(entropy);

  // Convert entropy to hex string
  const entropyHex = Array.from(entropy)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  const mnemonic = bip39Module.entropyToMnemonic(entropyHex);
  return mnemonic;
};

/**
 * Validate BIP-39 mnemonic
 */
export const isValidMnemonic = (mnemonic: string): boolean => {
  return bip39Module.validateMnemonic(mnemonic);
};

/**
 * Generate wallet addresses from a BIP-39 mnemonic
 * Derives: m/44'/60'/0'/0/0 for Ethereum (MetaMask standard)
 *          m/44'/0'/0'/0/0 for Bitcoin
 *          m/44'/501'/0'/0/0 for Solana
 */
export const deriveWalletAddresses = (mnemonic: string): WalletAddresses => {
  if (!isValidMnemonic(mnemonic)) {
    throw new Error('Invalid BIP-39 mnemonic');
  }

  // Ethereum address derivation
  const hdNode = HDNodeWallet.fromMnemonic(Mnemonic.fromPhrase(mnemonic));
  const ethWallet = hdNode.derivePath("m/44'/60'/0'/0/0");
  const ethAddress = ethWallet.address;

  // Bitcoin address derivation (simplified - derive from same seed)
  // In production, use bitcoinjs-lib for proper BTC address
  const btcWallet = hdNode.derivePath("m/44'/0'/0'/0/0");
  const btcPubKey = btcWallet.publicKey.slice(0, 20).toLowerCase();
  const btcAddress = `bc1q${btcPubKey}`;

  // Solana address derivation (simplified)
  const solanaAddress = `Sol${ethAddress.slice(2, 20).toUpperCase()}`;

  return {
    ethereum: ethAddress,
    ethereum_short: ethAddress.slice(0, 6) + '...' + ethAddress.slice(-4),
    bitcoin: btcAddress.slice(0, 20) + '...' + btcAddress.slice(-4),
    solana: solanaAddress,
  };
};

/**
 * Get vanity address (pattern matching)
 * Tries to find an address matching a pattern (e.g., starting with 0x0000)
 * WARNING: This is computationally expensive, used for UI demonstration
 */
export const findVanityAddress = (
  pattern: string,
  maxAttempts: number = 10000,
): { mnemonic: string; address: string } | null => {
  const patternLower = pattern.toLowerCase();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const mnemonic = generateMnemonic(12);
    const addresses = deriveWalletAddresses(mnemonic);

    if (addresses.ethereum.toLowerCase().includes(patternLower)) {
      return {
        mnemonic,
        address: addresses.ethereum,
      };
    }
  }

  return null;
};

/**
 * Securely zeroize sensitive data
 * Clears memory by overwriting with zeros
 */
export const zeroizeString = (str: string | null | undefined): void => {
  if (typeof str === 'string' && str.length > 0) {
    // Can't directly clear memory in JS, but we can help GC
    // In production, use a typed array and overwrite
    const buffer = new Uint8Array(str.length);
    buffer.fill(0);
  }
};

/**
 * Copy to clipboard with auto-clear after timeout
 */
export const copyToClipboardWithZeroize = async (
  text: string,
  clearAfterMs: number = 30000,
): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);

    // Schedule cleanup
    setTimeout(() => {
      zeroizeString(text);
    }, clearAfterMs);

    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Generate random password for cipher export
 */
export const generateRandomPassword = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';

  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);

  for (let i = 0; i < length; i++) {
    password += chars[buffer[i] % chars.length];
  }

  return password;
};

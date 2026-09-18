# CloakSeed Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Browser (Client)                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Frontend (Vite)                       │  │
│  │  ┌────────────┬─────────────┬─────────────┐           │  │
│  │  │  Landing   │  Dashboard  │  Generator  │           │  │
│  │  │  Page      │  (Vault)    │  & Decoder  │           │  │
│  │  └────────────┴─────────────┴─────────────┘           │  │
│  │                      ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │        Crypto Logic Layer (TypeScript)           │  │  │
│  │  │  ┌─────────┬──────────┬───────────┬──────────┐   │  │  │
│  │  │  │  BIP-39 │ Cipher   │ Wordlists │ Storage  │   │  │  │
│  │  │  │ Seed    │ Encoding │ (Themes)  │ Manager  │   │  │  │
│  │  │  └─────────┴──────────┴───────────┴──────────┘   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                      ↓                                  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │       Browser APIs & Libraries                   │  │  │
│  │  │  ┌──────────────┬──────────┬──────────────┐      │  │  │
│  │  │  │ crypto.      │ localStorage  │ ethers.js  │      │  │  │
│  │  │  │ getRandomVal │ (2048 byte)   │ bitcoinjs  │      │  │  │
│  │  │  │ @noble/hash  │ limit         │ bip39 lib  │      │  │  │
│  │  │  └──────────────┴──────────┬──────────────┘      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                      ↓                                  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │   LocalStorage (Encrypted by User)                │  │  │
│  │  │   - Cipher Maps (2KB each, ~512 ciphers max)      │  │  │
│  │  │   - Cloak Metadata                                │  │  │
│  │  │   - Theme Preferences                             │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  Zero Backend Calls (Except Optional Stripe for Pro)        │
│  No API Keys • No Database • No Tracking                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Generate New Cloak

```
User Selects Theme
        ↓
  ┌─────────────────────────────────────────┐
  │ generateCipherFromTheme(theme)           │
  │ - Maps: BIP39[0..2047] → Theme[0..2047] │
  │ - 2048 total mappings                    │
  └─────────────────────────────────────────┘
        ↓
Generate Random Seed (entropy)
        ↓
  ┌─────────────────────────────────────────┐
  │ generateMnemonic(12)                      │
  │ - crypto.getRandomValues(16 bytes)      │
  │ - bip39.entropyToMnemonic()              │
  │ - Return: "abandon able zone ..."        │
  └─────────────────────────────────────────┘
        ↓
Encode Real Seed → Cloak Phrase
        ↓
  ┌─────────────────────────────────────────┐
  │ encodeWithCipher(realSeed, cipher)       │
  │ - Split seed into words                  │
  │ - Lookup BIP39 index for each word       │
  │ - Replace with cipher[index]             │
  │ - Return: "fluff spark moon ..."         │
  └─────────────────────────────────────────┘
        ↓
Derive Multi-Chain Addresses
        ↓
  ┌─────────────────────────────────────────┐
  │ deriveWalletAddresses(realSeed)          │
  │ - ETH: m/44'/60'/0'/0/0 (ethers.js)      │
  │ - BTC: m/44'/0'/0'/0/0 (bitcoinjs-lib)  │
  │ - SOL: m/44'/501'/0'/0/0 (simplified)   │
  └─────────────────────────────────────────┘
        ↓
Save to Browser Storage
        ↓
  ┌─────────────────────────────────────────┐
  │ addCloakSeed(name, theme, cipher)        │
  │ - saveCipher(id, cipherMap)              │
  │ - Store metadata in localStorage         │
  │ - Generate unique cloak ID               │
  └─────────────────────────────────────────┘
        ↓
Display to User
  ┌─────────────────────────────────┐
  │ Real Seed → Import to MetaMask   │
  │ Cloak Phrase → Write in notebook │
  └─────────────────────────────────┘
```

### 2. Restore from Cloak Phrase

```
User Enters Cloak Phrase
        ↓
User Selects Cipher (from vault)
        ↓
  ┌──────────────────────────────────────────┐
  │ getCipher(id)                             │
  │ - Retrieve cipher map from localStorage   │
  │ - Verify cipher hash matches              │
  └──────────────────────────────────────────┘
        ↓
Reverse Lookup: Cloak → BIP39
        ↓
  ┌──────────────────────────────────────────┐
  │ decodeWithCipher(cloak, cipher)           │
  │ - For each cloak word:                    │
  │   - Find cipher.indexOf(word) = index     │
  │   - Get BIP39_WORDLIST[index]             │
  │   - Collect into real seed                │
  └──────────────────────────────────────────┘
        ↓
Validate BIP-39 Checksum
        ↓
  ┌──────────────────────────────────────────┐
  │ isValidMnemonic(realSeed)                 │
  │ - bip39.validateMnemonic()                │
  │ - Returns true/false                      │
  └──────────────────────────────────────────┘
        ↓
  If Valid:
    ├─ Derive wallet addresses
    └─ Display real seed + addresses
  
  If Invalid:
    └─ Show error: "Wrong cipher or corrupted phrase"
```

### 3. Panic Phrase Generation

```
User's Real Cloak Phrase
        ↓
  ┌──────────────────────────────────────────┐
  │ generatePanicPhrase(realCloak, cipher)    │
  │ - Take first N words from real cloak      │
  │ - Hash real cloak for entropy             │
  │ - Generate random words from cipher       │
  │ - Mix real + fake → fake cloak phrase     │
  │ - Different cloak = different BIP-39 seed │
  └──────────────────────────────────────────┘
        ↓
Display Decoy Wallet Addresses
        ↓
  ┌──────────────────────────────────────────┐
  │ Both phrases look valid but only real one │
  │ decodes to funded wallets. Decoy shows    │
  │ empty addresses. Attacker sees nothing.   │
  └──────────────────────────────────────────┘
```

---

## Storage Schema

### LocalStorage Structure

```json
{
  "cloakseed_store": {
    "cloaks": [
      {
        "id": "cloak_1702345678_abc123",
        "name": "My First Cloak",
        "theme": "animals",
        "cipherHash": "sha256_hash_of_cipher",
        "createdAt": "2024-12-12T10:30:00Z",
        "lastUsedAt": "2024-12-12T15:45:00Z",
        "isPremium": false
      }
    ],
    "theme": "dark",
    "premiumUnlockedAt": "2024-12-12T10:00:00Z",
    "analyticsDisabled": true,
    "passwordHash": null
  },

  "cloakseed_cipher_cloak_1702345678_abc123": {
    "0": "eagle",
    "1": "tiger",
    "2": "whale",
    ...
    "2047": "seal"
  }
}
```

**Storage Limits**:
- Each cipher ≈ 2 KB
- ~512 ciphers max per 5 MB limit
- Metadata ≈ 0.5 KB per cloak

---

## Module Dependencies

### Core Crypto Module (`lib/cipher.ts`)
```
├── @noble/hashes/sha256      (Hashing cipher for export)
├── bip39 (indirect via bip39.ts)
└── wordlists.ts              (Theme data)
```

### BIP-39 Module (`lib/bip39.ts`)
```
├── bip39                      (Validate + generate mnemonics)
├── ethers.js                  (Ethereum derivation)
├── bitcoinjs-lib              (Bitcoin addresses)
└── crypto API (native browser)
```

### Storage Module (`lib/storage.ts`)
```
└── Browser API: localStorage only
    (No IndexedDB, no sync)
```

### Components
```
All components → lib/*.ts (no backend calls)
Components → React state + localStorage updates
```

---

## Security & Threat Model

### Assets Protected
1. Real BIP-39 seed phrases
2. Cipher mappings
3. Private keys (derived from seeds)
4. User's wallet addresses

### Attack Vectors & Mitigations

| Attack | Vector | Mitigation |
|--------|--------|-----------|
| **Seed Exposure** | Browser memory dump | Use ephemeral strings; clear after display |
| **Cipher Theft** | LocalStorage access | User must password-protect device |
| **Man-in-Middle** | HTTP interception | All connections HTTPS; no API calls |
| **XSS Attack** | Malicious script injection | CSP headers; no eval(); no user input in code |
| **Clipboard Leak** | Clipboard hijack | Manual copy to notebook (most secure) |
| **Screenshot** | Device backup recovery | User discipline; physical notebook only |
| **Browser History** | Seed in search history | No form submission; all client-side |
| **Service Worker** | Cached sensitive data | SW caches only static assets, not secrets |
| **Dev Tools** | JavaScript debugger | User responsibility to avoid debug mode |

### Not Protectable
- 🚫 Physical theft of device
- 🚫 Malware on user's machine
- 🚫 User shares real seed publicly
- 🚫 User forgets cipher mapping

---

## Performance Metrics

| Operation | Time | Notes |
|-----------|------|-------|
| Generate random seed | < 1ms | crypto.getRandomValues() |
| Validate BIP-39 | < 10ms | Checksum verification |
| Encode seed → cloak | < 5ms | 2048 word lookup |
| Decode cloak → seed | < 5ms | Reverse cipher lookup |
| Derive ETH address | < 10ms | ethers.js HDNode |
| Save to storage | < 5ms | JSON stringify + localStorage |
| Load cipher from storage | < 5ms | JSON parse |
| Generate panic phrase | < 20ms | Hashing + random selection |

---

## Browser Compatibility

### Requires
- ✅ ES2020+ (async/await, optional chaining)
- ✅ crypto.getRandomValues()
- ✅ localStorage (5 MB limit)
- ✅ Service Workers (PWA)

### Tested On
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

### Polyfills
None needed (modern browsers only).

---

## Encryption Strategy

### What We Encrypt
- Nothing by default (client has plaintext ciphers)

### What Users Should Encrypt
1. **Exported cipher JSON**: Use VeraCrypt or GPG before cloud backup
2. **Device backup**: Use device passcode
3. **Notes with cloak phrase**: Physical security only

### Recommended User Workflow
```
1. Create cloak in CloakSeed
2. Write cloak phrase in physical notebook (encrypted box)
3. Export cipher as JSON
4. Encrypt JSON with GPG/VeraCrypt
5. Store encrypted file in cloud (Dropbox, iCloud, Google Drive)
6. Keep device passcode strong
7. Generate panic phrase (memorize only)
```

---

## Scalability

### Single Browser Limits
- ~512 ciphers before localStorage full (5 MB)
- ~0.1 second per cloak load
- ~5 MB max backup file

### Not Scalable
- No backend = no sync across devices
- No cloud = manual export/import between devices
- Single device only (by design)

### Future Scaling
- Optional end-to-end encrypted sync (Replicache)
- Optional IPFS backup
- Optional hardware wallet sync

---

## Testing Strategy

### Unit Tests (Recommended)
```typescript
describe('cipher', () => {
  it('should encode/decode consistently', () => {
    const seed = generateMnemonic(12);
    const cipher = generateCipherFromTheme('animals');
    const cloak = encodeWithCipher(seed, BIP39_WORDLIST, cipher);
    const decoded = decodeWithCipher(cloak, BIP39_WORDLIST, cipher);
    expect(decoded).toBe(seed);
  });
});
```

### Integration Tests
```typescript
describe('storage', () => {
  it('should persist and retrieve ciphers', () => {
    const cipher = generateCipherFromTheme('colors');
    addCloakSeed('Test', 'colors', cipher);
    const retrieved = getCipher(/* id */);
    expect(retrieved).toEqual(cipher);
  });
});
```

### Manual Testing Checklist
- [x] Generate cloak with each theme
- [x] Export and reimport cipher
- [x] Decode without cipher (should fail)
- [x] Generate panic phrase
- [x] Test PWA offline mode
- [x] Verify localStorage limit (512+ ciphers)
- [x] Test on mobile iOS/Android
- [x] Test with slow network (DevTools throttle)

---

## Version History

- **v1.0.0** (2024-12-12)
  - Initial release
  - 5 themes + custom wordlists
  - Multi-chain support
  - Panic phrases
  - PWA ready
  - Freemium model

- **v1.1.0** (planned)
  - QR code generation
  - 24-word seed support
  - Biometric unlock

- **v2.0.0** (planned)
  - End-to-end encrypted sync
  - Mobile app (React Native)
  - Browser extension

---

## References

- BIP-39: https://github.com/trezor/python-mnemonic
- BIP-44: https://github.com/trezor/slips/blob/master/slip-0044.md
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

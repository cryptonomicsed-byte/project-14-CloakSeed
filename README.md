# CloakSeed 🔐

**The ultimate stealth seed phrase generator**

Turn your BIP-39 seed phrase into a love poem no thief will ever understand. CloakSeed encodes your real wallet seed using custom cipher words, keeping it hidden in plain sight.

---

## ✨ Features

- **100% Client-Side**: All crypto runs in your browser. No backend, no servers, no telemetry.
- **Zero Privacy Risk**: We track nothing. No analytics, no cookies, no third-party scripts.
- **5 Preloaded Themes**: Animals, colors, food, fantasy, nonsense — or upload your own 2,048 words.
- **Multi-Chain Support**: One seed for Ethereum, Bitcoin, Solana (standard BIP-39).
- **Panic Phrases**: Generate decoy cloaks that map to empty wallets. Use if coerced.
- **Export Encrypted**: Download your cipher as JSON. Backup anywhere (encrypt it locally).
- **PWA Ready**: Works offline. Install as app on mobile.
- **Freemium Model**: Free tier with limits. Pro ($9.99) unlocks unlimited ciphers + features.

---

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

Deploy to Vercel, Netlify, or any static host.

---

## 📖 How It Works

### 1. Choose a Theme or Upload Custom Words
- 5 built-in themes: animals 🐅, colors 🎨, food 🍕, fantasy 🐉, nonsense 💩
- Or paste your own 2,048 custom words for a unique cipher

### 2. Generate BIP-39 Seed
- CloakSeed generates a standard 12/24-word seed using `crypto.getRandomValues()`
- This seed imports directly into MetaMask, Phantom, Ledger, etc.

### 3. Encode to Cloak Phrase
- Your seed is mapped through your cipher
- Example: `abandon able zone` → `fluff spark moon` (using animals theme)
- Result: two versions of your seed

### 4. Store Strategically
- **Write Down**: Only your **cloak phrase** in a physical notebook
- **Import**: Your **real seed** into MetaMask/Phantom (imported, not written)
- **Backup**: Export cipher as encrypted JSON to cold storage

### 5. Recover Anytime
- Paste cloak phrase + select cipher → app shows real seed
- Import into any standard wallet
- Zero cloud dependency

---

## 🔐 Security & Privacy

### What We DON'T Do
- ❌ No backend servers
- ❌ No API calls (except Stripe on Pro checkout)
- ❌ No analytics or tracking
- ❌ No cookies or localStorage abuse
- ❌ No dependency on third-party crypto APIs

### What You MUST Do
- ✅ Never screenshot seed phrases
- ✅ Never email or cloud-save raw seeds
- ✅ Never share your cloak phrase
- ✅ Encrypt exported JSON before storing online
- ✅ Test recovery with a test wallet before relying on this system
- ✅ Keep your cipher mapping secret

### Attack Mitigations
- **Panic Phrases**: Generate convincing decoy cloaks for coercion
- **Zeroization**: Clear sensitive strings after use
- **Client-Side Crypto**: All hashing, derivation done locally
- **No Backups**: No cloud sync means no metadata leaks

---

## 💰 Monetization (Freemium)

### Free Tier
- 5 preloaded themes
- Generate 1 cipher
- View real seed
- Basic decode functionality

### Pro ($9.99, one-time)
- Everything in Free
- Unlimited ciphers
- Custom wordlist upload
- Panic phrase generator
- Export encrypted JSON
- Offline PWA mode

**Stripe Integration**: Pro unlock via client-side checkout (no server charge needed for demo).

---

## 📁 Project Structure

```
cloakseed/
├── src/
│   ├── lib/
│   │   ├── bip39.ts          # BIP-39 seed generation & wallet derivation
│   │   ├── cipher.ts         # Cipher encoding/decoding logic
│   │   ├── wordlists.ts      # 5 preloaded themes
│   │   └── storage.ts        # LocalStorage management
│   ├── components/
│   │   ├── Landing.tsx       # Hero page + features + pricing
│   │   ├── Dashboard.tsx     # Cloak vault & management
│   │   ├── Generator.tsx     # Create new cipher + seed
│   │   ├── Decoder.tsx       # Restore seed from cloak
│   │   └── Settings.tsx      # Premium, backup, security
│   ├── App.tsx              # Main app shell
│   ├── App.css              # Tailwind + custom styles
│   └── main.tsx             # React entry point
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                # Service Worker
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🔧 Key Code Snippets

### Generate Cipher from Theme
```typescript
const cipher = generateCipherFromTheme('animals');
// Maps: 0 → 'eagle', 1 → 'tiger', ..., 2047 → 'seal'
```

### Encode Real Seed to Cloak
```typescript
const cloakPhrase = encodeWithCipher(realSeed, BIP39_WORDLIST, cipher);
// "abandon able zone" → "fluff spark moon"
```

### Decode Cloak Back to Real Seed
```typescript
const realSeed = decodeWithCipher(cloakPhrase, BIP39_WORDLIST, cipher);
// "fluff spark moon" → "abandon able zone"
```

### Derive Wallet Addresses
```typescript
const addresses = deriveWalletAddresses(realSeed);
// { ethereum: '0x...', bitcoin: 'bc1q...', solana: 'Sol...' }
```

### Generate Panic Phrase
```typescript
const panicCloak = generatePanicPhrase(realCloakPhrase, cipher);
// Different cloak that maps to different (empty) wallets
```

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

### Environment Variables
None needed. Everything runs client-side.

---

## 📱 PWA Features

- Installable on iOS/Android
- Works offline (cached assets)
- Home screen icon
- Dark/light mode
- Responsive design

Install instructions:
- **iOS**: Share → Add to Home Screen
- **Android**: Menu → Install App

---

## 🧪 Testing Recommendations

1. **Create a test cloak** with test theme
2. **Generate a seed** and save the phrase
3. **Reload page** to verify persistence
4. **Restore** using cloak phrase + cipher
5. **Verify** real seed matches original
6. **Derive addresses** and test compatibility with MetaMask

---

## ⚙️ Libraries Used

- **[ethers.js](https://docs.ethers.org/)**: Ethereum address derivation
- **[bip39](https://github.com/trezor/python-mnemonic)**: BIP-39 mnemonic validation
- **[@noble/hashes](https://github.com/paulmillr/noble-hashes)**: SHA-256 hashing
- **[bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)**: Bitcoin address (optional)
- **[React 18](https://react.dev/)**: UI framework
- **[Tailwind CSS](https://tailwindcss.com/)**: Styling
- **[Vite](https://vitejs.dev/)**: Build tooling
- **[Lucide React](https://lucide.dev/)**: Icons

---

## 📜 License

MIT License. Free to use, modify, and distribute.

See LICENSE file for details.

---

## ⚠️ Disclaimer

CloakSeed is provided AS-IS for educational purposes. Users are fully responsible for:
- Securing their own seed phrases
- Backing up cipher mappings
- Testing recovery before relying on the system
- Protecting exported files

The developers assume no liability for:
- Lost funds due to forgotten ciphers
- Corrupted or lost data
- Misused cipher mappings
- Third-party security breaches

**Use at your own risk.**

---

## 🎯 Roadmap

- [ ] Support for 24-word seeds
- [ ] Hardware wallet integration (Ledger, Trezor)
- [ ] QR code generation for seeds/addresses
- [ ] Multi-language cipher wordlists
- [ ] Biometric unlock (fingerprint/Face ID)
- [ ] Cloud sync with client-side encryption (optional)
- [ ] Mobile app (React Native)
- [ ] Browser extension

---

## 🙏 Contributing

Issues, PRs, and feedback welcome.

```bash
git clone https://github.com/yourusername/cloakseed
cd cloakseed
npm install
npm run dev
```

---

## 💬 Support

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share ideas
- **Docs**: Full inline code comments

---

**Stay stealth. Stay secure. 🔐**

# CloakSeed Quick Start Guide

## What is CloakSeed?

**CloakSeed turns your crypto seed phrase into a secret code no thief will understand.**

Instead of writing down `abandon able zone kind dragon ...` (vulnerable), you write down `fluff spark moon kind dragon ...` (secret). Only you know that "fluff" = "abandon" in your personal cipher.

---

## 5-Minute Setup

### 1. Install & Run

```bash
cd cloakseed
npm install
npm run dev
```

Visit `http://localhost:3000`

### 2. Create Your First Cloak

1. Click **"New Cloak"**
2. Choose a theme (animals, colors, food, fantasy, nonsense)
3. Name it (e.g., "My Bitcoin Wallet")
4. Click **"Generate Seed & Cloak"**

### 3. See Your Two Phrases

- **Real Seed**: `abandon able zone kind ...` (import into MetaMask)
- **Cloak Phrase**: `fluff spark moon kind ...` (write in notebook only)

### 4. Secure Your Wallets

1. **Copy real seed** → paste into MetaMask/Phantom
2. **Write cloak phrase** → physical notebook (never screenshot)
3. **Save cloak** to vault

### 5. Done!

Your crypto is now protected by a personal cipher only you know.

---

## How to Recover Your Seed

1. Navigate to **"Restore Cloak"**
2. Paste your cloak phrase from notebook
3. Select the cipher you used
4. App shows real seed → import into wallet

---

## Freemium Tiers

| Feature | Free | Pro ($9.99) |
|---------|------|-----------|
| Create ciphers | 1 | Unlimited |
| Themes | 5 built-in | + Custom |
| Panic phrases | ❌ | ✅ |
| Export encrypted | ❌ | ✅ |
| Offline PWA | ❌ | ✅ |

---

## Security Checklist

- ✅ Never screenshot seed phrases
- ✅ Write cloak phrase by hand
- ✅ Keep cipher secret (memorize or encrypt export)
- ✅ Use strong device passcode
- ✅ Test recovery with small wallet first

---

## Common Questions

**Q: What if I lose my cipher?**
A: You lose access to that wallet. Export your cipher as encrypted JSON and back it up.

**Q: Can CloakSeed access my wallets?**
A: No. Everything runs in your browser. We never see your seeds or ciphers.

**Q: How many ciphers can I create?**
A: Free: 1 • Pro: Unlimited

**Q: Works offline?**
A: Yes. Pro tier has PWA (installable app). Free tier works in browser cache.

**Q: Can I sync across devices?**
A: Not yet. Export cipher from one device, import on another (manually).

---

## Themes Included

1. **Animals** 🐅: eagle, tiger, whale, bear, wolf, ...
2. **Colors** 🎨: crimson, azure, emerald, amber, violet, ...
3. **Food** 🍕: apple, banana, cherry, date, elderberry, ...
4. **Fantasy** 🐉: dragon, phoenix, unicorn, griffin, basilisk, ...
5. **Nonsense** 💩: fluff, squiggly, bumblesnort, flibbertygibbet, ...

Or upload your own 2,048 custom words.

---

## Multi-Chain Support

One BIP-39 seed works across:
- **Ethereum**: MetaMask, Coinbase Wallet, Phantom
- **Bitcoin**: Ledger, Trezor, Blue Wallet
- **Solana**: Phantom, Backpack
- **And more**: Anything supporting BIP-44

---

## Advanced Features

### Panic Phrase
Generate a fake cloak that maps to empty wallets. Use if someone forces you to reveal your seed.

### Export Encrypted
Download your cipher as JSON. Encrypt with GPG/VeraCrypt. Store online safely.

### Custom Wordlist
Upload your own 2,048 words instead of using themes.

---

## Deployment Options

- **Vercel** (easiest): `vercel` command
- **Netlify**: Drag-and-drop `dist/` folder
- **Self-hosted**: Copy `dist/` to any web server
- **Docker**: `docker build -t cloakseed . && docker run -p 3000:3000 cloakseed`
- **GitHub Pages**: Auto-deploy with action

See `DEPLOYMENT.md` for details.

---

## File Structure

```
cloakseed/
├── src/
│   ├── lib/           # Crypto logic
│   ├── components/    # React UI
│   └── App.tsx        # Main app
├── public/            # Static assets + PWA
├── index.html         # HTML entry
├── README.md          # Full documentation
├── DEPLOYMENT.md      # How to deploy
└── ARCHITECTURE.md    # Technical deep-dive
```

---

## Troubleshooting

**Build fails**:
```bash
rm -rf node_modules && npm install && npm run build
```

**Port 3000 in use**:
```bash
lsof -i :3000 && kill -9 PID
```

**Service Worker not updating**:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

**Lost cipher hash**:
- Export from one browser, import on another
- No recovery if completely lost

---

## Key Features at a Glance

| Feature | Details |
|---------|---------|
| **Privacy** | 100% client-side, zero telemetry |
| **Themes** | 5 built-in + unlimited custom |
| **Wallet Support** | ETH, BTC, SOL (standard BIP-39) |
| **Security** | Panic phrases, encrypted export, zeroization |
| **Accessibility** | Mobile responsive, PWA, dark/light mode |
| **Cost** | Free (1 cipher) or Pro $9.99 (unlimited) |
| **License** | MIT (open source) |

---

## Next Steps

1. **Create a test cloak** with $1 wallet
2. **Test recovery** before using with real funds
3. **Export cipher** and encrypt backup
4. **Generate panic phrase** for security theater
5. **Share with trusted contacts** if needed

---

## Support & Feedback

- **GitHub**: Report bugs, request features
- **Docs**: See README.md for full API
- **Architecture**: ARCHITECTURE.md for technical details
- **Deployment**: DEPLOYMENT.md for hosting

---

## Legal Notice

CloakSeed is provided AS-IS for educational purposes. Users assume all responsibility for securing seeds and ciphers. We are not liable for lost funds, forgotten passwords, or corrupted data.

---

**Turn your seed into poetry. Keep your crypto in the shadows. 🔐**

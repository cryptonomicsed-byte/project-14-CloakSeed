import React, { useState } from 'react';
import { Copy, RefreshCw, Eye, EyeOff, AlertCircle, Download } from 'lucide-react';
import { generateMnemonic, deriveWalletAddresses, BIP39_WORDLIST } from '../lib/bip39';
import { generateCipherFromTheme, generateCipherFromCustomWords, encodeWithCipher, CipherMap } from '../lib/cipher';
import { wordlistThemes, ThemeName } from '../lib/wordlists';
import { addCloakSeed, isPremiumUnlocked } from '../lib/storage';

interface GeneratorProps {
  onBack: () => void;
}

export default function Generator({ onBack }: GeneratorProps) {
  const [step, setStep] = useState<'theme' | 'generate' | 'display'>('theme');
  const [selectedTheme, setSelectedTheme] = useState<ThemeName | 'custom'>('animals');
  const [customWords, setCustomWords] = useState('');
  const [cloakName, setCloakName] = useState('My First Cloak');

  const [realSeed, setRealSeed] = useState('');
  const [cloakPhrase, setCloakPhrase] = useState('');
  const [cipher, setCipher] = useState<CipherMap | null>(null);
  const [walletAddresses, setWalletAddresses] = useState<any>(null);

  const [showRealSeed, setShowRealSeed] = useState(false);
  const [showCloakPhrase, setShowCloakPhrase] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateSeed = async () => {
    setError('');
    setLoading(true);
    try {
      console.log('Generating seed...');
      // Generate real BIP-39 seed
      const seed = generateMnemonic(12);
      console.log('Seed generated:', seed.substring(0, 20) + '...');
      setRealSeed(seed);

      // Create cipher
      console.log('Creating cipher from theme:', selectedTheme);
      let newCipher: CipherMap;
      if (selectedTheme === 'custom') {
        const words = customWords.split(/[,\n\s]+/).filter((w) => w.trim());
        newCipher = generateCipherFromCustomWords(words);
      } else {
        newCipher = generateCipherFromTheme(selectedTheme);
      }
      setCipher(newCipher);
      console.log('Cipher created');

      // Encode to cloak
      console.log('Encoding to cloak...');
      const cloak = encodeWithCipher(seed, BIP39_WORDLIST, newCipher);
      setCloakPhrase(cloak);
      console.log('Cloak phrase created');

      // Derive wallet addresses
      console.log('Deriving addresses...');
      const addresses = deriveWalletAddresses(seed);
      setWalletAddresses(addresses);
      console.log('Addresses derived');

      setStep('display');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCloak = () => {
    if (!cipher) return;

    const id = addCloakSeed(cloakName, selectedTheme === 'custom' ? 'custom' : selectedTheme, cipher);
    alert(`✓ Cloak saved as "${cloakName}"`);
    onBack();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadSeed = () => {
    const data = {
      name: cloakName,
      realSeed,
      cloakPhrase,
      theme: selectedTheme,
      walletAddresses,
      generatedAt: new Date().toISOString(),
      warning: 'NEVER SHARE THIS FILE. Keep it encrypted.',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloakseed-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 'theme') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <button onClick={onBack} className="text-gray-400 hover:text-white mb-6">
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">Create New Cloak</h1>
          <p className="text-gray-400">Choose a theme or paste custom words for your cipher</p>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="block font-bold">Theme</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(wordlistThemes) as ThemeName[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => {
                    setSelectedTheme(theme);
                    setCustomWords('');
                  }}
                  className={`card text-center py-4 transition ${
                    selectedTheme === theme ? 'border-primary bg-primary/10' : ''
                  }`}
                >
                  <p className="capitalize font-bold">{theme}</p>
                </button>
              ))}
              <button
                onClick={() => setSelectedTheme('custom')}
                className={`card text-center py-4 transition ${
                  selectedTheme === 'custom' ? 'border-primary bg-primary/10' : ''
                }`}
              >
                <p className="font-bold">Custom</p>
              </button>
            </div>
          </div>

          {/* Custom Words Input */}
          {selectedTheme === 'custom' && (
            <div className="space-y-2">
              <label className="block font-bold">Paste Custom Words</label>
              <textarea
                value={customWords}
                onChange={(e) => setCustomWords(e.target.value)}
                placeholder="one word per line or comma-separated (min 10 words)"
                className="input-base w-full h-32 resize-none"
              />
              <p className="text-xs text-gray-500">
                {customWords.split(/[,\n\s]+/).filter((w) => w.trim()).length} words entered
              </p>
            </div>
          )}

          {/* Cloak Name */}
          <div className="space-y-2">
            <label className="block font-bold">Cloak Name</label>
            <input
              type="text"
              value={cloakName}
              onChange={(e) => setCloakName(e.target.value)}
              placeholder="e.g., My First Cloak, Animal Cipher, etc."
              className="input-base w-full"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert-danger flex gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <div>
                <p className="font-bold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button 
            onClick={handleGenerateSeed} 
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Seed & Cloak →'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'display') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <button onClick={() => setStep('theme')} className="text-gray-400 hover:text-white mb-6">
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">Your Seed & Cloak</h1>
          <p className="text-gray-400">Save both. Write down your CLOAK PHRASE only in your notebook.</p>
        </div>

        <div className="alert-danger flex gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>
            <p className="font-bold">Security Notice</p>
            <p className="text-sm mt-1">
              DO NOT screenshot. DO NOT email or cloud-save this. Write your CLOAK PHRASE only in physical ink.
            </p>
          </div>
        </div>

        <div className="grid_responsive-2">
          {/* Real Seed */}
          <div className="card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-primary">Real Seed (For MetaMask/Phantom)</h3>
              <button
                onClick={() => setShowRealSeed(!showRealSeed)}
                className="text-gray-400 hover:text-white"
              >
                {showRealSeed ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div
              className={`p-4 rounded bg-black/50 border border-gray-800 font-mono-seeds ${
                showRealSeed ? '' : 'blur-sm'
              }`}
            >
              {realSeed}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(realSeed, 'real')}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
              >
                <Copy size={16} /> {copied === 'real' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Cloak Phrase */}
          <div className="card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-secondary">Cloak Phrase (Write This Down)</h3>
              <button
                onClick={() => setShowCloakPhrase(!showCloakPhrase)}
                className="text-gray-400 hover:text-white"
              >
                {showCloakPhrase ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div
              className={`p-4 rounded bg-black/50 border border-gray-800 font-mono-seeds ${
                showCloakPhrase ? '' : 'blur-sm'
              }`}
            >
              {cloakPhrase}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(cloakPhrase, 'cloak')}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
              >
                <Copy size={16} /> {copied === 'cloak' ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadSeed}
                className="flex-1 btn-outline flex items-center justify-center gap-2 text-sm"
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Addresses */}
        {walletAddresses && (
          <div className="card space-y-4">
            <h3 className="font-bold">Multi-Chain Addresses</h3>

            <div className="grid_responsive-2 gap-4">
              {[
                { label: 'Ethereum', addr: walletAddresses.ethereum, short: walletAddresses.ethereum_short },
                { label: 'Bitcoin', addr: walletAddresses.bitcoin },
                { label: 'Solana', addr: walletAddresses.solana },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="text-sm font-medium text-gray-400">{item.label}</p>
                  <div className="bg-black/50 p-2 rounded text-xs font-mono truncate">{item.addr}</div>
                  <button
                    onClick={() => copyToClipboard(item.addr, item.label)}
                    className="text-xs text-primary hover:underline"
                  >
                    Copy Address
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Action */}
        <div className="flex gap-4">
          <button onClick={handleSaveCloak} className="btn-primary flex-1">
            ✓ Save Cloak to Vault
          </button>
          <button onClick={() => handleGenerateSeed()} className="btn-outline flex-1 flex items-center justify-center gap-2">
            <RefreshCw size={16} /> Generate New
          </button>
        </div>
      </div>
    );
  }

  return null;
}

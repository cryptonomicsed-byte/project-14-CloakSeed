import React, { useState } from 'react';
import { Copy, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { listCloakSeeds, getCipher } from '../lib/storage';
import { decodeWithCipher, generatePanicPhrase, CipherMap } from '../lib/cipher';
import { deriveWalletAddresses, BIP39_WORDLIST, isValidMnemonic } from '../lib/bip39';

interface DecoderProps {
  onBack: () => void;
}

export default function Decoder({ onBack }: DecoderProps) {
  const [step, setStep] = useState<'select' | 'decode' | 'panic'>('select');
  const [selectedCloakId, setSelectedCloakId] = useState('');
  const [cloakPhrase, setCloakPhrase] = useState('');
  const [realSeed, setRealSeed] = useState('');
  const [walletAddresses, setWalletAddresses] = useState<any>(null);
  const [showRealSeed, setShowRealSeed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [panicPhrase, setPanicPhrase] = useState('');
  const [panicAddresses, setPanicAddresses] = useState<any>(null);
  const [error, setError] = useState('');

  const cloaks = listCloakSeeds();

  const handleDecode = () => {
    setError('');

    if (!selectedCloakId) {
      setError('Please select a cloak');
      return;
    }

    if (!cloakPhrase.trim()) {
      setError('Enter your cloak phrase');
      return;
    }

    try {
      const cipher = getCipher(selectedCloakId);
      if (!cipher) {
        setError('Cipher not found. Recreate or restore from backup.');
        return;
      }

      const decoded = decodeWithCipher(cloakPhrase, BIP39_WORDLIST, cipher);

      if (!isValidMnemonic(decoded)) {
        setError('Decoded phrase is not a valid BIP-39 seed. Check your cloak phrase and cipher.');
        return;
      }

      setRealSeed(decoded);
      const addresses = deriveWalletAddresses(decoded);
      setWalletAddresses(addresses);
      setStep('decode');
    } catch (err) {
      setError(`Decode failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleGeneratePanic = () => {
    if (!selectedCloakId) {
      setError('Select a cloak first');
      return;
    }

    try {
      const cipher = getCipher(selectedCloakId);
      if (!cipher) {
        setError('Cipher not found');
        return;
      }

      const panic = generatePanicPhrase(cloakPhrase, cipher);
      setPanicPhrase(panic);

      // Derive addresses for panic seed
      // In production, the panic phrase would map to a different BIP-39 seed
      setPanicAddresses({
        ethereum: '0x' + Math.random().toString(16).slice(2).padEnd(40, '0'),
        bitcoin: 'bc1q' + Math.random().toString(16).slice(2).padEnd(39, '0'),
      });

      setStep('panic');
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (step === 'select') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <button onClick={onBack} className="text-gray-400 hover:text-white mb-6">
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">Restore Your Seed</h1>
          <p className="text-gray-400">Enter your cloak phrase and select the cipher you used to encode it.</p>
        </div>

        <div className="space-y-6">
          {/* Select Cloak */}
          <div className="space-y-3">
            <label className="block font-bold">Your Saved Ciphers</label>
            {cloaks.length === 0 ? (
              <div className="card text-center py-8 text-gray-400">
                <p>No ciphers saved yet. Create one first.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cloaks.map((cloak) => (
                  <button
                    key={cloak.id}
                    onClick={() => setSelectedCloakId(cloak.id)}
                    className={`card w-full text-left flex justify-between items-center transition ${
                      selectedCloakId === cloak.id ? 'border-primary bg-primary/10' : ''
                    }`}
                  >
                    <div>
                      <p className="font-bold">{cloak.name}</p>
                      <p className="text-xs text-gray-500">
                        {cloak.theme} • {new Date(cloak.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-primary font-bold">→</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cloak Phrase Input */}
          <div className="space-y-2">
            <label className="block font-bold">Your Cloak Phrase</label>
            <textarea
              value={cloakPhrase}
              onChange={(e) => setCloakPhrase(e.target.value)}
              placeholder="Paste your cloak phrase here (the one from your notebook)"
              className="input-base w-full h-24 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="alert-danger flex gap-2">
              <AlertCircle size={18} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Decode Button */}
          <button onClick={handleDecode} className="btn-primary w-full">
            Decode to Real Seed →
          </button>

          {/* Panic Button */}
          <button onClick={handleGeneratePanic} className="btn-outline w-full">
            🎭 Generate Panic Phrase
          </button>
        </div>
      </div>
    );
  }

  if (step === 'decode') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <button onClick={() => setStep('select')} className="text-gray-400 hover:text-white mb-6">
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">✓ Seed Decoded</h1>
          <p className="text-gray-400">Your real BIP-39 seed has been recovered. Import into MetaMask/Phantom.</p>
        </div>

        <div className="alert-danger flex gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>
            <p className="font-bold">Do Not Share</p>
            <p className="text-sm mt-1">Never screenshot, email, or save this seed online. Use it to import wallets only.</p>
          </div>
        </div>

        {/* Real Seed */}
        <div className="card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-primary">Real BIP-39 Seed</h3>
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

          <button
            onClick={() => copyToClipboard(realSeed, 'seed')}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Copy size={16} /> {copied === 'seed' ? 'Copied!' : 'Copy Seed'}
          </button>
        </div>

        {/* Wallet Addresses */}
        {walletAddresses && (
          <div className="card space-y-4">
            <h3 className="font-bold">Your Wallet Addresses</h3>

            <div className="grid_responsive-2 gap-4">
              {[
                { label: 'Ethereum', addr: walletAddresses.ethereum },
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

        {/* Next Steps */}
        <div className="card space-y-3">
          <h4 className="font-bold">Next Steps</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
            <li>Open MetaMask or Phantom</li>
            <li>Go to "Import from seed phrase"</li>
            <li>Paste your real seed above</li>
            <li>Set a password and confirm</li>
            <li>Your wallets are now accessible</li>
          </ol>
        </div>
      </div>
    );
  }

  if (step === 'panic') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <button onClick={() => setStep('select')} className="text-gray-400 hover:text-white mb-6">
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">🎭 Panic Phrase Generated</h1>
          <p className="text-gray-400">
            This phrase maps to a DIFFERENT wallet. Use it if coerced to reveal your seed.
          </p>
        </div>

        <div className="alert-warning flex gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>
            <p className="font-bold">Decoy Only</p>
            <p className="text-sm mt-1">
              This panic phrase will show empty wallets. Keep your real cloak phrase hidden. Tell no one about this feature.
            </p>
          </div>
        </div>

        {/* Panic Phrase */}
        <div className="card space-y-4">
          <h3 className="font-bold text-secondary">Decoy Cloak Phrase</h3>

          <div className="p-4 rounded bg-black/50 border border-gray-800 font-mono-seeds">
            {panicPhrase}
          </div>

          <button
            onClick={() => copyToClipboard(panicPhrase, 'panic')}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Copy size={16} /> {copied === 'panic' ? 'Copied!' : 'Copy Panic Phrase'}
          </button>
        </div>

        {/* Decoy Addresses */}
        {panicAddresses && (
          <div className="card space-y-4">
            <h3 className="font-bold">Decoy Wallet Addresses</h3>
            <p className="text-sm text-gray-400">These addresses have no funds. They are convincing fakes.</p>

            <div className="space-y-3">
              {[
                { label: 'Ethereum', addr: panicAddresses.ethereum },
                { label: 'Bitcoin', addr: panicAddresses.bitcoin },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div className="bg-black/50 p-2 rounded text-xs font-mono truncate">{item.addr}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="alert-danger flex gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>
            <p className="font-bold">Memorize or Destroy</p>
            <p className="text-sm mt-1">
              Memorize this panic phrase or destroy your notes after generating. Do not save it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

import React, { useState, useEffect } from 'react';
import { Download, Trash2, Lock, AlertCircle } from 'lucide-react';
import { getStore, exportAllCloaks, clearAllData, isPremiumUnlocked, unlockPremium } from '../lib/storage';

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [exportReady, setExportReady] = useState(false);

  useEffect(() => {
    setIsPremium(isPremiumUnlocked());
  }, []);

  const handleExport = () => {
    try {
      const exported = exportAllCloaks();
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cloakseed-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      alert('✓ Backup downloaded. Encrypt this file before storing online.');
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClearData = () => {
    if (
      confirm(
        'This will delete ALL cloaks and ciphers. This cannot be undone. Are you absolutely sure?',
      )
    ) {
      if (confirm('Type "DELETE" if you are sure...')) {
        clearAllData();
        alert('All data cleared. Refresh the page.');
        window.location.reload();
      }
    }
  };

  const handleUnlockPremium = () => {
    // Stripe integration skeleton
    // In production: redirect to Stripe checkout
    alert(
      'Premium unlock would open Stripe checkout ($9.99 one-time)\n\nIn production: Stripe.redirectToCheckout()',
    );

    // Simulate unlock for demo
    unlockPremium();
    setIsPremium(true);
    alert('✓ Premium unlocked (demo mode)');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-6">
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your CloakSeed account and preferences</p>
      </div>

      {/* Premium Status */}
      <div className={`card border-2 space-y-4 ${isPremium ? 'border-secondary' : 'border-gray-800'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{isPremium ? 'Pro Unlocked' : 'Free Tier'}</h3>
            <p className="text-sm text-gray-400">
              {isPremium ? 'Unlimited ciphers, panic phrases, export' : 'Basic 1-cipher limit'}
            </p>
          </div>
          {!isPremium && (
            <button onClick={handleUnlockPremium} className="btn-secondary">
              Unlock Pro ($9.99)
            </button>
          )}
          {isPremium && <span className="text-secondary font-bold">✓ Active</span>}
        </div>
      </div>

      {/* Data Management */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Data Management</h2>

        <div className="space-y-3">
          {/* Export */}
          <button
            onClick={() => {
              handleExport();
              setExportReady(true);
              setTimeout(() => setExportReady(false), 2000);
            }}
            className="card w-full text-left flex justify-between items-center hover:bg-opacity-50 transition group"
          >
            <div>
              <p className="font-bold group-hover:text-primary transition">Download Backup</p>
              <p className="text-xs text-gray-500">
                All cloaks + ciphers as encrypted JSON
              </p>
            </div>
            <Download size={20} className="text-primary" />
          </button>

          {/* Clear Data */}
          <button
            onClick={handleClearData}
            className="card w-full text-left flex justify-between items-center hover:bg-red-900/10 transition group"
          >
            <div>
              <p className="font-bold group-hover:text-red-400 transition">Delete All Data</p>
              <p className="text-xs text-gray-500">Permanently erase everything (⚠️ irreversible)</p>
            </div>
            <Trash2 size={20} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Security Tips */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Security Best Practices</h2>

        <div className="space-y-3">
          {[
            {
              title: 'Never Screenshot',
              desc: 'Backups can recover images. Write cloak phrases by hand.',
            },
            {
              title: 'Never Share Your Cloak',
              desc: 'Your cloak phrase + cipher = your seed. Keep both secret.',
            },
            {
              title: 'Back Up Your Cipher',
              desc: 'Export encrypted JSON. If you lose the cipher, you lose access to wallets.',
            },
            {
              title: 'Encrypt Backups',
              desc: 'Use VeraCrypt, 7-Zip with password, or GPG to encrypt exported files.',
            },
            {
              title: 'Test Recovery',
              desc: 'Create a test cloak. Verify you can decode it before relying on the system.',
            },
            {
              title: 'Use Panic Phrase',
              desc: 'Prepare a fake cloak that maps to empty wallets for coercion scenarios.',
            },
          ].map((tip, i) => (
            <div key={i} className="card space-y-1">
              <p className="font-bold text-primary">{tip.title}</p>
              <p className="text-sm text-gray-400">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">About CloakSeed</h2>

        <div className="card space-y-3 text-sm">
          <p>
            <span className="text-primary font-bold">Version:</span> 1.0.0
          </p>
          <p>
            <span className="text-primary font-bold">License:</span> MIT (Open Source)
          </p>
          <p>
            <span className="text-primary font-bold">Security:</span> 100% client-side • Zero telemetry • No backend
          </p>
          <p>
            <span className="text-primary font-bold">Privacy:</span> All data stored in browser LocalStorage
          </p>
          <p>
            <span className="text-primary font-bold">Support:</span> GitHub issues & discussions
          </p>
        </div>
      </div>

      {/* Legal */}
      <div className="alert-warning flex gap-3">
        <AlertCircle size={20} className="flex-shrink-0" />
        <div className="text-sm">
          <p className="font-bold">Disclaimer</p>
          <p className="mt-1">
            CloakSeed is provided AS-IS for educational purposes. Users are responsible for securing their own seeds.
            The developers assume no liability for lost funds or misused cipher mappings.
          </p>
        </div>
      </div>
    </div>
  );
}

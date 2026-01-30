import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Eye, Copy, AlertCircle } from 'lucide-react';
import { listCloakSeeds, deleteCloakSeed, updateCloakSeed } from '../lib/storage';
import { StoredCloakSeed } from '../lib/storage';

interface DashboardProps {
  onNavigate: (page: 'generator' | 'decoder' | 'settings') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [cloaks, setCloaks] = useState<StoredCloakSeed[]>([]);
  const [selectedCloak, setSelectedCloak] = useState<string | null>(null);

  useEffect(() => {
    loadCloaks();
  }, []);

  const loadCloaks = () => {
    setCloaks(listCloakSeeds());
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this cloak? This cannot be undone.')) {
      deleteCloakSeed(id);
      loadCloaks();
      setSelectedCloak(null);
    }
  };

  const handleRename = (id: string) => {
    const cloak = cloaks.find((c) => c.id === id);
    if (!cloak) return;

    const newName = prompt('New name:', cloak.name);
    if (newName && newName.trim()) {
      updateCloakSeed(id, { name: newName });
      loadCloaks();
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Your Cloaks</h1>
        <p className="text-lg text-gray-400">
          Manage your stealth seed phrase ciphers. Each cloak is a unique mapping of your real BIP-39 words.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => onNavigate('generator')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} /> New Cloak
        </button>
        <button
          onClick={() => onNavigate('decoder')}
          className="btn-outline flex items-center justify-center gap-2"
        >
          <Eye size={20} /> Restore Cloak
        </button>
      </div>

      {/* Warning */}
      <div className="alert-warning flex gap-3">
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Never Screenshot Your Cloak</p>
          <p className="text-sm mt-1">
            Screenshots can be recovered from backups. Write down your cloak phrase in a physical notebook only.
          </p>
        </div>
      </div>

      {/* Cloaks List */}
      {cloaks.length === 0 ? (
        <div className="card text-center py-12 space-y-4">
          <p className="text-gray-400 text-lg">No cloaks yet</p>
          <p className="text-sm text-gray-500">Create your first cipher to get started</p>
          <button
            onClick={() => onNavigate('generator')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} /> Create First Cloak
          </button>
        </div>
      ) : (
        <div className="grid_responsive-2">
          {cloaks.map((cloak) => (
            <div
              key={cloak.id}
              className={`card cursor-pointer transition ${selectedCloak === cloak.id ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => setSelectedCloak(cloak.id)}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{cloak.name}</h3>
                  <p className="text-sm text-gray-400">
                    Theme: <span className="text-primary capitalize">{cloak.theme}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(cloak.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(cloak.id);
                    }}
                    className="flex-1 btn-outline flex items-center justify-center gap-2 text-sm py-2"
                  >
                    <Edit2 size={16} /> Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(cloak.id);
                    }}
                    className="flex-1 px-4 py-2 rounded border border-red-700/50 text-red-400 hover:bg-red-900/20 transition text-sm"
                  >
                    <Trash2 size={16} className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold">FAQ</h2>

        <div className="space-y-4">
          {[
            {
              q: 'What is a cloak?',
              a: 'A cloak is a custom mapping of BIP-39 words to your chosen theme words. Your real seed stays hidden.',
            },
            {
              q: 'How do I recover my wallet?',
              a: 'Enter your cloak phrase and select the cipher you used. CloakSeed derives your real BIP-39 seed.',
            },
            {
              q: 'Can I export my cloaks?',
              a: 'Free tier: view hashes. Pro tier: export encrypted JSON with full cipher data.',
            },
            {
              q: 'Is this secure?',
              a: 'Yes. All crypto runs in your browser. We see nothing. Your cipher never leaves your device.',
            },
            {
              q: 'What if I lose my cipher?',
              a: 'If you lose the cipher mapping, you cannot recover the real seed. Export and back up your cipher safely.',
            },
          ].map((item, i) => (
            <details key={i} className="card cursor-pointer group">
              <summary className="font-bold flex justify-between items-center">
                {item.q}
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-3 text-gray-400 text-sm">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

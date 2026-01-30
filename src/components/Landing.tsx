import React from 'react';
import { Lock, Shield, Zap, BookOpen, Download, Lightbulb } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
}

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="space-y-20 py-20">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="block mb-4">Turn your seed phrase</span>
            <span className="gradient-text">into a love poem</span>
            <span className="block mt-4">no thief will ever understand</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            CloakSeed lets you encode your BIP-39 seed into custom words using any theme. Your real wallet stays hidden behind a layer of stealth.
          </p>
        </div>

        <button onClick={onEnter} className="btn-primary text-lg h-14 px-8">
          Launch CloakSeed →
        </button>

        <div className="text-red-400 text-sm font-medium">
          ⚠️ Never screenshot. Never share online. This is your financial key.
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-12">
        <h2 className="text-4xl font-bold text-center">How It Works</h2>

        <div className="grid-responsive-3">
          {[
            {
              icon: Shield,
              title: 'Create Your Cipher',
              desc: 'Choose a theme (animals, colors, food, fantasy, nonsense) or upload custom words. You now have 2,048 custom words.',
            },
            {
              icon: Zap,
              title: 'Generate Real Seed',
              desc: 'CloakSeed generates a standard BIP-39 seed phrase that imports into MetaMask, Phantom, Ledger, etc.',
            },
            {
              icon: Lock,
              title: 'Encode to Cloak',
              desc: 'Your real seed is mapped through your cipher. "abandon able" becomes "fluff spark" (or your words).',
            },
            {
              icon: BookOpen,
              title: 'Write Down Cloak',
              desc: 'Only write the cloak phrase in your notebook. Anyone reading it sees gibberish. You hold the key.',
            },
            {
              icon: Download,
              title: 'Import Real Seed',
              desc: 'Paste your real seed into MetaMask/Phantom. Your wallets are live and funded. No one knows your cloak.',
            },
            {
              icon: Lightbulb,
              title: 'Recovery is Easy',
              desc: 'Paste cloak + load cipher = see real seed. Zero cloud, zero backups needed. Pure client-side magic.',
            },
          ].map((step, i) => (
            <div key={i} className="card space-y-4">
              <step.icon size={32} className="text-primary" />
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-12">
        <h2 className="text-4xl font-bold text-center">Unmatched Security</h2>

        <div className="grid_responsive_2 max-w-4xl mx-auto">
          {[
            {
              title: '100% Client-Side',
              desc: 'All crypto runs in your browser. No backend. No servers. No one sees your data.',
            },
            {
              title: 'Zero Telemetry',
              desc: 'We track nothing. No analytics, no cookies, no third-party scripts. Pure privacy.',
            },
            {
              title: '5 Themes Included',
              desc: 'Animals, colors, food, fantasy, nonsense. Or paste your own 2,048 words.',
            },
            {
              title: 'Panic Phrase',
              desc: 'Generate a fake cloak that maps to a different seed. Give attackers a dummy wallet.',
            },
            {
              title: 'Export Encrypted',
              desc: 'Download your cipher as encrypted JSON. Password-protect it. Backup anywhere.',
            },
            {
              title: 'Multi-Chain',
              desc: 'One seed, all chains: Ethereum, Bitcoin, Solana. Standard BIP-39 compatibility.',
            },
          ].map((feature, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-lg font-bold text-primary">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-12">
        <h2 className="text-4xl font-bold text-center">Freemium Model</h2>

        <div className="grid_responsive_2 max-w-4xl mx-auto">
          {/* Free */}
          <div className="card space-y-6">
            <h3 className="text-2xl font-bold">Free</h3>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span> 5 preloaded themes
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span> Generate 1 cipher
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span> View real seed
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-500">✗</span> Unlimited ciphers
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-500">✗</span> Panic phrases
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-500">✗</span> Export encrypted
              </p>
            </div>
            <button className="btn-outline w-full">Stay Free</button>
          </div>

          {/* Pro */}
          <div className="card space-y-6 border-secondary/50 bg-gradient-to-br from-secondary/10 to-transparent">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-secondary">One-time $9.99</p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="text-secondary">✓</span> Everything in Free
              </p>
              <p className="flex items-center gap-2">
                <span className="text-secondary">✓</span> Unlimited ciphers
              </p>
              <p className="flex items-center gap-2">
                <span className="text-secondary">✓</span> Custom themes
              </p>
              <p className="flex items-center gap-2">
                <span className="text-secondary">✓</span> Panic phrases
              </p>
              <p className="flex items-center gap-2">
                <span className="text-secondary">✓</span> Export encrypted
              </p>
              <p className="flex items-center gap-2">
                <span className="text-secondary">✓</span> Offline PWA
              </p>
            </div>
            <button className="btn-secondary w-full">Unlock Pro (Stripe)</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to Cloak Your Seed?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          No signup. No download required. 100% private. Start now.
        </p>
        <button onClick={onEnter} className="btn-primary text-lg h-14 px-12">
          Enter Dashboard →
        </button>
      </section>
    </div>
  );
}

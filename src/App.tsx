import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getStore, setTheme } from './lib/storage';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import Decoder from './components/Decoder';
import Settings from './components/Settings';
import './App.css';

type Page = 'landing' | 'dashboard' | 'generator' | 'decoder' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const store = getStore();
    setIsDark(store.theme === 'dark');
    document.documentElement.classList.toggle('dark', store.theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
      {/* Header */}
      <header className={`border-b ${isDark ? 'border-gray-800 bg-darker' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigateTo('dashboard')}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            🔐 CloakSeed
          </button>

          <nav className="flex items-center gap-4">
            {currentPage !== 'landing' && (
              <>
                <button
                  onClick={() => navigateTo('dashboard')}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    currentPage === 'dashboard'
                      ? `${isDark ? 'bg-primary text-white' : 'bg-primary text-white'}`
                      : `${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo('settings')}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    currentPage === 'settings'
                      ? `${isDark ? 'bg-primary text-white' : 'bg-primary text-white'}`
                      : `${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`
                  }`}
                >
                  Settings
                </button>
              </>
            )}

            <button
              onClick={toggleTheme}
              className={`p-2 rounded transition ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentPage === 'landing' && <Landing onEnter={() => navigateTo('dashboard')} />}
        {currentPage === 'dashboard' && <Dashboard onNavigate={navigateTo} />}
        {currentPage === 'generator' && <Generator onBack={() => navigateTo('dashboard')} />}
        {currentPage === 'decoder' && <Decoder onBack={() => navigateTo('dashboard')} />}
        {currentPage === 'settings' && <Settings onBack={() => navigateTo('dashboard')} />}
      </main>

      {/* Footer */}
      <footer className={`mt-16 py-8 border-t ${isDark ? 'border-gray-800 bg-darker' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>CloakSeed © 2024 — 100% Client-Side • Zero Telemetry • MIT License</p>
          <p className="mt-2 text-xs">⚠️ Never screenshot. Never share your cloak phrase online.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

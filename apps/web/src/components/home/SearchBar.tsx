'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

type SearchEngine = 'google' | 'bing' | 'duckduckgo';

interface EngineConfig {
  id: SearchEngine;
  label: string;
  url: string;
}

const engines: EngineConfig[] = [
  { id: 'google', label: 'G', url: 'https://www.google.com/search?q=' },
  { id: 'bing', label: 'B', url: 'https://www.bing.com/search?q=' },
  { id: 'duckduckgo', label: 'D', url: 'https://duckduckgo.com/?q=' },
];

const SearchBar: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<SearchEngine>('google');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('preferred_search_engine') as SearchEngine;
    if (saved && engines.some(e => e.id === saved)) {
      setActiveEngine(saved);
    }
  }, []);

  const handleEngineChange = (engineId: SearchEngine) => {
    setActiveEngine(engineId);
    localStorage.setItem('preferred_search_engine', engineId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const engine = engines.find(e => e.id === activeEngine);
    if (engine) {
      window.open(`${engine.url}${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div className="max-w-[500px] mx-auto mb-6">
      <form 
        onSubmit={handleSearch}
        className="flex items-center gap-2 bg-white/78 backdrop-blur-[20px] border border-glass rounded-2xl px-4 py-[10px] shadow-card focus-within:ring-4 focus-within:ring-accent-blue/15 transition-all"
      >
        <Search className="w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search the web…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted"
        />
        <div className="flex gap-1">
          {engines.map((engine) => (
            <button
              key={engine.id}
              type="button"
              onClick={() => handleEngineChange(engine.id)}
              className={`w-[26px] h-[26px] rounded-lg border flex items-center justify-center text-xs font-semibold transition-all ${
                activeEngine === engine.id
                  ? 'bg-accent-blue-soft border-accent-blue/25 text-[#2563eb]'
                  : 'bg-black/5 border-black/10 text-text-secondary hover:bg-black/10'
              }`}
            >
              {engine.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

'use client';

import React from 'react';
import PersonalizationHeader, { WidgetChips } from './PersonalizationHeader';
import SearchBar from './SearchBar';
import AppGrid from './AppGrid';

const mockApps = [
  {
    title: "Self-hosted",
    apps: [
      { id: "1", name: "AgentHub", icon: "🤖", subtitle: ":3000", colorClass: "bg-gradient-to-br from-accent-blue/15 to-accent-purple/15 border-accent-blue/15" },
      { id: "2", name: "Portainer", icon: "🗄", subtitle: ":9000", colorClass: "bg-gradient-to-br from-accent-green/12 to-accent-green/12 border-accent-green/15" },
      { id: "3", name: "Grafana", icon: "📊", subtitle: ":3001", colorClass: "bg-gradient-to-br from-accent-amber/12 to-accent-amber/12 border-accent-amber/15" },
      { id: "4", name: "Nginx PM", icon: "🔗", subtitle: ":81", colorClass: "bg-gradient-to-br from-[#14b8a61f] to-[#5eead41f] border-[#14b8a626]" },
      { id: "5", name: "Firewall", icon: "🛡", subtitle: "UFW", colorClass: "bg-gradient-to-br from-accent-red/10 to-accent-red/10 border-accent-red/12" },
      { id: "6", name: "pgAdmin", icon: "💾", subtitle: ":5050", colorClass: "bg-gradient-to-br from-accent-purple/12 to-accent-purple/12 border-accent-purple/15" },
    ]
  },
  {
    title: "AI Services",
    apps: [
      { id: "7", name: "Claude", icon: "AI", subtitle: "claude.ai", colorClass: "bg-gradient-to-br from-accent-purple/12 to-accent-purple/12 border-accent-purple/15 font-bold text-sm" },
      { id: "8", name: "ChatGPT", icon: "GP", subtitle: "openai.com", colorClass: "bg-gradient-to-br from-accent-blue/15 to-accent-blue/15 border-accent-blue/15 font-bold text-sm" },
      { id: "9", name: "Gemini", icon: "✦", subtitle: "gemini.ai", colorClass: "bg-gradient-to-br from-[#14b8a61f] to-[#5eead41f] border-[#14b8a626]" },
      { id: "10", name: "Perplexity", icon: "⚡", subtitle: "perplexity.ai", colorClass: "bg-gradient-to-br from-accent-amber/12 to-accent-amber/12 border-accent-amber/15" },
    ]
  },
  {
    title: "Dev tools",
    apps: [
      { id: "11", name: "GitHub", icon: "⌥", subtitle: "github.com", colorClass: "bg-gradient-to-br from-accent-blue/15 to-accent-blue/15 border-accent-blue/15" },
      { id: "12", name: "Vercel", icon: "▦", subtitle: "vercel.com", colorClass: "bg-gradient-to-br from-accent-amber/12 to-accent-amber/12 border-accent-amber/15" },
      { id: "13", name: "Cloudflare", icon: "◎", subtitle: "dash.cf", colorClass: "bg-gradient-to-br from-[#14b8a61f] to-[#5eead41f] border-[#14b8a626]" },
      { id: "14", name: "HuggingFace", icon: "◈", subtitle: "hf.co", colorClass: "bg-gradient-to-br from-accent-green/12 to-accent-green/12 border-accent-green/15" },
    ]
  }
];

const HomeDashboard: React.FC = () => {
  return (
    <div className="flex-1 p-5 overflow-auto">
      <div id="panel-home">
        <PersonalizationHeader />
        <WidgetChips />
        <SearchBar />
        <AppGrid initialCategories={mockApps} />
      </div>
    </div>
  );
};

export default HomeDashboard;

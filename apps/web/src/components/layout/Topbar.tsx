'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { usePanelStore } from '@/store/panelStore';
import { useAuthStore } from '@/store/authStore';
import { Menu } from 'lucide-react';

const navItems = [
  { id: 'nas', label: 'NAS', icon: '⚡' },
  { id: 'drive', label: 'CloudDrive', icon: '☁' },
  { id: 'home', label: 'HomePage', icon: '◈' },
  { id: 'terminal', label: 'Terminal', icon: '▸' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
] as const;

export const Topbar = () => {
  const { user } = useAuthStore();
  const { activePanel, setActivePanel, setSidebarOpen } = usePanelStore();

  return (
    <div className="h-[56px] px-4 md:px-5 flex items-center bg-white/65 backdrop-blur-3xl saturate-[180%] border-b border-glass sticky top-0 z-[100] shadow-top shadow-sm">
      <button 
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 mr-2 text-text-secondary hover:text-text-primary"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 mr-4 md:mr-7">
        <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-[#60a5fa] to-[#818cf8] flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.35)]">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 16 16">
            <path d="M3 3h4v4H3zm6 0h4v4h-4zM3 9h4v4H3zm6 2h1v2h-1zm2 0h1v2h-1z" />
          </svg>
        </div>
        <div className="text-[15px] font-semibold text-text-primary tracking-tight hidden sm:block">
          Mark<span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">OS</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1 flex-1">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePanel(item.id)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-[20px] cursor-pointer text-[13px] font-medium transition-all duration-200 border border-transparent",
              activePanel === item.id
                ? "bg-white/85 border-border-subtle text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.9)_inset]"
                : "text-text-secondary hover:bg-black/5 hover:text-text-primary"
            )}
          >
            <span className="text-sm">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 ml-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] bg-accent-green-soft border border-accent-green/20 text-[11px] font-medium text-[#059669]">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          Online · 23ms
        </div>
        <div 
          onClick={() => setActivePanel('settings')}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#818cf8] to-[#60a5fa] flex items-center justify-center text-[13px] font-semibold text-white cursor-pointer shadow-[0_2px_8px_rgba(99,102,241,0.3)]"
        >
          {user?.avatar || 'M'}
        </div>
      </div>
    </div>
  );
};

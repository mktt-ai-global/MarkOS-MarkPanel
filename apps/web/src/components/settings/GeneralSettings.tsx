'use client';

import React from 'react';
import { GlassCard } from '../layout/GlassCard';

export const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <section>
        <div className="text-sm font-semibold text-text-primary mb-3">Language & Region</div>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-medium text-text-primary">System Language</div>
              <div className="text-[12px] text-text-muted">Select your preferred language</div>
            </div>
            <select className="bg-black/5 border border-border-subtle rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-accent-blue/20">
              <option value="en">English (US)</option>
              <option value="zh">简体中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </GlassCard>
      </section>

      <section>
        <div className="text-sm font-semibold text-text-primary mb-3">Appearance</div>
        <GlassCard className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption id="frosted" label="Frosted" active />
            <ThemeOption id="light" label="Light" />
            <ThemeOption id="dark" label="Dark" />
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

const ThemeOption = ({ id, label, active = false }: { id: string, label: string, active?: boolean }) => (
  <div className={`cursor-pointer rounded-xl p-3 border-2 transition-all ${active ? 'border-accent-blue bg-accent-blue/5' : 'border-transparent bg-black/5 hover:bg-black/10'}`}>
    <div className={`h-16 rounded-md mb-2 ${id === 'dark' ? 'bg-[#1a1a2e]' : id === 'light' ? 'bg-white' : 'bg-white/40 backdrop-blur-md'}`} />
    <div className="text-xs font-medium text-center text-text-primary">{label}</div>
  </div>
);

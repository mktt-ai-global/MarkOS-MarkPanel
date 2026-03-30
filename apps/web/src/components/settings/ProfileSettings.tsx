'use client';

import React from 'react';
import { GlassCard } from '../layout/GlassCard';

export const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      <section>
        <div className="text-sm font-semibold text-text-primary mb-3">Account Information</div>
        <GlassCard className="p-5">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#818cf8] to-[#60a5fa] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              M
            </div>
            <div>
              <button className="px-4 py-1.5 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Change Avatar
              </button>
              <div className="text-xs text-text-muted mt-2">JPG, GIF or PNG. Max size of 800K</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Display Name</label>
              <input 
                type="text" 
                defaultValue="Mark" 
                className="w-full bg-black/5 border border-border-subtle rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-blue/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Email Address</label>
              <input 
                type="email" 
                defaultValue="mark@example.com" 
                className="w-full bg-black/5 border border-border-subtle rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-blue/20"
              />
            </div>
          </div>
        </GlassCard>
      </section>

      <section>
        <div className="text-sm font-semibold text-text-primary mb-3">Security & Tokens</div>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-medium text-text-primary">API Token Refresh</div>
              <div className="text-[12px] text-text-muted">Automatically refresh session token</div>
            </div>
            <div className="w-10 h-5 bg-accent-blue rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <button className="w-full py-2 bg-black/5 hover:bg-black/10 text-text-primary rounded-lg text-sm font-medium transition-colors border border-border-subtle">
            Revoke All Sessions
          </button>
        </GlassCard>
      </section>
    </div>
  );
};

'use client';

import React from 'react';
import { GlassCard } from '../layout/GlassCard';

export const AboutSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center py-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#818cf8] flex items-center justify-center shadow-xl mb-4">
          <svg className="w-10 h-10 fill-white" viewBox="0 0 16 16">
            <path d="M3 3h4v4H3zm6 0h4v4h-4zM3 9h4v4H3zm6 2h1v2h-1zm2 0h1v2h-1z" />
          </svg>
        </div>
        <div className="text-xl font-bold text-text-primary">MarkOS MarkPanel</div>
        <div className="text-sm text-text-muted">Version 2.1.0-frosted</div>
      </div>

      <GlassCard className="divide-y divide-black/5">
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">Release Channel</span>
          <span className="text-xs bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded-full font-medium">Stable</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">Check for Updates</span>
          <button className="text-xs text-accent-blue hover:underline font-medium">Up to date</button>
        </div>
        <div className="p-4">
          <div className="text-sm font-medium text-text-primary mb-2">Open Source License</div>
          <div className="text-xs text-text-muted leading-relaxed">
            Licensed under the MIT License. MarkOS and the MarkOS logo are trademarks of the MarkOS Project.
          </div>
        </div>
      </GlassCard>

      <div className="text-center">
        <div className="text-[11px] text-text-muted">© 2026 MarkOS Project. Made with ♥ for the self-hosted community.</div>
      </div>
    </div>
  );
};

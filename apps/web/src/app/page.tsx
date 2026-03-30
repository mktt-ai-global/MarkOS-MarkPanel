'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/layout/GlassCard';
import { usePanelStore } from '@/store/panelStore';

// Dynamic imports to avoid SSR issues with browser-only libraries (xterm.js, dnd-kit, etc.)
const Terminal = dynamic(() => import('@/components/terminal/Terminal').then(mod => mod.Terminal), { ssr: false });
const DockerPanel = dynamic(() => import('@/components/terminal/DockerPanel').then(mod => mod.DockerPanel), { ssr: false });
const SettingsLayout = dynamic(() => import('@/components/settings/SettingsLayout').then(mod => mod.SettingsLayout), { ssr: false });

export default function Home() {
  const { activePanel, activeNasSubPanel } = usePanelStore();

  if (activePanel === 'settings') {
    return <SettingsLayout />;
  }

  if (activePanel === 'terminal') {
    return (
      <div className="h-full flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">Terminal — vps-01</h1>
            <p className="text-[13px] text-text-muted mt-0.5">SSH · mark@123.45.67.89 · bash</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3.5 py-1.5 rounded-xl text-[13px] font-medium bg-white/70 border border-border-subtle shadow-sm hover:bg-white/90 transition-all">
              ⊕ New Tab
            </button>
            <button className="px-3.5 py-1.5 rounded-xl text-[13px] font-medium bg-red-50 text-red-600 border border-red-100 shadow-sm hover:bg-red-100 transition-all">
              ✕ Disconnect
            </button>
          </div>
        </div>
        <Terminal />
      </div>
    );
  }

  if (activePanel === 'nas' && activeNasSubPanel === 'docker') {
    return <DockerPanel />;
  }

  // Default NAS Overview
  const stats = [
    { label: 'CPU Usage', value: '23%', sub: '8-core · 3.4 GHz', color: 'text-accent-blue', barColor: 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]', icon: '⚡', fill: 23 },
    { label: 'Memory', value: '6.2 GB', sub: 'of 16 GB · 39%', color: 'text-accent-green', barColor: 'bg-gradient-to-r from-[#10b981] to-[#34d399]', icon: '🧠', fill: 39 },
    { label: 'Disk I/O', value: '142 MB/s', sub: '↑48 ↓94 MB/s', color: 'text-accent-purple', barColor: 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]', icon: '💾', fill: 55 },
    { label: 'Network', value: '2.4 Gbps', sub: '↑800M ↓1.6G', color: 'text-accent-amber', barColor: 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]', icon: '🌐', fill: 60 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            {activePanel === 'nas' ? 'System Overview' : activePanel === 'drive' ? 'CloudDrive' : 'Dashboard'}
          </h1>
          <p className="text-[13px] text-text-muted mt-0.5">MARK-VPS-01 · Ubuntu 22.04 · Uptime 47d 12h</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-1.5 rounded-xl text-[13px] font-medium bg-white/70 border border-border-subtle shadow-sm hover:bg-white/90 transition-all">
            ↻ Refresh
          </button>
          <button className="px-3.5 py-1.5 rounded-xl text-[13px] font-medium bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            ⚡ Quick Actions
          </button>
        </div>
      </div>

      {activePanel === 'nas' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <GlassCard key={stat.label} className="p-4 relative overflow-hidden group">
                <div className="flex items-center justify-center w-[34px] h-[34px] rounded-xl bg-accent-blue-soft mb-2.5 text-base">
                  {stat.icon}
                </div>
                <div className="text-[11px] font-semibold text-text-muted tracking-[0.04em] uppercase mb-1">{stat.label}</div>
                <div className={`text-[22px] font-bold tracking-tight leading-none ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] text-text-muted mt-1.5">{stat.sub}</div>
                <div className="h-[3px] bg-black/5 rounded-full mt-2.5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${stat.barColor}`} style={{ width: `${stat.fill}%` }} />
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <GlassCard>
              <div className="flex items-center justify-between p-[14px_18px] border-b border-black/5">
                <span className="text-[14px] font-semibold text-text-primary">CPU History</span>
                <span className="text-[11px] text-accent-green font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                  Live
                </span>
              </div>
              <div className="p-4 pt-3 pb-4">
                 <div className="h-[72px] w-full bg-accent-blue/5 rounded-md flex items-center justify-center text-[11px] text-text-muted">
                   (Chart Visualization Placeholder)
                 </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between p-[14px_18px] border-b border-black/5">
                <span className="text-[14px] font-semibold text-text-primary">Disk Partitions</span>
                <button className="text-[11px] px-2.5 py-1 rounded-lg bg-white/70 border border-border-subtle shadow-sm hover:bg-white/90 transition-all">
                  Manage
                </button>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: '/dev/sda1', used: '215 / 500 GB', fill: 43, color: 'bg-accent-blue' },
                  { label: '/dev/sdb1', used: '710 GB / 1 TB · 71%', fill: 71, color: 'bg-accent-amber', textColor: 'text-accent-amber' },
                  { label: '/dev/sdc1', used: '360 GB / 2 TB', fill: 18, color: 'bg-accent-green' },
                ].map((disk) => (
                  <div key={disk.label}>
                    <div className="flex justify-between text-[12px] mb-1.5 font-medium">
                      <span>{disk.label}</span>
                      <span className={disk.textColor || 'text-text-muted'}>{disk.used}</span>
                    </div>
                    <div className="h-[5px] bg-black/5 rounded-full overflow-hidden">
                      <div className={`h-full ${disk.color} transition-all duration-1000`} style={{ width: `${disk.fill}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {activePanel === 'drive' && (
        <div className="glass rounded-2xl p-20 flex items-center justify-center text-slate-400">
          CloudDrive Panel Content (Phase 6)
        </div>
      )}

      {activePanel === 'home' && (
        <div className="glass rounded-2xl p-20 flex items-center justify-center text-slate-400">
          HomePage Panel Content (Phase 4)
        </div>
      )}
    </div>
  );
}

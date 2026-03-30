'use client';

import React from 'react';
import { Terminal, Command, List, Activity, Settings, Plus, Star } from 'lucide-react';

interface FavoriteCommand {
  label: string;
  cmd: string;
  icon?: React.ReactNode;
}

const FAVORITES: FavoriteCommand[] = [
  { label: 'System Overview', cmd: 'htop', icon: <Activity size={14} /> },
  { label: 'Docker Stats', cmd: 'docker stats', icon: <Activity size={14} /> },
  { label: 'Reload Nginx', cmd: 'sudo nginx -s reload', icon: <Settings size={14} /> },
  { label: 'PM2 Status', cmd: 'pm2 status', icon: <List size={14} /> },
  { label: 'Disk Usage', cmd: 'df -h', icon: <Activity size={14} /> },
];

interface TerminalSidebarProps {
  onCommand: (cmd: string) => void;
}

export const TerminalSidebar: React.FC<TerminalSidebarProps> = ({ onCommand }) => {
  return (
    <div className="w-64 glass rounded-2xl p-4 flex flex-col space-y-6 border border-white/20 shadow-xl overflow-y-auto max-h-full">
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Sessions</h3>
        <div className="space-y-1">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 cursor-pointer">
            <Terminal size={16} />
            <span className="text-sm font-medium truncate">vps-01 (main)</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-500/5 text-slate-500 transition-all cursor-pointer">
            <Terminal size={16} />
            <span className="text-sm font-medium truncate">vps-02 (backup)</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-500/5 text-slate-500 transition-all border border-dashed border-slate-300 cursor-pointer mt-2 group">
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
            <span className="text-sm font-medium">New Session</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Favorites</h3>
          <Star size={12} className="text-amber-400 fill-amber-400" />
        </div>
        <div className="space-y-1">
          {FAVORITES.map((fav, i) => (
            <div 
              key={i} 
              onClick={() => onCommand(fav.cmd)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-500/5 text-slate-600 hover:text-blue-600 transition-all cursor-pointer group"
            >
              <div className="w-6 flex justify-center text-slate-400 group-hover:text-blue-500">
                {fav.icon || <Command size={14} />}
              </div>
              <span className="text-sm font-medium">{fav.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200/50">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-tight mb-1">Tip</p>
          <p className="text-[11px] text-slate-500 leading-normal">
            Press <kbd className="bg-white px-1 border border-slate-200 rounded">Enter</kbd> to execute commands immediately after selection.
          </p>
        </div>
      </div>
    </div>
  );
};

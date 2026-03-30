'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Maximize2, RotateCcw, Search, Download } from 'lucide-react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  containerName: string;
}

export const LogModal: React.FC<LogModalProps> = ({ isOpen, onClose, containerName }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: false,
      fontSize: 12,
      fontFamily: '"Fira Code", monospace',
      theme: {
        background: '#0f172a',
        foreground: '#e2e8f0',
      },
      disableStdin: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Simulate logs
    setLoading(true);
    term.writeln(`\x1b[90mConnecting to log stream for ${containerName}...\x1b[0m`);
    
    const interval = setInterval(() => {
      const timestamp = new Date().toISOString();
      const logs = [
        `[${timestamp}] INFO: Request received - GET /api/v1/health`,
        `[${timestamp}] DEBUG: Processing task 472b-a91c`,
        `[${timestamp}] INFO: Database query executed in 12ms`,
        `[${timestamp}] WARN: Memory usage peaking at 85%`,
      ];
      term.writeln(logs[Math.floor(Math.random() * logs.length)]);
    }, 1000);

    setLoading(false);

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      term.dispose();
    };
  }, [isOpen, containerName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-5xl h-full max-h-[800px] glass rounded-3xl overflow-hidden flex flex-col border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 bg-slate-800 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Search size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{containerName} Logs</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Real-time Stream</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Copy Logs">
              <Copy size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Download">
              <Download size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Restart Stream">
              <RotateCcw size={18} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-2" />
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-[#0f172a] p-4 relative overflow-hidden group">
           <div ref={terminalRef} className="h-full w-full" />
           {loading && (
             <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                   <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                   <p className="text-sm text-slate-400 font-medium">Attaching to container...</p>
                </div>
             </div>
           )}
           <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                <Maximize2 size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

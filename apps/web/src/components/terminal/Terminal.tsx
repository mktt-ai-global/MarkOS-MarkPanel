'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';
import 'xterm/css/xterm.css';
import { TerminalSidebar } from './TerminalSidebar';

interface TerminalProps {
  socketUrl?: string;
  readOnly?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ 
  socketUrl = `ws://${typeof window !== 'undefined' ? window.location.host : ''}/ws/terminal`,
  readOnly = false 
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: '"Fira Code", monospace',
      theme: {
        background: 'rgba(15, 23, 42, 0.82)',
        foreground: '#e2e8f0',
        cursor: '#60a5fa',
        selectionBackground: 'rgba(148, 163, 184, 0.3)',
        black: '#1e293b',
        red: '#f43f5e',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#8b5cf6',
        cyan: '#06b6d4',
        white: '#f8fafc',
      },
      allowProposedApi: true,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    try {
      const webglAddon = new WebglAddon();
      term.loadAddon(webglAddon);
    } catch (e) {
      console.warn('WebGL addon could not be loaded, falling back to canvas', e);
    }

    term.open(terminalRef.current);
    
    // Slight delay to ensure dimensions are ready
    setTimeout(() => {
      fitAddon.fit();
      if (!readOnly && wsRef.current?.readyState === WebSocket.OPEN) {
        const dims = fitAddon.proposeDimensions();
        if (dims) {
          wsRef.current.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }));
        }
      }
    }, 100);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    if (!readOnly) {
      const socket = new WebSocket(socketUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        term.writeln('\x1b[32mConnected to terminal server.\x1b[0m');
        // Initial resize
        const dims = fitAddon.proposeDimensions();
        if (dims) {
          socket.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }));
        }
      };

      socket.onmessage = (event) => {
        term.write(event.data);
      };

      socket.onclose = () => {
        term.writeln('\x1b[31mDisconnected from terminal server.\x1b[0m');
      };

      term.onData((data) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'input', data }));
        }
      });
    }

    const handleResize = () => {
      fitAddon.fit();
      const dims = fitAddon.proposeDimensions();
      if (wsRef.current?.readyState === WebSocket.OPEN && dims) {
        wsRef.current.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }));
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      wsRef.current?.close();
    };
  }, [socketUrl, readOnly]);

  const executeCommand = (cmd: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'input', data: cmd + '\r' }));
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-4">
      <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col border border-white/20 shadow-2xl">
        <div className="px-4 py-2 bg-slate-800/50 border-bottom border-white/5 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400 font-mono">bash — mark@vps-01</span>
        </div>
        <div ref={terminalRef} className="flex-1 w-full bg-[#0f172a]/80" />
      </div>
      <TerminalSidebar onCommand={executeCommand} />
    </div>
  );
};

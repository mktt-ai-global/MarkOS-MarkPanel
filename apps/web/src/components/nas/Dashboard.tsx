'use client';

import React, { useEffect, useState } from 'react';
import { StatsGrid } from './StatsGrid';
import { useMetrics } from '@/hooks/useMetrics';
import { Server, Thermometer, Clock } from 'lucide-react';

interface SystemInfo {
  hostname: string;
  os: string;
  uptime: string;
  cpuModel: string;
  loadAvg: number[];
  temp?: number;
}

export const Dashboard: React.FC = () => {
  const { metrics, history, connected } = useMetrics();
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('/api/system/info');
        const data = await res.json();
        setSysInfo(data);
      } catch (err) {
        console.error('Fetch system info failed', err);
      }
    };
    fetchInfo();
    const timer = setInterval(fetchInfo, 30000); // Update info every 30s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Server size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {sysInfo?.hostname || 'System Metrics'}
            </h1>
            <div className="flex items-center text-sm text-slate-500 space-x-3 mt-1">
              <span className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {connected ? 'Real-time' : 'Disconnected'}
              </span>
              <span>•</span>
              <span>{sysInfo?.os || 'Loading...'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 glass rounded-2xl px-6 py-3 shadow-sm border border-white/40">
          <div className="flex items-center space-x-2">
            <Thermometer size={18} className="text-orange-500" />
            <div className="text-sm font-semibold text-slate-700">{sysInfo?.temp || '--'}°C</div>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center space-x-2">
            <Clock size={18} className="text-blue-500" />
            <div className="text-sm font-semibold text-slate-700">{sysInfo?.uptime || '--'}</div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <StatsGrid metrics={metrics} history={history} />

      {/* Bottom Detail Row (Optional) */}
      <div className="glass-card rounded-2xl p-6 border border-white/40 shadow-sm min-h-[120px] flex items-center">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">CPU Model</span>
              <span className="text-sm font-medium text-slate-700 truncate">{sysInfo?.cpuModel || 'Intel(R) Core(TM) i7-10700K CPU @ 3.80GHz'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Load Average</span>
              <span className="text-sm font-medium text-slate-700">{sysInfo?.loadAvg?.join(', ') || '0.24, 0.35, 0.41'}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Last Update</span>
               <span className="text-sm font-mono text-slate-600">
                  {metrics ? new Date().toLocaleTimeString() : '--:--:--'}
               </span>
            </div>
         </div>
      </div>
    </div>
  );
};

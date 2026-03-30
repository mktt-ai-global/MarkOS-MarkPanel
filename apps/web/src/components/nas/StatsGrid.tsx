'use client';

import React from 'react';
import { CpuChart } from './CpuChart';
import { SystemMetrics } from '@/hooks/useMetrics';
import { Cpu, Database, HardDrive, Globe } from 'lucide-react';

interface StatsGridProps {
  metrics: SystemMetrics | null;
  history: SystemMetrics[];
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B/s`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB/s`;
};

export const StatsGrid: React.FC<StatsGridProps> = ({ metrics, history }) => {
  const stats = [
    {
      label: 'CPU',
      value: metrics ? `${metrics.cpu.toFixed(1)}%` : '0%',
      icon: Cpu,
      color: '#3b82f6', // Blue
      chartData: history.map((h) => ({ cpu: h.cpu })),
    },
    {
      label: 'Memory',
      value: metrics ? `${metrics.memory.toFixed(1)}%` : '0%',
      icon: Database,
      color: '#10b981', // Green
      chartData: history.map((h) => ({ cpu: h.memory })), // Reusing chart for memory
    },
    {
      label: 'Disk I/O',
      value: metrics ? formatSize(metrics.diskIO.read + metrics.diskIO.write) : '0 B/s',
      icon: HardDrive,
      color: '#8b5cf6', // Purple
      chartData: history.map((h) => ({ cpu: Math.min(100, (h.diskIO.read + h.diskIO.write) / 1000000) })), // Scaled for chart
    },
    {
      label: 'Network',
      value: metrics ? formatSize(metrics.network.tx + metrics.network.rx) : '0 B/s',
      icon: Globe,
      color: '#f59e0b', // Amber
      chartData: history.map((h) => ({ cpu: Math.min(100, (h.network.tx + h.network.rx) / 1000000) })), // Scaled for chart
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="glass-card rounded-xl p-4 flex flex-col justify-between h-40 shadow-sm transition-transform hover:scale-[1.02]"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
            >
              <stat.icon size={20} />
            </div>
          </div>
          <div className="mt-auto">
            <CpuChart data={stat.chartData} color={stat.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

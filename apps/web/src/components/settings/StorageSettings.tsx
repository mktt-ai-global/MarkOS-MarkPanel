'use client';

import React from 'react';
import { GlassCard } from '../layout/GlassCard';

export const StorageSettings = () => {
  return (
    <div className="space-y-6">
      <section>
        <div className="text-sm font-semibold text-text-primary mb-3">Storage Quota</div>
        <GlassCard className="p-5">
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="text-2xl font-bold text-text-primary">430.5 GB</div>
              <div className="text-xs text-text-muted">Used of 1.0 TB total</div>
            </div>
            <div className="text-sm font-medium text-accent-blue">43%</div>
          </div>
          <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-blue to-accent-purple w-[43%]" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <StorageStat label="Videos" value="284 GB" color="bg-blue-500" />
            <StorageStat label="Images" value="42 GB" color="bg-green-500" />
            <StorageStat label="Documents" value="12 GB" color="bg-amber-500" />
            <StorageStat label="Others" value="92.5 GB" color="bg-gray-400" />
          </div>
        </GlassCard>
      </section>

      <section>
        <div className="text-sm font-semibold text-text-primary mb-3">Configuration</div>
        <GlassCard className="p-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Default Root Path</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  defaultValue="/mnt/data/cloud_drive" 
                  className="flex-1 bg-black/5 border border-border-subtle rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-blue/20"
                />
                <button className="px-4 py-2 bg-black/5 hover:bg-black/10 text-text-primary rounded-lg text-sm font-medium border border-border-subtle">
                  Browse
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

const StorageStat = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <div className="flex-1 text-xs text-text-secondary">{label}</div>
    <div className="text-xs font-medium text-text-primary">{value}</div>
  </div>
);

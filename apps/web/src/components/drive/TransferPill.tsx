'use client';

import React, { useState } from 'react';
import { useDriveStore } from '@/store/driveStore';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';

export function TransferPill() {
  const { uploadTasks } = useDriveStore();
  const [expanded, setExpanded] = useState(false);

  const activeTasks = uploadTasks.filter(t => t.status === 'uploading');
  const completedTasks = uploadTasks.filter(t => t.status === 'completed');

  if (uploadTasks.length === 0) return null;

  const totalProgress = uploadTasks.length > 0
    ? uploadTasks.reduce((acc, t) => acc + t.progress, 0) / uploadTasks.length
    : 0;

  return (
    <div className="fixed bottom-10 right-10 z-[90] animate-in slide-in-from-right-8 fade-in duration-300">
      <div 
        className={cn(
          "w-72 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300",
          expanded ? "h-96" : "h-14"
        )}
      >
        {/* Header (Pill) */}
        <div 
          onClick={() => setExpanded(!expanded)}
          className="h-14 flex items-center justify-between px-4 cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            {activeTasks.length > 0 ? (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">
                {activeTasks.length > 0 
                  ? `Uploading ${activeTasks.length} items` 
                  : `Transfers complete`}
              </span>
              <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {completedTasks.length}/{uploadTasks.length}
            </span>
            {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          </div>
        </div>

        {/* List View (Expanded) */}
        <div className="h-[calc(384px-56px)] overflow-y-auto border-t border-white/10">
          <div className="divide-y divide-white/5">
            {uploadTasks.map((task) => (
              <div key={task.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-300 truncate w-48 font-medium">{task.fileName}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{Math.round(task.progress)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-300",
                      task.status === 'completed' ? "bg-green-500" : task.status === 'failed' ? "bg-red-500" : "bg-blue-500"
                    )}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

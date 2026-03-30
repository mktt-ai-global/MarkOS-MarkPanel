'use client';

import React from 'react';
import { useDriveStore } from '@/store/driveStore';
import { X, Download, Share2, Trash2, Folder, MoreHorizontal } from 'lucide-react';

export function ContextBar() {
  const { selectedIds, clearSelection } = useDriveStore();

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[80] animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center px-4 py-1.5 border-r border-white/10">
          <span className="text-sm font-bold text-white mr-1">{selectedIds.length}</span>
          <span className="text-[12px] font-medium text-gray-400 uppercase tracking-widest">selected</span>
        </div>

        <div className="flex items-center gap-1 px-1">
          <button 
            title="Download selected"
            className="p-2.5 rounded-xl text-gray-200 hover:bg-white/10 hover:text-white transition-all active:scale-90"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            title="Share selected"
            className="p-2.5 rounded-xl text-gray-200 hover:bg-white/10 hover:text-white transition-all active:scale-90"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            title="Move selected"
            className="p-2.5 rounded-xl text-gray-200 hover:bg-white/10 hover:text-white transition-all active:scale-90"
          >
            <Folder className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button 
            title="Delete selected"
            className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all active:scale-90"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            className="p-2.5 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="px-1 border-l border-white/10">
          <button 
            onClick={clearSelection}
            className="p-2.5 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

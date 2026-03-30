'use client';

import React, { useEffect, useRef } from 'react';
import { useDriveStore } from '@/store/driveStore';
import { Download, Share2, Trash2, Edit } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  targetId?: string;
}

export function ContextMenu({ x, y, onClose, targetId }: ContextMenuProps) {
  const { selectedIds } = useDriveStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = (action: string) => {
    console.log(`Action: ${action} on IDs:`, targetId ? [targetId] : selectedIds);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[200] w-48 py-1 rounded-xl shadow-2xl border border-white/10 bg-black/60 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</div>
      <button 
        onClick={() => handleAction('download')}
        className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white transition-colors"
      >
        <Download className="w-4 h-4" /> Download
      </button>
      <button 
        onClick={() => handleAction('share')}
        className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white transition-colors"
      >
        <Share2 className="w-4 h-4" /> Share
      </button>
      <button 
        onClick={() => handleAction('rename')}
        className="w-full px-4 py-2 flex items-center gap-3 text-sm text-gray-200 hover:bg-blue-500/20 hover:text-white transition-colors"
      >
        <Edit className="w-4 h-4" /> Rename
      </button>
      <div className="my-1 border-t border-white/10" />
      <button 
        onClick={() => handleAction('delete')}
        className="w-full px-4 py-2 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </div>
  );
}

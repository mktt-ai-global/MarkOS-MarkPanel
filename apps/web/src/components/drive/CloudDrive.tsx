'use client';

import React, { useState } from 'react';
import { useDriveStore } from '@/store/driveStore';
import { cn } from '@/lib/utils';
import { LayoutGrid, List, Search, Plus, Upload } from 'lucide-react';
import { FileGrid } from './FileGrid';
import { FileList } from './FileList';
import { UploadZone } from './UploadZone';
import { FilePreview } from './FilePreview';
import { ContextBar } from './ContextBar';
import { ContextMenu } from './ContextMenu';
import { TransferPill } from './TransferPill';

export function CloudDrive() {
  const { viewMode, setViewMode, files, setFiles } = useDriveStore();
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);

  // Sample data initialization
  React.useEffect(() => {
    if (files.length === 0) {
      setFiles([
        { id: '1', name: 'Vacation Photo.jpg', type: 'image', size: 2450000, updatedAt: '2026-03-28 14:30', thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=200&h=200' },
        { id: '2', name: 'Project Specs.pdf', type: 'pdf', size: 1200000, updatedAt: '2026-03-29 09:15', url: '#' },
        { id: '3', name: 'Demo Video.mp4', type: 'video', size: 154000000, updatedAt: '2026-03-27 18:45', url: '#' },
        { id: '4', name: 'Work Documents', type: 'folder', size: 0, updatedAt: '2026-03-30 11:20' },
        { id: '5', name: 'Invoices.xlsx', type: 'document', size: 45000, updatedAt: '2026-03-30 10:05' },
        { id: '6', name: 'Architecture Sketch.png', type: 'image', size: 3500000, updatedAt: '2026-03-25 16:12', thumbnailUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=200&h=200' },
      ]);
    }
  }, [files.length, setFiles]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <UploadZone>
      <div 
        className="flex flex-col h-full text-white bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500"
        onContextMenu={handleContextMenu}
      >
        {/* Header/Toolbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Cloud Drive
            </h1>
            <div className="hidden md:flex items-center gap-2 bg-black/20 rounded-full px-4 py-1.5 border border-white/10 group focus-within:border-blue-500/50 transition-all">
              <Search className="w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search files..." 
                className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-black/20 rounded-xl p-1 border border-white/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  viewMode === 'grid' ? "bg-white/10 text-white shadow-inner" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  viewMode === 'list' ? "bg-white/10 text-white shadow-inner" : "text-gray-500 hover:text-gray-300"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95">
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
            <button className="hidden sm:flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all border border-white/10">
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {viewMode === 'grid' ? <FileGrid /> : <FileList />}
          
          {/* Breadcrumbs / Footer Info */}
          <div className="p-4 mt-auto">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">
              <span>Drive</span>
              <span className="opacity-30">/</span>
              <span className="text-gray-400">My Files</span>
            </div>
          </div>
        </main>

        {/* Mobile Action Bar */}
        <div className="sm:hidden flex items-center justify-around px-4 py-3 bg-white/5 backdrop-blur-md border-t border-white/10">
          <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Search">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Toggle View" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
          </button>
          <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg -translate-y-4 border-4 border-black/20" title="New">
            <Plus className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Upload">
            <Upload className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Sort">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
          </button>
        </div>

        <FilePreview />
        <ContextBar />
        {menuPos && (
          <ContextMenu 
            x={menuPos.x} 
            y={menuPos.y} 
            onClose={() => setMenuPos(null)} 
          />
        )}
        <TransferPill />
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </UploadZone>
  );
}

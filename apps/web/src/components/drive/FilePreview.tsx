'use client';

import React from 'react';
import NextImage from 'next/image';
import { useDriveStore } from '@/store/driveStore';
import { X, Download, File } from 'lucide-react';

export function FilePreview() {
  const { previewFile, setPreviewFile } = useDriveStore();

  if (!previewFile) return null;

  const handleClose = () => setPreviewFile(null);

  const renderContent = () => {
    switch (previewFile.type) {
      case 'image':
        return (
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            <NextImage 
              src={previewFile.url || previewFile.thumbnailUrl || ''} 
              alt={previewFile.name} 
              fill
              className="object-contain rounded shadow-2xl"
              priority
            />
          </div>
        );
      case 'video':
        return (
          <video 
            src={previewFile.url} 
            controls 
            autoPlay 
            className="max-w-full max-h-[80vh] rounded shadow-2xl"
          />
        );
      case 'pdf':
        return (
          <iframe 
            src={previewFile.url} 
            className="w-full h-[80vh] rounded border-none shadow-2xl"
            title={previewFile.name}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10">
            <File className="w-24 h-24 text-gray-400 mb-4" />
            <span className="text-xl font-medium text-gray-200 mb-2">{previewFile.name}</span>
            <span className="text-gray-400 mb-6">Preview not available for this file type</span>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-5xl z-10 flex flex-col items-center">
        <div className="absolute top-0 right-0 -translate-y-12 flex gap-3">
          <button 
            onClick={() => window.open(previewFile.url, '_blank')}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors border border-white/10"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={handleClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full flex justify-center animate-in zoom-in-95 duration-200">
          {renderContent()}
        </div>

        <div className="mt-4 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white text-sm font-medium">
          {previewFile.name}
        </div>
      </div>
    </div>
  );
}

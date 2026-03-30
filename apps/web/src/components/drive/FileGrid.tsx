'use client';

import React from 'react';
import NextImage from 'next/image';
import { useDriveStore } from '@/store/driveStore';
import { cn } from '@/lib/utils';
import { File, Image as ImageIcon, FileVideo, FileText, Folder } from 'lucide-react';
import { DriveFile, FileType } from './types';

const getFileIcon = (type: FileType) => {
  switch (type) {
    case 'image': return <ImageIcon className="w-8 h-8 text-blue-400" />;
    case 'video': return <FileVideo className="w-8 h-8 text-purple-400" />;
    case 'pdf': return <FileText className="w-8 h-8 text-red-400" />;
    case 'folder': return <Folder className="w-8 h-8 text-amber-400" />;
    default: return <File className="w-8 h-8 text-gray-400" />;
  }
};

export function FileGrid() {
  const { files, selectedIds, toggleSelection, setPreviewFile } = useDriveStore();

  const handleFileClick = (e: React.MouseEvent, file: DriveFile) => {
    e.stopPropagation();
    toggleSelection(file.id, e.ctrlKey || e.metaKey);
  };

  const handleDoubleClick = (file: DriveFile) => {
    if (file.type !== 'folder') {
      setPreviewFile(file);
    }
  };

  return (
    <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={(e) => handleFileClick(e, file)}
          onDoubleClick={() => handleDoubleClick(file)}
          className={cn(
            "group flex flex-col items-center p-3 rounded-xl transition-all cursor-pointer select-none",
            "border border-transparent hover:bg-white/10 hover:backdrop-blur-md hover:border-white/20",
            selectedIds.includes(file.id) && "bg-blue-500/20 border-blue-500/30 ring-1 ring-blue-500/50"
          )}
        >
          <div className="relative w-full aspect-square mb-2 flex items-center justify-center bg-gray-100/5 rounded-lg overflow-hidden border border-white/5">
            {file.thumbnailUrl ? (
              <NextImage 
                src={file.thumbnailUrl} 
                alt={file.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
            ) : (
              getFileIcon(file.type)
            )}
            
            {/* Multi-select checkmark placeholder */}
            <div className={cn(
              "absolute top-2 left-2 w-5 h-5 rounded-full border border-white/40 bg-black/20 flex items-center justify-center opacity-0 transition-opacity z-10",
              (selectedIds.includes(file.id) || "group-hover:opacity-100"),
              selectedIds.includes(file.id) && "opacity-100 bg-blue-500 border-blue-500"
            )}>
              {selectedIds.includes(file.id) && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>
          <span className="text-sm text-gray-200 truncate w-full text-center px-1">
            {file.name}
          </span>
        </div>
      ))}
    </div>
  );
}

'use client';

import React from 'react';
import { useDriveStore } from '@/store/driveStore';
import { cn } from '@/lib/utils';
import { File, Image as ImageIcon, FileVideo, FileText, Folder } from 'lucide-react';
import { FileType, DriveFile } from './types';

const getFileIcon = (type: FileType) => {
  switch (type) {
    case 'image': return <ImageIcon className="w-5 h-5 text-blue-400" />;
    case 'video': return <FileVideo className="w-5 h-5 text-purple-400" />;
    case 'pdf': return <FileText className="w-5 h-5 text-red-400" />;
    case 'folder': return <Folder className="w-5 h-5 text-amber-400" />;
    default: return <File className="w-5 h-5 text-gray-400" />;
  }
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileList() {
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
    <div className="flex flex-col h-full min-h-[400px]">
      <div className="flex items-center px-4 py-2 border-b border-white/10 text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider bg-white/5">
        <div className="w-8 flex items-center justify-center mr-3" />
        <div className="flex-1">Name</div>
        <div className="w-24 md:w-32 text-right">Size</div>
        <div className="hidden sm:block w-48 text-right pr-4">Last Modified</div>
      </div>
      <div className="flex-1 overflow-auto">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={(e) => handleFileClick(e, file)}
            onDoubleClick={() => handleDoubleClick(file)}
            className={cn(
              "group flex items-center px-4 h-12 transition-all cursor-pointer select-none border-b border-white/5",
              "hover:bg-white/5",
              selectedIds.includes(file.id) && "bg-blue-500/10"
            )}
          >
            <div className="w-8 flex items-center justify-center mr-3">
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1 truncate text-sm text-gray-200">
              {file.name}
            </div>
            <div className="w-24 md:w-32 text-right text-xs md:text-sm text-gray-400 font-mono">
              {file.type === 'folder' ? '--' : formatSize(file.size)}
            </div>
            <div className="hidden sm:block w-48 text-right pr-4 text-sm text-gray-500 font-mono">
              {file.updatedAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

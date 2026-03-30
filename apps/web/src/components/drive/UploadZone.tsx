'use client';

import React, { useRef, useState } from 'react';
import { useDriveStore } from '@/store/driveStore';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { UploadTask } from './types';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

export function UploadZone({ children }: { children: React.ReactNode }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const { addUploadTask, updateUploadProgress, completeUploadTask } = useDriveStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(startUpload);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(startUpload);
  };

  const startUpload = async (file: File) => {
    const taskId = Math.random().toString(36).substring(2, 9);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    const task: UploadTask = {
      id: taskId,
      fileName: file.name,
      progress: 0,
      status: 'uploading',
      totalChunks,
      uploadedChunks: 0,
    };

    addUploadTask(task);

    // Actual chunking and upload logic
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);

      try {
        await uploadChunk(taskId, i, chunk, totalChunks, file.name);
        updateUploadProgress(taskId, i + 1);
      } catch (error) {
        console.error('Failed to upload chunk', i, error);
        // handle retry or fail task
      }
    }

    completeUploadTask(taskId);
  };

  const uploadChunk = async (taskId: string, chunkIndex: number, chunk: Blob, totalChunks: number, fileName: string) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('taskId', taskId);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileName', fileName);

    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Uploaded chunk ${chunkIndex + 1}/${totalChunks} for ${fileName}`);
        resolve(true);
      }, 500);
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative w-full h-full min-h-[400px]",
        isDragActive && "after:absolute after:inset-0 after:bg-blue-500/10 after:border-2 after:border-dashed after:border-blue-500 after:z-50 after:backdrop-blur-sm"
      )}
    >
      <input
        type="file"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInput}
      />
      
      {children}

      {isDragActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[60] pointer-events-none">
          <Upload className="w-12 h-12 text-blue-500 animate-bounce mb-2" />
          <span className="text-blue-500 font-semibold text-lg">Drop to Upload</span>
        </div>
      )}
    </div>
  );
}

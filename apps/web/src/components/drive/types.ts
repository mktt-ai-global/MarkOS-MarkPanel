export type FileType = 'image' | 'video' | 'pdf' | 'document' | 'folder' | 'other';

export interface DriveFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  updatedAt: string;
  thumbnailUrl?: string;
  url?: string;
  parentId?: string;
}

export interface UploadTask {
  id: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  totalChunks: number;
  uploadedChunks: number;
}

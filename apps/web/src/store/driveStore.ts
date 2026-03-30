import { create } from 'zustand';
import { DriveFile, UploadTask } from '@/components/drive/types';

interface DriveState {
  files: DriveFile[];
  selectedIds: string[];
  viewMode: 'grid' | 'list';
  uploadTasks: UploadTask[];
  previewFile: DriveFile | null;

  setFiles: (files: DriveFile[]) => void;
  toggleSelection: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  addUploadTask: (task: UploadTask) => void;
  updateUploadProgress: (id: string, uploadedChunks: number) => void;
  completeUploadTask: (id: string) => void;
  setPreviewFile: (file: DriveFile | null) => void;
}

export const useDriveStore = create<DriveState>((set) => ({
  files: [],
  selectedIds: [],
  viewMode: 'grid',
  uploadTasks: [],
  previewFile: null,

  setFiles: (files) => set({ files }),
  toggleSelection: (id, multi) => set((state) => {
    if (multi) {
      const isSelected = state.selectedIds.includes(id);
      return {
        selectedIds: isSelected 
          ? state.selectedIds.filter((i) => i !== id) 
          : [...state.selectedIds, id]
      };
    }
    return { selectedIds: [id] };
  }),
  clearSelection: () => set({ selectedIds: [] }),
  setViewMode: (viewMode) => set({ viewMode }),
  addUploadTask: (task) => set((state) => ({ 
    uploadTasks: [...state.uploadTasks, task] 
  })),
  updateUploadProgress: (id, uploadedChunks) => set((state) => ({
    uploadTasks: state.uploadTasks.map(t => 
      t.id === id ? { ...t, uploadedChunks, progress: (uploadedChunks / t.totalChunks) * 100 } : t
    )
  })),
  completeUploadTask: (id) => set((state) => ({
    uploadTasks: state.uploadTasks.map(t => 
      t.id === id ? { ...t, status: 'completed', progress: 100 } : t
    )
  })),
  setPreviewFile: (previewFile) => set({ previewFile }),
}));

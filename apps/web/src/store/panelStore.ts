import { create } from 'zustand';

export type PanelType = 'nas' | 'drive' | 'home' | 'terminal' | 'settings';
export type NasSubPanel = 'overview' | 'cpu' | 'disk' | 'network' | 'docker' | 'processes' | 'cron' | 'firewall' | 'system-log' | 'alerts';
export type SettingsSubPanel = 'general' | 'profile' | 'storage' | 'about';

interface PanelState {
  activePanel: PanelType;
  activeNasSubPanel: NasSubPanel;
  activeSettingsSubPanel: SettingsSubPanel;
  isSidebarOpen: boolean;
  setActivePanel: (panel: PanelType) => void;
  setActiveNasSubPanel: (sub: NasSubPanel) => void;
  setActiveSettingsSubPanel: (sub: SettingsSubPanel) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  activePanel: 'nas',
  activeNasSubPanel: 'overview',
  activeSettingsSubPanel: 'general',
  isSidebarOpen: false,
  setActivePanel: (panel) => set({ activePanel: panel }),
  setActiveNasSubPanel: (sub) => set({ activeNasSubPanel: sub }),
  setActiveSettingsSubPanel: (sub) => set({ activeSettingsSubPanel: sub }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));

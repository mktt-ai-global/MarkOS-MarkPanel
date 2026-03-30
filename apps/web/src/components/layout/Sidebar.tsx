'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { usePanelStore, NasSubPanel, SettingsSubPanel } from '@/store/panelStore';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  badge?: {
    text: string;
    variant?: 'blue' | 'warn';
  };
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const nasSections: SidebarSection[] = [
  {
    title: 'System',
    items: [
      { id: 'overview', label: 'Overview', icon: '◈' },
      { id: 'cpu', label: 'CPU & Memory', icon: '▦' },
      { id: 'disk', label: 'Disk Manager', icon: '▤' },
      { id: 'network', label: 'Network', icon: '◉' },
    ],
  },
  {
    title: 'Services',
    items: [
      { id: 'docker', label: 'Docker', icon: '▶', badge: { text: '12', variant: 'blue' } },
      { id: 'processes', label: 'Processes', icon: '⚙', badge: { text: '148' } },
      { id: 'cron', label: 'Cron Jobs', icon: '◎' },
      { id: 'firewall', label: 'Firewall', icon: '⊘' },
    ],
  },
  {
    title: 'Logs',
    items: [
      { id: 'system-log', label: 'System Log', icon: '▣' },
      { id: 'alerts', label: 'Alerts', icon: '⚠', badge: { text: '3', variant: 'warn' } },
    ],
  },
];

const driveSections: SidebarSection[] = [
  {
    title: 'Storage',
    items: [
      { id: 'all', label: 'All Files', icon: '◉' },
      { id: 'starred', label: 'Starred', icon: '⭐' },
      { id: 'recent', label: 'Recent', icon: '▶' },
      { id: 'shared', label: 'Shared', icon: '⊙' },
    ],
  },
  {
    title: 'Categories',
    items: [
      { id: 'videos', label: 'Videos', icon: '🎬', badge: { text: '47' } },
      { id: 'images', label: 'Images', icon: '🖼', badge: { text: '312' } },
      { id: 'docs', label: 'Docs', icon: '📁', badge: { text: '89' } },
      { id: 'music', label: 'Music', icon: '🎵', badge: { text: '231' } },
    ],
  },
];

const settingsSections: SidebarSection[] = [
  {
    title: 'Preferences',
    items: [
      { id: 'general', label: 'General', icon: '⚙' },
      { id: 'profile', label: 'Profile', icon: '👤' },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'storage', label: 'Storage', icon: '💾' },
      { id: 'about', label: 'About', icon: 'ℹ' },
    ],
  },
];

export const Sidebar = ({ className, isMobile = false }: { className?: string, isMobile?: boolean }) => {
  const { activePanel, activeNasSubPanel, setActiveNasSubPanel, activeSettingsSubPanel, setActiveSettingsSubPanel } = usePanelStore();

  if (activePanel === 'terminal') return null;
  if (activePanel === 'home') return null;

  const sections = activePanel === 'nas' ? nasSections : 
                   activePanel === 'settings' ? settingsSections : 
                   driveSections;

  const activeSubPanel = activePanel === 'nas' ? activeNasSubPanel : 
                         activePanel === 'settings' ? activeSettingsSubPanel : 
                         'all';

  const handleSubPanelClick = (id: string) => {
    if (activePanel === 'nas') setActiveNasSubPanel(id as NasSubPanel);
    if (activePanel === 'settings') setActiveSettingsSubPanel(id as SettingsSubPanel);
  };

  return (
    <aside className={cn(
      "w-[210px] min-w-[210px] p-[16px_12px] bg-white/50 backdrop-blur-[20px] saturate-[160%] border-r border-glass flex flex-col gap-0.5 min-h-[calc(100vh-56px)]",
      !isMobile && "hidden md:flex",
      isMobile && "w-full min-w-0 border-r-0 bg-transparent backdrop-blur-0",
      className
    )}>
      {sections.map((section, idx) => (
        <React.Fragment key={section.title}>
          <div className="text-[11px] font-semibold text-text-muted tracking-[0.06em] uppercase px-2 pt-2.5 pb-1">
            {section.title}
          </div>
          {section.items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSubPanelClick(item.id)}
              className={cn(
                "flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-[13px] font-normal text-text-secondary transition-all duration-180",
                activeSubPanel === item.id
                  ? "bg-accent-blue/10 text-[#2563eb] font-medium"
                  : "hover:bg-black/5 hover:text-text-primary"
              )}
            >
              <span className="text-[15px] w-5 text-center">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className={cn(
                  "ml-auto text-[11px] font-medium px-[7px] py-[1px] rounded-[10px]",
                  item.badge.variant === 'blue' ? "bg-accent-blue/10 text-[#2563eb]" :
                  item.badge.variant === 'warn' ? "bg-accent-amber/12 text-[#d97706]" :
                  "bg-black/5 text-text-muted"
                )}>
                  {item.badge.text}
                </span>
              )}
            </div>
          ))}
          {idx < sections.length - 1 && (
            <div className="h-px bg-black/5 mx-2 my-1.5" />
          )}
        </React.Fragment>
      ))}
    </aside>
  );
};

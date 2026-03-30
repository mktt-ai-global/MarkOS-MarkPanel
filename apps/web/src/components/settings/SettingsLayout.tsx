'use client';

import React from 'react';
import { usePanelStore } from '@/store/panelStore';
import { GeneralSettings } from './GeneralSettings';
import { ProfileSettings } from './ProfileSettings';
import { StorageSettings } from './StorageSettings';
import { AboutSettings } from './AboutSettings';

export const SettingsLayout = () => {
  const { activeSettingsSubPanel } = usePanelStore();

  const renderSubPanel = () => {
    switch (activeSettingsSubPanel) {
      case 'general': return <GeneralSettings />;
      case 'profile': return <ProfileSettings />;
      case 'storage': return <StorageSettings />;
      case 'about': return <AboutSettings />;
      default: return <GeneralSettings />;
    }
  };

  const titles = {
    general: 'General Settings',
    profile: 'Profile & Account',
    storage: 'Storage Configuration',
    about: 'About MarkOS',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          {titles[activeSettingsSubPanel]}
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your system preferences and account details.
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderSubPanel()}
      </div>
    </div>
  );
};

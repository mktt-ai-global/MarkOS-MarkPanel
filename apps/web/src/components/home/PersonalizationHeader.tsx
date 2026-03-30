'use client';

import React, { useEffect, useState } from 'react';

const PersonalizationHeader: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      setDateStr(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
    };

    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center py-7 pb-5">
      <h1 className="text-[26px] font-semibold tracking-tight text-text-primary">
        {greeting}, <em className="not-italic bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">Mark</em> ✦
      </h1>
      <p className="text-xs text-text-muted mt-1">{dateStr}</p>
    </div>
  );
};

export const WidgetChips: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-[10px] mb-6">
      <Chip icon="🌤" value="24°C" label="Los Angeles" valueColor="text-accent-amber" />
      <Chip icon="⚡" value="99.8%" label="VPS Uptime" valueColor="text-accent-green" />
      <Chip icon="📦" value="12" label="Containers" valueColor="text-accent-purple" />
      <Chip icon="🔒" value="Safe" label="Firewall" valueColor="text-accent-blue" />
    </div>
  );
};

interface ChipProps {
  icon: string;
  value: string;
  label: string;
  valueColor?: string;
}

const Chip: React.FC<ChipProps> = ({ icon, value, label, valueColor = 'text-text-primary' }) => {
  return (
    <div className="flex items-center gap-2 px-[14px] py-2 rounded-xl bg-white/75 border border-glass shadow-card backdrop-blur-[16px]">
      <span className="text-base">{icon}</span>
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
        <span className="text-[11px] text-text-muted leading-tight">{label}</span>
      </div>
    </div>
  );
};

export default PersonalizationHeader;

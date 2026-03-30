'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface AppItem {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  url?: string;
  colorClass?: string;
}

interface AppCardProps {
  app: AppItem;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center gap-[7px] p-[14px] py-2 rounded-lg cursor-grab active:cursor-grabbing bg-white/72 backdrop-blur-[16px] border border-glass shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-200 no-underline text-inherit"
    >
      <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center text-xl ${app.colorClass || 'bg-black/5 border border-black/5'}`}>
        {app.icon}
      </div>
      <div className="text-xs font-medium text-center leading-tight text-text-primary">
        {app.name}
      </div>
      <div className="text-[10px] text-text-muted font-mono">
        {app.subtitle}
      </div>
    </div>
  );
};

export default AppCard;

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const GlassCard = ({ children, className, hoverable = true }: GlassCardProps) => {
  return (
    <div className={cn(
      "bg-glass backdrop-blur-[20px] saturate-[160%] border border-glass rounded-lg shadow-card shadow-top overflow-hidden transition-all duration-200",
      hoverable && "hover:shadow-hover hover:-translate-y-[2px]",
      className
    )}>
      {children}
    </div>
  );
};

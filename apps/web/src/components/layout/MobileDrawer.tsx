'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div 
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[260px] bg-white/90 backdrop-blur-2xl z-[201] transition-transform duration-300 ease-out md:hidden flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-glass">
          <div className="flex items-center gap-2">
            <div className="w-[24px] h-[24px] rounded-[7px] bg-gradient-to-br from-[#60a5fa] to-[#818cf8] flex items-center justify-center">
              <svg className="w-3 h-3 fill-white" viewBox="0 0 16 16">
                <path d="M3 3h4v4H3zm6 0h4v4h-4zM3 9h4v4H3zm6 2h1v2h-1zm2 0h1v2h-1z" />
              </svg>
            </div>
            <span className="font-semibold text-text-primary">MarkOS</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 text-text-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto" onClick={onClose}>
          <Sidebar isMobile />
        </div>
      </div>
    </>
  );
};

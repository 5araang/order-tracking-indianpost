import React from 'react';
import { Package, BookOpen, UserCheck, Menu } from 'lucide-react';
import { AuthService } from '../services/authService';

interface NavbarProps {
  activeView: 'single' | 'docs' | 'login';
  onChangeView: (view: 'single' | 'docs' | 'login') => void;
  onOpenSidebar: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onChangeView,
  onOpenSidebar
}) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const authUser = AuthService.getAuthenticatedUser();

  return (
    <header className="w-full max-w-5xl mx-auto mb-4 md:mb-6 px-4">
      <div className="flat-card p-3.5 md:p-4 flex items-center justify-between gap-4">
        {/* Brand Logo - Clean on mobile */}
        <div className="flex items-center gap-2.5 md:gap-3 cursor-pointer text-left" onClick={() => isAuthenticated && onChangeView('single')}>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded bg-red-600 flex items-center justify-center text-white shrink-0 font-bold">
            <Package className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm md:text-base tracking-tight text-white">India Post</h1>
              <span className="hidden sm:inline-block bg-red-950 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-800">
                ENTERPRISE
              </span>
            </div>
            <p className="hidden sm:block text-xs text-neutral-400">Next.js Server Action REST Portal</p>
          </div>
        </div>

        {/* View Navigation & User Sidebar Avatar Button (Desktop Only) */}
        {isAuthenticated && activeView !== 'login' && (
          <div className="hidden md:flex items-center gap-3">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-black p-1 rounded border border-neutral-800">
              <button
                onClick={() => onChangeView('single')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeView === 'single'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tracker
              </button>

              <button
                onClick={() => onChangeView('docs')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeView === 'docs'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>API Docs</span>
              </button>
            </div>

            {/* Sidebar Drawer Trigger Button */}
            <button
              onClick={onOpenSidebar}
              className="px-3 py-1.5 rounded bg-black border border-neutral-800 hover:border-red-600 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              title="Open User Control Panel & Settings"
            >
              <UserCheck className="w-3.5 h-3.5 text-red-500" />
              <span className="font-mono truncate max-w-[120px]">{authUser}</span>
              <Menu className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

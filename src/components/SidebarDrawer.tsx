import React from 'react';
import { X, UserCheck, Key, History, LogOut, ShieldCheck } from 'lucide-react';
import { SearchHistoryItem } from '../types/tracking';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string | null;
  onOpenSecurityKeys: () => void;
  history: SearchHistoryItem[];
  onSelectCode: (code: string) => void;
  onClearHistory: () => void;
  onLogout: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  userEmail,
  onOpenSecurityKeys,
  history,
  onSelectCode,
  onClearHistory,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end text-left">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Sidebar Panel */}
      <div className="relative w-full max-w-sm bg-black border-l border-neutral-800 h-full flex flex-col z-10 shadow-2xl p-6 space-y-6">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">User Control Panel</h3>
              <p className="text-[11px] text-neutral-400">Enterprise Admin Environment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="flat-card p-4 space-y-2 border-red-900/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-xs font-bold text-white truncate" title={userEmail || ''}>
              {userEmail || 'admin@indiapost.gov.in'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-800">
            <span>Session Status</span>
            <span className="text-red-400 font-mono font-bold">ACTIVE (AUTHENTICATED)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
            Security Controls
          </h4>

          <button
            onClick={() => {
              onClose();
              onOpenSecurityKeys();
            }}
            className="w-full p-3 rounded bg-black border border-neutral-800 hover:border-red-600 text-neutral-200 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-red-500" />
              <span>Developer API Keys & Secrets</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">AES-256</span>
          </button>
        </div>

        {/* Recent Search History Section */}
        <div className="flex-1 flex flex-col min-h-0 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-red-500" />
              Recent Searches ({history.length})
            </h4>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[10px] text-neutral-400 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {history.length === 0 ? (
              <p className="text-xs text-neutral-500 italic p-3 text-center border border-neutral-800/60 rounded">
                No recent searches logged
              </p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onSelectCode(item.id);
                  }}
                  className="w-full p-2.5 rounded bg-black/60 hover:bg-neutral-900 border border-neutral-800 text-left transition-colors flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="block font-mono text-xs font-bold text-white">{item.id}</span>
                    <span className="text-[10px] text-neutral-400">{item.last_office || 'Postal Hub'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.delivered ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-neutral-900 text-neutral-400'
                  }`}>
                    {item.delivered ? 'DELIVERED' : 'TRANSIT'}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Logout Action at Sidebar Bottom */}
        <div className="pt-3 border-t border-neutral-800">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { SearchHistoryItem } from '../types/tracking';
import { X, Trash2, RotateCcw, Clock } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onSelectCode: (code: string) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectCode,
  onRemoveItem,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-white">Search History</h3>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-0.5 rounded bg-rose-950/60 border border-rose-900"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No recent tracking searches logged yet.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-orange-500/50 transition-colors flex items-center justify-between gap-3 group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectCode(item.id);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm text-white group-hover:text-orange-400 transition-colors">
                      {item.id}
                    </span>
                    {item.delivered ? (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-semibold border border-emerald-800">
                        DELIVERED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded font-semibold border border-amber-800">
                        TRANSIT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {item.last_event || 'Tracked'}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectCode(item.id);
                      onClose();
                    }}
                    className="p-1.5 text-slate-400 hover:text-orange-400 rounded hover:bg-slate-800"
                    title="Re-track code"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

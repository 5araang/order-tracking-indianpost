import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, X } from 'lucide-react';
import { ApiService } from '../services/apiService';

interface SearchHeaderProps {
  onSearch: (trackingId: string, forceRefresh?: boolean) => void;
  isLoading: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch, isLoading }) => {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorMsg('Please enter a consignment tracking code');
      return;
    }

    const { valid, formatted, error } = ApiService.validateTrackingNumber(inputVal);
    if (!valid) {
      setErrorMsg(error || 'Invalid consignment number format');
      return;
    }

    setErrorMsg(null);
    onSearch(formatted);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-4 md:mb-6 px-4">
      <div className="flat-card p-4 md:p-6 text-left">
        {/* Left Aligned Top Header */}
        <div className="mb-3 md:mb-5 border-b border-neutral-800/80 pb-3">
          <h2 className="text-lg md:text-2xl font-bold tracking-tight text-white mb-0.5">
            Track India Post Consignment
          </h2>
          <p className="hidden sm:block text-neutral-400 text-xs md:text-sm">
            Real-time Next.js Server Action REST Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Enter Tracking Code..."
              className="w-full pl-10 pr-24 py-2.5 rounded flat-input text-sm font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-neutral-500"
              disabled={isLoading}
            />
            {inputVal && !isLoading && (
              <button
                type="button"
                onClick={() => setInputVal('')}
                className="absolute right-20 p-1 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <span>Track</span>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-red-400 text-xs px-3 py-2 rounded bg-black border border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

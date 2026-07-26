import React, { useState, useEffect } from 'react';
import { Cookie, Check, Save, Trash2, X, Terminal, ShieldAlert, Cpu } from 'lucide-react';

const COOKIE_STORAGE_KEY = 'indiapost_custom_session_cookie';

interface SessionCookieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionUpdated?: (cookie: string | null) => void;
  onSaveCookie?: (cookie: string | null) => void;
}

export const SessionCookieModal: React.FC<SessionCookieModalProps> = ({
  isOpen,
  onClose,
  onSessionUpdated,
  onSaveCookie
}) => {
  const [cookieInput, setCookieInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_STORAGE_KEY) || '';
    setCookieInput(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = cookieInput.trim();
    if (trimmed) {
      localStorage.setItem(COOKIE_STORAGE_KEY, trimmed);
      if (onSessionUpdated) onSessionUpdated(trimmed);
      if (onSaveCookie) onSaveCookie(trimmed);
    } else {
      localStorage.removeItem(COOKIE_STORAGE_KEY);
      if (onSessionUpdated) onSessionUpdated(null);
      if (onSaveCookie) onSaveCookie(null);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    localStorage.removeItem(COOKIE_STORAGE_KEY);
    setCookieInput('');
    if (onSessionUpdated) onSessionUpdated(null);
    if (onSaveCookie) onSaveCookie(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Session Cookie & Header Importer</h3>
              <p className="text-xs text-orange-400">Import Custom Browser Session Cookies & Tokens</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-orange-400" />
              How to import your browser's session cookie:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] pl-1">
              <li>Open DevTools (<kbd className="px-1 bg-black rounded text-slate-200">F12</kbd>) in Chrome / Edge.</li>
              <li>Go to <strong className="text-slate-200">Network</strong> tab and submit a search on India Post.</li>
              <li>Right click the request and select <strong className="text-slate-200">Copy as cURL</strong> or copy the <code className="text-orange-400">Cookie</code> header value.</li>
              <li>Paste the cookie string below. It will be sent via <code className="text-orange-400">X-Session-Cookie</code> header on API requests.</li>
            </ol>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Paste Browser Cookie Header String
            </label>
            <textarea
              rows={4}
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
              placeholder="e.g. ASP.NET_SessionId=xyz123; _ga=GA1.1.1092812039.171829..."
              className="w-full p-3 rounded-lg clean-input font-mono text-xs text-slate-200"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {cookieInput ? (
              <button
                onClick={handleClear}
                className="px-3 py-2 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Custom Cookie</span>
              </button>
            ) : <div />}

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved & Activated' : 'Save Session Cookie'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

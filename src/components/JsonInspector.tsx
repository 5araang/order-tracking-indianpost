import React, { useState } from 'react';
import { Code2, Copy, Download, Check, Lock, Unlock } from 'lucide-react';
import { ConsignmentData } from '../types/tracking';
import { SecurityService, DEFAULT_SECRET_KEY } from '../services/securityService';

interface JsonInspectorProps {
  data: ConsignmentData;
}

export const JsonInspector: React.FC<JsonInspectorProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [showEncrypted, setShowEncrypted] = useState(false);

  const jsonStr = JSON.stringify(data, null, 4);
  const encryptedCiphertext = SecurityService.encryptPayload(data, DEFAULT_SECRET_KEY);

  const activeContent = showEncrypted
    ? JSON.stringify({
        status: "200_OK_ENCRYPTED",
        algorithm: "AES-256-CBC",
        encrypted_payload: encryptedCiphertext,
        key_hint: "Decrypted on-the-fly via X-API-Secret"
      }, null, 4)
    : jsonStr;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indiapost_${showEncrypted ? 'encrypted' : 'tracking'}_${data.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flat-card p-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-red-500" />
          <h3 className="text-base font-bold text-white">API Response Payload Inspector</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEncrypted(!showEncrypted)}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              showEncrypted
                ? 'bg-red-950 text-red-400 border-red-800'
                : 'bg-black text-white border-neutral-700'
            }`}
          >
            {showEncrypted ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{showEncrypted ? 'Viewing AES-256 Ciphertext' : 'Viewing Decrypted JSON'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-black hover:bg-neutral-900 text-neutral-300 border border-neutral-800 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.json</span>
          </button>
        </div>
      </div>

      <pre className="p-4 rounded bg-black border border-neutral-800 font-mono text-xs overflow-x-auto max-h-[500px] text-red-400">
        <code>{activeContent}</code>
      </pre>
    </div>
  );
};

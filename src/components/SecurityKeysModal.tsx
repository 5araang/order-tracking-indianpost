import React, { useState } from 'react';
import { Key, Copy, Check, RefreshCw, X, Eye, EyeOff, Cpu } from 'lucide-react';
import { SecurityService, ApiCredentials } from '../services/securityService';

interface SecurityKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: ApiCredentials;
  onUpdateCredentials?: (creds: ApiCredentials) => void;
  onRegenerate?: () => void;
}

export const SecurityKeysModal: React.FC<SecurityKeysModalProps> = ({
  isOpen,
  onClose,
  credentials,
  onUpdateCredentials,
  onRegenerate
}) => {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Playground Encrypt/Decrypt test states
  const [testPayload, setTestPayload] = useState('{\n  "id": "CONSIGNMENT_ID",\n  "status": "DELIVERED"\n}');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [decryptedResult, setDecryptedResult] = useState('');

  if (!isOpen) return null;

  const handleGenerateNewPair = () => {
    if (window.confirm('Are you sure you want to generate a new API Key & Secret? Previous keys will be revoked.')) {
      const newCreds = SecurityService.generateNewPair('Production App Key');
      if (onUpdateCredentials) onUpdateCredentials(newCreds);
      if (onRegenerate) onRegenerate();
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(credentials.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(credentials.apiSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleTestEncrypt = () => {
    try {
      const parsed = JSON.parse(testPayload);
      const enc = SecurityService.encryptPayload(parsed, credentials.apiSecret);
      setEncryptedResult(enc);
      setDecryptedResult('');
    } catch {
      alert('Invalid JSON input for encryption test.');
    }
  };

  const handleTestDecrypt = () => {
    if (!encryptedResult) return;
    const dec = SecurityService.decryptPayload(encryptedResult, credentials.apiSecret);
    setDecryptedResult(JSON.stringify(dec, null, 2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 text-left">
      {/* Click Backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card - Flat 3 Color Theme */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-black border border-neutral-800 rounded flex flex-col overflow-hidden z-10 shadow-2xl">
        {/* Fixed Header */}
        <div className="px-6 py-4 bg-black border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-red-600 flex items-center justify-center text-white shrink-0 font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight tracking-tight">
                API Security & Secret Key Manager
              </h3>
              <p className="text-xs text-red-400 font-mono">Encrypted Payload & Authentication Settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* API Credentials Box */}
          <div className="flat-card p-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Public API Key (X-API-Key)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={credentials.apiKey}
                  className="w-full p-2.5 rounded flat-input font-mono text-xs text-white"
                />
                <button
                  onClick={handleCopyKey}
                  className="px-3.5 py-2.5 rounded bg-black hover:bg-neutral-900 text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-800 hover:border-red-600 transition-colors shrink-0"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-red-500" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Secret Encryption Key (X-API-Secret & AES-256 Key)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showSecret ? 'text' : 'password'}
                  readOnly
                  value={credentials.apiSecret}
                  className="w-full p-2.5 rounded flat-input font-mono text-xs text-white"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-2.5 rounded bg-black hover:bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-red-600 transition-colors shrink-0"
                  title={showSecret ? 'Hide secret' : 'Show secret'}
                >
                  {showSecret ? <EyeOff className="w-4 h-4 text-neutral-400" /> : <Eye className="w-4 h-4 text-neutral-400" />}
                </button>
                <button
                  onClick={handleCopySecret}
                  className="px-3.5 py-2.5 rounded bg-black hover:bg-neutral-900 text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-800 hover:border-red-600 transition-colors shrink-0"
                >
                  {copiedSecret ? <Check className="w-4 h-4 text-red-500" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                  <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-500 font-mono">
                Created: {new Date(credentials.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={handleGenerateNewPair}
                className="px-3 py-1.5 rounded bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rotate & Generate New Pair</span>
              </button>
            </div>
          </div>

          {/* Live AES-256 Encrypt/Decrypt Tester */}
          <div className="flat-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-neutral-800 pb-2">
              <Cpu className="w-4 h-4 text-red-500" />
              <span>Live AES-256 Payload Encryption & Decryption Tester</span>
            </div>

            <div className="space-y-2.5">
              <textarea
                rows={3}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full p-2.5 rounded flat-input font-mono text-xs text-white placeholder:text-neutral-600"
                placeholder="Enter JSON payload to test AES-256 encryption..."
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleTestEncrypt}
                  className="px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                >
                  Encrypt Payload (AES-256)
                </button>
                {encryptedResult && (
                  <button
                    onClick={handleTestDecrypt}
                    className="px-3.5 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-bold transition-colors"
                  >
                    Decrypt Ciphertext
                  </button>
                )}
              </div>
            </div>

            {encryptedResult && (
              <div className="p-3 rounded bg-black border border-neutral-800 font-mono text-xs">
                <span className="block text-[10px] text-red-400 font-bold uppercase mb-1">AES-256 Ciphertext:</span>
                <div className="text-neutral-300 break-all">{encryptedResult}</div>
              </div>
            )}

            {decryptedResult && (
              <div className="p-3 rounded bg-black border border-red-900 font-mono text-xs">
                <span className="block text-[10px] text-red-400 font-bold uppercase mb-1">Decrypted JSON Payload:</span>
                <pre className="text-white overflow-x-auto">{decryptedResult}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

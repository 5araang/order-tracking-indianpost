import React, { useState } from 'react';
import { BookOpen, Copy, Check, Terminal, Lock, ShieldCheck, Play, Loader2, Key } from 'lucide-react';
import { SecurityService } from '../services/securityService';

export const ApiDocs: React.FC = () => {
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'curl' | 'javascript' | 'python'>('curl');

  // Dynamic origin detection (e.g. https://indian-post-track-order.vercel.app)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://indian-post-track-order.vercel.app';

  // Interactive Test Sandbox State
  const [testCode, setTestCode] = useState('');
  const [useAuthHeaders, setUseAuthHeaders] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);

  const creds = SecurityService.getCredentials();

  const copyToClipboard = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  const handleRunApiTest = async () => {
    if (!testCode.trim()) return;
    setIsTestLoading(true);
    setTestResult(null);

    const headers: Record<string, string> = {};
    if (useAuthHeaders) {
      headers['X-API-Key'] = creds.apiKey;
      headers['X-API-Secret'] = creds.apiSecret;
    }

    try {
      const res = await fetch(`/v1/api/track/${testCode.trim().toUpperCase()}`, { headers });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message || 'API test request failed' });
    } finally {
      setIsTestLoading(false);
    }
  };

  const targetCode = testCode.trim() || ':code';

  const snippets = {
    curl: useAuthHeaders
      ? `curl -X GET "${baseUrl}/v1/api/track/${targetCode}" \\\n  -H "X-API-Key: ${creds.apiKey}" \\\n  -H "X-API-Secret: ${creds.apiSecret}"`
      : `curl -X GET "${baseUrl}/v1/api/track/${targetCode}"`,

    javascript: useAuthHeaders
      ? `// Unencrypted JSON Response (Valid API Key & Secret Headers)
const response = await fetch('${baseUrl}/v1/api/track/${targetCode}', {
  headers: {
    'X-API-Key': '${creds.apiKey}',
    'X-API-Secret': '${creds.apiSecret}'
  }
});
const data = await response.json();
console.log(data);`
      : `// Encrypted AES-256 Ciphertext Response (No API Key Provided)
const response = await fetch('${baseUrl}/v1/api/track/${targetCode}');
const data = await response.json();
console.log(data);
// Output: { success: true, encrypted: true, ciphertext: "..." }`,

    python: useAuthHeaders
      ? `import requests

url = "${baseUrl}/v1/api/track/${targetCode}"
headers = {
    "X-API-Key": "${creds.apiKey}",
    "X-API-Secret": "${creds.apiSecret}"
}
response = requests.get(url, headers=headers)
print(response.json())`
      : `import requests

url = "${baseUrl}/v1/api/track/${targetCode}"
response = requests.get(url)
print(response.json())`
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left">
      {/* Top Banner */}
      <div className="flat-card p-6 space-y-3 border-red-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white font-bold shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">REST API & Encrypted Route Specification</h2>
            <p className="text-xs text-neutral-400 font-mono">Endpoint: {baseUrl}/v1/api/track/:code</p>
          </div>
        </div>

        <div className="p-3.5 rounded bg-black border border-neutral-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-red-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>API Key Protection Rules</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
            <li>
              <strong>No API Key Provided</strong>: Endpoint returns 200 OK with <code className="text-red-400">encrypted: true</code> and full AES-256 encrypted payload ciphertext.
            </li>
            <li>
              <strong>Valid API Key & Secret Headers</strong>: Endpoint returns <code className="text-red-400">encrypted: false</code> with clean unencrypted JSON payload directly!
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive API Sandbox */}
      <div className="flat-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-red-500" />
            <h3 className="text-base font-bold text-white">Interactive Endpoint Sandbox</h3>
          </div>
          <span className="text-xs font-mono text-neutral-400 truncate max-w-[240px]">{baseUrl}/v1/api/track/:code</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Tracking Code
            </label>
            <input
              type="text"
              value={testCode}
              onChange={(e) => setTestCode(e.target.value.toUpperCase())}
              placeholder="Enter code..."
              className="w-full px-3 py-2 rounded flat-input text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="authCheck"
              checked={useAuthHeaders}
              onChange={(e) => setUseAuthHeaders(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
            <label htmlFor="authCheck" className="text-xs font-semibold text-neutral-200 cursor-pointer flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-red-500" />
              <span>Send API Key & Secret</span>
            </label>
          </div>

          <button
            onClick={handleRunApiTest}
            disabled={isTestLoading || !testCode.trim()}
            className="w-full py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isTestLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Execute Test Request</span>
              </>
            )}
          </button>
        </div>

        {/* Live Test Response Output */}
        {testResult && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Response Payload ({testResult.encrypted ? 'Encrypted Ciphertext' : 'Unencrypted JSON'}):</span>
              <span className={`font-mono font-bold ${testResult.encrypted ? 'text-red-400' : 'text-white'}`}>
                {testResult.encrypted ? 'SECURED (NO HEADERS)' : 'AUTHENTICATED (JSON)'}
              </span>
            </div>
            <pre className="p-4 rounded bg-black border border-neutral-800 font-mono text-xs text-neutral-200 overflow-x-auto max-h-72 leading-relaxed">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Code Snippets */}
      <div className="flat-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-500" />
            <h3 className="text-base font-bold text-white">Client Code Snippets</h3>
          </div>

          <div className="flex items-center gap-1 bg-black p-1 rounded border border-neutral-800">
            {(['curl', 'javascript', 'python'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                  activeLang === lang
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => copyToClipboard(snippets[activeLang], activeLang)}
            className="absolute right-3 top-3 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 hover:border-white text-neutral-300 text-xs font-bold transition-colors flex items-center gap-1 z-10"
          >
            {copiedLang === activeLang ? (
              <>
                <Check className="w-3.5 h-3.5 text-red-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <pre className="p-4 rounded bg-black border border-neutral-800 font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed">
            {snippets[activeLang]}
          </pre>
        </div>
      </div>
    </div>
  );
};

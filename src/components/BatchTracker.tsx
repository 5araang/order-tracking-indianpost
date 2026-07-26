import React, { useState } from 'react';
import { Layers, Play, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { ConsignmentData } from '../types/tracking';

export const BatchTracker: React.FC = () => {
  const [inputCodes, setInputCodes] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ConsignmentData[]>([]);

  const handleRunBatch = async () => {
    const codes = inputCodes
      .split(/[\n,]+/)
      .map(c => c.trim().toUpperCase())
      .filter(c => c.length > 0);

    if (codes.length === 0) return;

    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const tempResults: ConsignmentData[] = [];
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      try {
        const res = await ApiService.fetchConsignment(code);
        tempResults.push(res);
      } catch (err) {
        tempResults.push({
          id: code,
          origin: 'Failed',
          booking_date: 'N/A',
          pincode: 'N/A',
          tariff: '0',
          category: 'Error',
          destination: 'N/A',
          delivered: false,
          delivery_date: 'N/A',
          events: []
        });
      }
      setProgress(Math.round(((i + 1) / codes.length) * 100));
      setResults([...tempResults]);
    }
    setIsRunning(false);
  };

  const handleExportCsv = () => {
    if (results.length === 0) return;
    const headers = ['ID', 'Category', 'Origin', 'Destination', 'Booking Date', 'Delivered', 'Last Event'];
    const rows = results.map(r => [
      r.id,
      r.category,
      `"${r.origin}"`,
      `"${r.destination}"`,
      r.booking_date,
      r.delivered ? 'YES' : 'NO',
      `"${r.events && r.events.length > 0 ? r.events[0].description : 'N/A'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indiapost_batch_results_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4 text-left">
      <div className="flat-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-white">Batch Consignment Tracker</h3>
          </div>

          {results.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Enter Multiple Tracking Codes (One per line)
            </label>
            <textarea
              rows={4}
              value={inputCodes}
              onChange={(e) => setInputCodes(e.target.value)}
              placeholder="ENTER_TRACKING_CODES_HERE (ONE_PER_LINE)"
              className="w-full p-3 rounded flat-input font-mono text-xs uppercase"
              disabled={isRunning}
            />
          </div>

          <button
            onClick={handleRunBatch}
            disabled={isRunning || !inputCodes.trim()}
            className="w-full py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Batch ({progress}%)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Batch Tracking</span>
              </>
            )}
          </button>

          {/* Progress Bar */}
          {isRunning && (
            <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-neutral-800">
              <div
                className="bg-red-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Results Table */}
          {results.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-black text-neutral-400 font-semibold uppercase tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-2.5">Tracking ID</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Origin</th>
                    <th className="p-2.5">Destination</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-neutral-900/60">
                      <td className="p-2.5 font-mono font-bold text-white">{r.id}</td>
                      <td className="p-2.5">{r.category}</td>
                      <td className="p-2.5">{r.origin}</td>
                      <td className="p-2.5">{r.destination}</td>
                      <td className="p-2.5">
                        {r.delivered ? (
                          <span className="text-red-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-500" /> Delivered
                          </span>
                        ) : (
                          <span className="text-neutral-400 font-semibold">In Transit</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ConsignmentData } from '../types/tracking';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, CreditCard, Database, Zap } from 'lucide-react';

interface SummaryCardsProps {
  data: ConsignmentData & { latency_ms?: number };
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  return (
    <div className="space-y-3 mb-4 text-left">
      {/* Header Card */}
      <div className="flat-card-red p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg md:text-2xl font-bold font-mono tracking-wide text-white">
              {data.id}
            </h3>
            <StatusBadge delivered={data.delivered} />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
            <span>Category: <strong className="text-white font-semibold">{data.category}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-red-500" />
              Source: <strong className="text-red-400 font-semibold">{data.source || 'LIVE_INDIAPOST_GOV'}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center sm:flex-col sm:items-end gap-2 text-xs">
          {data.latency_ms !== undefined && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black border border-red-800 text-red-400 font-mono text-[11px] font-bold">
              <Zap className="w-3 h-3 text-red-500" />
              <span>{data.latency_ms} ms</span>
            </div>
          )}

          {data.fetched_at && (
            <span className="text-[10px] text-neutral-400 font-mono">
              {new Date(data.fetched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <div className="flat-card p-3 border-l-2 border-l-red-600">
          <div className="flex items-center gap-1 text-neutral-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-0.5">
            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
            <span>Origin</span>
          </div>
          <div className="text-xs md:text-sm font-bold text-white truncate" title={data.origin}>
            {data.origin}
          </div>
        </div>

        <div className="flat-card p-3 border-l-2 border-l-red-600">
          <div className="flex items-center gap-1 text-neutral-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-0.5">
            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
            <span>Destination</span>
          </div>
          <div className="text-xs md:text-sm font-bold text-white truncate" title={data.destination}>
            {data.destination}
          </div>
        </div>

        <div className="flat-card p-3 border-l-2 border-l-red-600">
          <div className="flex items-center gap-1 text-neutral-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-0.5">
            <Calendar className="w-3 h-3 text-red-500 shrink-0" />
            <span>Booking Date</span>
          </div>
          <div className="text-xs md:text-sm font-bold text-white">
            {data.booking_date ? data.booking_date.split('T')[0] : 'N/A'}
          </div>
        </div>

        <div className="flat-card p-3 border-l-2 border-l-red-600">
          <div className="flex items-center gap-1 text-neutral-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-0.5">
            <CreditCard className="w-3 h-3 text-red-500 shrink-0" />
            <span>Pincode / Tariff</span>
          </div>
          <div className="text-xs md:text-sm font-bold text-white">
            {data.pincode !== 'N/A' ? `${data.pincode} (${data.tariff})` : data.tariff}
          </div>
        </div>
      </div>
    </div>
  );
};

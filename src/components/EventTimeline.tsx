import React from 'react';
import { TrackingEvent } from '../types/tracking';
import { Clock, Building2, CheckCircle2, Truck, Package, Send, Navigation, MapPin } from 'lucide-react';

interface EventTimelineProps {
  events: TrackingEvent[];
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="flat-card p-6 md:p-8 text-left">
        <Package className="w-8 h-8 md:w-10 md:h-10 text-neutral-500 mb-2" />
        <h4 className="text-xs md:text-sm font-bold text-white">No Tracking Events Recorded Yet</h4>
        <p className="text-[11px] md:text-xs text-neutral-400 max-w-sm mt-1">
          Tracking events will appear here as the package moves through postal sorting hubs.
        </p>
      </div>
    );
  }

  // Chronological order (oldest to newest for journey route calculation)
  const chronologicalEvents = [...events].reverse();
  const latestEvent = events[0];

  // Extract unique postal offices along the journey route
  const uniqueOffices: string[] = [];
  chronologicalEvents.forEach((ev) => {
    if (ev.office && !uniqueOffices.includes(ev.office)) {
      uniqueOffices.push(ev.office);
    }
  });

  const originOffice = uniqueOffices[0] || 'Origin';
  const destinationOffice = uniqueOffices[uniqueOffices.length - 1] || 'Destination';
  const currentOffice = latestEvent.office || destinationOffice;

  // Calculate vehicle journey progress percentage
  const isDelivered = latestEvent.status === 'DELIVERED' || latestEvent.description.toUpperCase().includes('DELIVERED');
  const activeHubIndex = uniqueOffices.indexOf(currentOffice);
  
  const totalSteps = Math.max(uniqueOffices.length - 1, 1);
  const journeyProgressPct = isDelivered ? 100 : Math.round((activeHubIndex / totalSteps) * 100);

  const getEventIcon = (status?: string, desc?: string) => {
    const text = `${status || ''} ${desc || ''}`.toUpperCase();
    if (text.includes('DELIVERED') || text.includes('ITEM_DELIVERY')) {
      return <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />;
    }
    if (text.includes('OUT FOR DELIVERY') || text.includes('TAKEN OUT') || text.includes('INVOICE')) {
      return <Truck className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />;
    }
    if (text.includes('DISPATCH') || text.includes('OUTWARD')) {
      return <Send className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />;
    }
    return <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-400" />;
  };

  return (
    <div className="space-y-4 text-left">
      {/* Detailed Activity Events Timeline */}
      <div className="flat-card p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              Tracking Activity Details ({events.length} Events)
            </h3>
            <p className="text-[11px] md:text-xs text-neutral-400">Sorted from latest location update to booking</p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {events.map((ev, index) => {
            const isLatest = index === 0;
            const isLast = index === events.length - 1;

            return (
              <div key={index} className="relative flex items-center gap-3 md:gap-4">
                <div className="relative flex flex-col items-center justify-center shrink-0 w-7 md:w-8 self-stretch">
                  {!isLast && (
                    <div className="w-0.5 bg-neutral-800 absolute top-1/2 bottom-0 -mb-4 pointer-events-none" />
                  )}
                  {index > 0 && (
                    <div className="w-0.5 bg-neutral-800 absolute top-0 bottom-1/2 -mt-4 pointer-events-none" />
                  )}

                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border transition-colors z-10 my-auto ${
                    isLatest
                      ? 'bg-black border-red-600 text-red-500 shadow-sm'
                      : 'bg-black border-neutral-800 text-neutral-400'
                  }`}>
                    {getEventIcon(ev.status, ev.description)}
                  </div>
                </div>

                <div className={`flex-1 p-3 md:p-3.5 rounded border ${
                  isLatest
                    ? 'bg-black border-red-600/90'
                    : 'bg-black/60 border-neutral-800'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500 shrink-0" />
                      <span className="font-bold text-xs md:text-sm text-white">{ev.office}</span>
                    </div>

                    <span className="font-mono text-[10px] md:text-xs text-neutral-400">
                      {ev.date ? (ev.date.includes('T') ? new Date(ev.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : ev.date) : 'N/A'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-neutral-200 leading-snug">
                    {ev.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

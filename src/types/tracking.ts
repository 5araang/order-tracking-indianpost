export interface TrackingEvent {
  date: string;
  office: string;
  description: string;
  location?: string;
  status?: 'BOOKED' | 'DISPATCHED' | 'RECEIVED' | 'DELIVERED' | 'OUT_FOR_DELIVERY' | 'IN_TRANSIT';
}

export interface ConsignmentData {
  id: string;
  origin: string;
  booking_date: string;
  pincode: string;
  tariff: string;
  category: string;
  destination: string;
  delivered: boolean;
  delivery_date: string;
  weight?: string;
  events: TrackingEvent[];
  source?: 'NEXTJS_SERVER_ACTION' | 'DOMESTIC_SCRAPER' | 'INTERNATIONAL_SCRAPER' | 'CACHE' | 'DEMO_MOCK' | 'LIVE_SERVERLESS_API' | 'LIVE_POSTAL_PORTAL';
  raw_response?: any;
  fetched_at?: string;
}

export interface SearchHistoryItem {
  id: string;
  timestamp: string;
  category?: string;
  delivered?: boolean;
  last_office?: string;
  last_event?: string;
}

export interface ApiFetchOptions {
  forceRefresh?: boolean;
  useCache?: boolean;
  timeoutMs?: number;
}

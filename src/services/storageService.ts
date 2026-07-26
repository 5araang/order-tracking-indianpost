import { SearchHistoryItem, ConsignmentData } from '../types/tracking';

const HISTORY_KEY = 'indiapost_tracking_history';
const CACHE_KEY_PREFIX = 'indiapost_cache_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export class StorageService {
  /**
   * Get search history (filters out mock test data IDs)
   */
  static getHistory(): SearchHistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return [];
      const parsed: SearchHistoryItem[] = JSON.parse(data);
      // Clean out test mock IDs automatically
      const cleaned = parsed.filter(h => h && h.id && typeof h.id === 'string' && h.id.trim().length >= 5);
      return cleaned;
    } catch {
      return [];
    }
  }

  /**
   * Add real user search query to history
   */
  static addHistory(item: ConsignmentData): SearchHistoryItem[] {
    try {
      const history = this.getHistory();
      const lastEvent = item.events && item.events.length > 0 ? item.events[0] : null;
      
      const newEntry: SearchHistoryItem = {
        id: item.id,
        timestamp: new Date().toISOString(),
        category: item.category,
        delivered: item.delivered,
        last_office: lastEvent ? lastEvent.office : item.origin,
        last_event: lastEvent ? lastEvent.description : (item.delivered ? 'Delivered' : 'In Transit')
      };

      // Filter out duplicates and keep top 20 real searches
      const filtered = history.filter(h => h.id.toUpperCase() !== item.id.toUpperCase());
      const updated = [newEntry, ...filtered].slice(0, 20);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return this.getHistory();
    }
  }

  /**
   * Remove single entry from history
   */
  static removeHistory(id: string): SearchHistoryItem[] {
    try {
      const history = this.getHistory();
      const updated = history.filter(h => h.id.toUpperCase() !== id.toUpperCase());
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  }

  /**
   * Clear all search history
   */
  static clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  }

  // Cache helper methods
  static getCached(id: string): ConsignmentData | null {
    try {
      const data = localStorage.getItem(CACHE_KEY_PREFIX + id.toUpperCase());
      if (!data) return null;
      const parsed = JSON.parse(data);
      const now = Date.now();
      if (now - parsed.timestamp > CACHE_TTL_MS) {
        localStorage.removeItem(CACHE_KEY_PREFIX + id.toUpperCase());
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }

  static setCached(id: string, data: ConsignmentData): void {
    try {
      const cacheObj = {
        timestamp: Date.now(),
        data
      };
      localStorage.setItem(CACHE_KEY_PREFIX + id.toUpperCase(), JSON.stringify(cacheObj));
    } catch {}
  }
}

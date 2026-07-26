import CryptoJS from 'crypto-js';

const CREDENTIALS_KEY = 'indiapost_sec_credentials';
const env = (import.meta as any).env || {};
export const DEFAULT_SECRET_KEY = env.VITE_INDIAPOST_API_SECRET;

export interface ApiCredentials {
  apiKey: string;
  apiSecret: string;
  createdAt: string;
  name: string;
  active: boolean;
}

export class SecurityService {
  /**
   * Get or initialize developer API credentials from .env environment or local storage
   */
  static getCredentials(): ApiCredentials {
    try {
      const saved = localStorage.getItem(CREDENTIALS_KEY);
      if (saved) return JSON.parse(saved);
    } catch { }

    const envApiKey = env.VITE_INDIAPOST_API_KEY;
    const envApiSecret = env.VITE_INDIAPOST_API_SECRET;

    if (envApiKey && envApiSecret) {
      const envCreds: ApiCredentials = {
        apiKey: envApiKey,
        apiSecret: envApiSecret,
        createdAt: new Date().toISOString(),
        name: 'Enterprise Environment Key',
        active: true
      };
      this.saveCredentials(envCreds);
      return envCreds;
    }

    const newCreds = this.generateNewPair('Default Store API Key');
    this.saveCredentials(newCreds);
    return newCreds;
  }

  /**
   * Save API Credentials
   */
  static saveCredentials(creds: ApiCredentials): void {
    try {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    } catch { }
  }

  /**
   * Generate a fresh API Key + Secret Pair
   */
  static generateNewPair(name = 'New App Key'): ApiCredentials {
    const randomHex = CryptoJS.lib.WordArray.random(16).toString();
    const secretHex = CryptoJS.lib.WordArray.random(24).toString();

    return {
      apiKey: `ip_live_${randomHex.substring(0, 16)}`,
      apiSecret: `sec_${secretHex}`,
      createdAt: new Date().toISOString(),
      name,
      active: true
    };
  }

  /**
   * Encrypt object data to AES-256 ciphertext string
   */
  static encryptPayload(data: any, secretKey: string = DEFAULT_SECRET_KEY): string {
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, secretKey).toString();
  }

  /**
   * Decrypt AES-256 ciphertext string back to object
   */
  static decryptPayload(ciphertext: string, secretKey: string = DEFAULT_SECRET_KEY): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decryptedStr);
    } catch {
      return decryptedStr;
    }
  }
}

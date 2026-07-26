const AUTH_STORAGE_KEY = 'indiapost_auth_user';

export class AuthService {
  /**
   * Read auth credentials directly from .env file
   */
  static getEnvCredentials(): { email: string; pass: string } {
    const env = (import.meta as any).env || {};
    return {
      email: env.VITE_ADMIN_EMAIL || 'admin@indiapost.gov.in',
      pass: env.VITE_ADMIN_PASSWORD || 'adminpass123'
    };
  }

  /**
   * Check if current session is authenticated in LocalStorage or SessionStorage
   */
  static isAuthenticated(): boolean {
    try {
      const local = localStorage.getItem(AUTH_STORAGE_KEY);
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return Boolean(local || session);
    } catch {
      return false;
    }
  }

  /**
   * Get logged-in user email from persistent storage cache
   */
  static getAuthenticatedUser(): string | null {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Verify email & password against .env variables and persist session cache
   */
  static login(emailInput: string, passwordInput: string): { success: boolean; error?: string } {
    const { email, pass } = this.getEnvCredentials();

    if (emailInput.trim().toLowerCase() === email.trim().toLowerCase() && passwordInput === pass) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, emailInput.trim().toLowerCase());
        sessionStorage.setItem(AUTH_STORAGE_KEY, emailInput.trim().toLowerCase());
      } catch {}
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Please try again.'
    };
  }

  /**
   * Destroy local and session storage session tokens
   */
  static logout(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  }
}

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchHeader } from './components/SearchHeader';
import { SummaryCards } from './components/SummaryCards';
import { EventTimeline } from './components/EventTimeline';
import { JsonInspector } from './components/JsonInspector';
import { ApiDocs } from './components/ApiDocs';
import { LoginPage } from './components/LoginPage';
import { SidebarDrawer } from './components/SidebarDrawer';
import { SecurityKeysModal } from './components/SecurityKeysModal';
import { Footer } from './components/Footer';

import { ApiService } from './services/apiService';
import { StorageService } from './services/storageService';
import { SecurityService, ApiCredentials } from './services/securityService';
import { AuthService } from './services/authService';
import { ConsignmentData, SearchHistoryItem } from './types/tracking';
import { AlertCircle, Clock, Code2, Lock, Package } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AuthService.isAuthenticated());

  // Force login view if not authenticated
  const [activeView, setActiveView] = useState<'single' | 'docs' | 'login'>(() => {
    if (!AuthService.isAuthenticated()) return 'login';
    const path = window.location.pathname;
    if (path.startsWith('/docs')) return 'docs';
    return 'single';
  });

  const [currentData, setCurrentData] = useState<(ConsignmentData & { latency_ms?: number }) | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'json'>('timeline');

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState<boolean>(false);

  const [credentials, setCredentials] = useState<ApiCredentials>(SecurityService.getCredentials());
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(StorageService.getHistory());

    const handlePopState = () => {
      if (!AuthService.isAuthenticated()) {
        setActiveView('login');
        return;
      }
      const path = window.location.pathname;
      if (path.startsWith('/docs')) setActiveView('docs');
      else setActiveView('single');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const changeView = (view: 'single' | 'docs' | 'login') => {
    if (!AuthService.isAuthenticated() && view !== 'login') {
      setActiveView('login');
      window.history.pushState({}, '', '/login');
      return;
    }

    setActiveView(view);
    let targetPath = '/';
    if (view === 'docs') targetPath = '/docs';
    if (view === 'login') targetPath = '/login';

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    changeView('single');
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setActiveView('login');
    window.history.pushState({}, '', '/login');
  };

  const handleSearch = async (trackingId: string, forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ApiService.fetchConsignment(trackingId, { forceRefresh });
      setCurrentData(result);
      setHistory(StorageService.getHistory());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consignment details.');
      setCurrentData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentData) {
      handleSearch(currentData.id, true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <div className="flex-1 py-6 flex flex-col justify-center">
        {/* Hide Header when on Login Page */}
        {activeView !== 'login' && (
          <Navbar
            activeView={activeView}
            onChangeView={changeView}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            isLoading={isLoading}
          />
        )}

        <main className="container mx-auto my-auto">
          {/* Unauthenticated Forced Protected Guard Banner */}
          {!isAuthenticated && activeView !== 'login' && (
            <div className="w-full max-w-3xl mx-auto my-8 flat-card p-8 text-left space-y-4">
              <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center text-white font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Authentication Required</h3>
              <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                You must log in with your environment administrator credentials to access the enterprise tracking portal.
              </p>
              <button
                onClick={() => changeView('login')}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
              >
                Go to Login Page
              </button>
            </div>
          )}

          {/* Authenticated Main Tracker View */}
          {isAuthenticated && activeView === 'single' && (
            <>
              <SearchHeader onSearch={(id) => handleSearch(id)} isLoading={isLoading} />

              {/* Error Alert */}
              {error && (
                <div className="w-full max-w-3xl mx-auto mb-6 p-4 rounded bg-black border border-red-800 text-red-300 text-xs md:text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold">Tracking Error</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Empty State Banner */}
              {!currentData && !isLoading && !error && (
                <div className="w-full max-w-3xl mx-auto flat-card p-6 md:p-8 text-center space-y-2.5">
                  <div className="w-11 h-11 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 mx-auto">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white tracking-tight">Ready to Track Consignment</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Enter any 13-character India Post Consignment ID into the search bar above to fetch live tracking details.
                  </p>
                </div>
              )}

              {/* Consignment Data View */}
              {currentData && (
                <div className="w-full max-w-4xl mx-auto space-y-6">
                  <SummaryCards data={currentData} />

                  {/* Tab Navigation */}
                  <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 mb-4">
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`px-3 py-1.5 rounded text-xs md:text-sm font-semibold transition-colors flex items-center gap-2 ${
                        activeTab === 'timeline'
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Visual Activity Timeline</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('json')}
                      className={`hidden sm:flex px-3 py-1.5 rounded text-xs md:text-sm font-semibold transition-colors items-center gap-2 ${
                        activeTab === 'json'
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Raw API JSON Output</span>
                    </button>
                  </div>

                  {activeTab === 'timeline' ? (
                    <EventTimeline events={currentData.events} />
                  ) : (
                    <JsonInspector data={currentData} />
                  )}
                </div>
              )}
            </>
          )}

          {/* Authenticated API Docs View */}
          {isAuthenticated && activeView === 'docs' && <ApiDocs />}

          {/* Login Page View (Full Centered Standalone Screen) */}
          {activeView === 'login' && (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )}
        </main>
      </div>

      {/* Hide Footer when on Login Page */}
      {activeView !== 'login' && <Footer />}

      {/* Slide-Out Control Panel Sidebar */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userEmail={AuthService.getAuthenticatedUser()}
        onOpenSecurityKeys={() => setIsSecurityOpen(true)}
        history={history}
        onSelectCode={(code) => {
          changeView('single');
          handleSearch(code);
        }}
        onClearHistory={() => {
          StorageService.clearHistory();
          setHistory([]);
        }}
        onLogout={handleLogout}
      />

      <SecurityKeysModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        credentials={credentials}
        onRegenerate={() => setCredentials(SecurityService.getCredentials())}
      />
    </div>
  );
}

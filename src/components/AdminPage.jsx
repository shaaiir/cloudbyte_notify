import React, { useState } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from './AdminLoginModal';

export function AdminPage({ subscribers, onClearSubscribers, webhookUrl, onSaveWebhook, onReturnHome }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('cloudbyte_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urlInput, setUrlInput] = useState(webhookUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError('');
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('cloudbyte_admin_auth', 'true');
      } catch (err) {
        console.error('Session error:', err);
      }
    } else {
      setError('Invalid admin credentials. Access denied.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('cloudbyte_admin_auth');
    } catch (err) {
      console.error('Session error:', err);
    }
  };

  // Download collected emails as CSV
  const handleDownloadCSV = () => {
    if (!subscribers || subscribers.length === 0) return;
    
    const csvHeader = 'ID,Email,Date,Timestamp\n';
    const csvRows = subscribers.map(s => `"${s.id}","${s.email}","${s.date}","${s.timestamp}"`).join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cloudbyte_emails_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy all emails as comma-separated list
  const handleCopyAll = () => {
    if (!subscribers || subscribers.length === 0) return;
    const emailList = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveWebhook = (e) => {
    e.preventDefault();
    onSaveWebhook(urlInput.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-gray-100 p-4 sm:p-8 flex flex-col justify-between select-none">
      
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between border-b border-neutral-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-black shrink-0 border border-neutral-700">
            <video src="/logo-cloudbyte.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
              <span>Cloudbyte Admin Endpoint</span>
            </h1>
            <span className="text-[11px] font-mono text-emerald-400">
              URL: /Y2xvdWRieXRlaXNtaW5lbm9vbmVjYW5hY2Nlc3M=
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReturnHome}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-neutral-700"
          >
            ← Return to Main Site
          </button>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              🔒 Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto my-auto flex flex-col items-center">
        {!isAuthenticated ? (
          /* LOGIN GATE FORM */
          <div className="w-full max-w-md bg-[#141416] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            <div className="text-center flex flex-col gap-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl mb-2">
                🔒
              </div>
              <h2 className="text-2xl font-extrabold text-white font-display">
                Admin Authentication Required
              </h2>
              <p className="text-xs text-neutral-400">
                Secret Endpoint: <code className="text-emerald-400 font-mono">/Y2xvdWRieXRlaXNtaW5lbm9vbmVjYW5hY2Nlc3M=</code>
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-black/60 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Admin Password
                </label>
                <div className="relative w-full flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-black/60 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all font-mono pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-xs text-neutral-400 hover:text-white font-medium cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-lg mt-2 cursor-pointer"
              >
                Authenticate & View Collected Emails
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="w-full bg-[#141416] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-white font-display flex items-center gap-2">
                  <span>📩 Collected Visitor Emails</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-sm px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {subscribers.length}
                  </span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Emails collected live from visitors submitting the countdown landing form.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleDownloadCSV}
                  disabled={subscribers.length === 0}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl transition-all shadow cursor-pointer flex items-center gap-1.5"
                >
                  📥 Export CSV
                </button>
                <button
                  onClick={handleCopyAll}
                  disabled={subscribers.length === 0}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? '✓ Copied!' : '📋 Copy All'}
                </button>
                {subscribers.length > 0 && (
                  <button
                    onClick={onClearSubscribers}
                    className="px-3.5 py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                  >
                    🗑️ Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Webhook Settings Section */}
            <form onSubmit={handleSaveWebhook} className="flex flex-col gap-2 bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span>🔗 Live Webhook / API Endpoint Integration:</span>
                {saveSuccess && <span className="text-emerald-400 text-xs font-bold">✓ Webhook Endpoint Saved!</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. https://formspree.io/f/xyz or https://your-domain.com/api/subscribe"
                  className="flex-1 bg-black/80 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Endpoint
                </button>
              </div>
            </form>

            {/* Emails Table */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden">
              {subscribers.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 text-sm font-medium">
                  No emails collected yet. Visitor submissions will appear here automatically!
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono text-[10px] sticky top-0 z-10 border-b border-neutral-800">
                      <tr>
                        <th className="px-4 py-3.5">#</th>
                        <th className="px-4 py-3.5">Email Address</th>
                        <th className="px-4 py-3.5">Date & Time Collected</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80 font-medium">
                      {subscribers.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="px-4 py-3 text-neutral-500 font-mono">{index + 1}</td>
                          <td className="px-4 py-3 text-emerald-400 font-mono font-bold text-sm">{item.email}</td>
                          <td className="px-4 py-3 text-neutral-400 text-xs">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto border-t border-neutral-900 pt-4 text-center text-xs text-neutral-500">
        🔒 Secret Endpoint Admin Panel • Endpoint URL: <code className="text-emerald-400 font-mono">/Y2xvdWRieXRlaXNtaW5lbm9vbmVjYW5hY2Nlc3M=</code>
      </footer>

    </div>
  );
}

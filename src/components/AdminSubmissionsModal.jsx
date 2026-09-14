import React, { useState } from 'react';

export function AdminSubmissionsModal({ isOpen, onClose, onLogout, subscribers, onClear, webhookUrl, onSaveWebhook }) {
  const [copied, setCopied] = useState(false);
  const [urlInput, setUrlInput] = useState(webhookUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Download collected emails as a CSV file
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#18181b] text-gray-100 border border-neutral-700 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
              📩 Collected Emails ({subscribers.length})
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              All emails collected from visitors on this landing page.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              🔒 Logout
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              disabled={subscribers.length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow cursor-pointer"
            >
              📥 Download CSV
            </button>
            <button
              onClick={handleCopyAll}
              disabled={subscribers.length === 0}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? '✓ Copied!' : '📋 Copy All'}
            </button>
          </div>

          {subscribers.length > 0 && (
            <button
              onClick={onClear}
              className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 text-xs font-bold rounded-lg transition-all cursor-pointer"
            >
              🗑️ Clear All
            </button>
          )}
        </div>

        {/* Webhook Configuration Section */}
        <form onSubmit={handleSaveWebhook} className="flex flex-col gap-2 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-800/80">
          <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
            <span>🔗 Live Webhook / API Endpoint (Optional):</span>
            {saveSuccess && <span className="text-emerald-400 text-[11px] font-bold">✓ Webhook Saved!</span>}
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://formspree.io/f/xyz or https://your-domain.com/api/subscribe"
              className="flex-1 bg-black/60 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Save URL
            </button>
          </div>
        </form>

        {/* Subscribers Table / List */}
        <div className="flex-1 overflow-y-auto pr-1">
          {subscribers.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm font-medium">
              No emails collected yet. Visitor submissions will appear here automatically!
            </div>
          ) : (
            <div className="overflow-x-auto border border-neutral-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3 border-b border-neutral-800">#</th>
                    <th className="px-4 py-3 border-b border-neutral-800">Email Address</th>
                    <th className="px-4 py-3 border-b border-neutral-800">Date Collected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-medium">
                  {subscribers.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="px-4 py-3 text-neutral-500 font-mono">{index + 1}</td>
                      <td className="px-4 py-3 text-emerald-400 font-mono font-bold">{item.email}</td>
                      <td className="px-4 py-3 text-neutral-400 text-[11px]">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Emails are automatically stored in browser storage (`localStorage`).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

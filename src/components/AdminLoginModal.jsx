import React, { useState } from 'react';

// Hardcoded Secure Admin Credentials
export const ADMIN_USERNAME = 'cloudbyte_admin';
export const ADMIN_PASSWORD = 'CloudByte#2026!SecureAdmin@89Xq';

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError('');
      setUsername('');
      setPassword('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Access denied.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#18181b] text-gray-100 border border-neutral-700 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
              🔒 Admin Access Login
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Protected area for website administrator.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Username input */}
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
              className="w-full bg-black/60 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Password input */}
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
                className="w-full bg-black/60 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all pr-12"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-lg mt-2 cursor-pointer"
          >
            Authenticate & Access Dashboard
          </button>
        </form>

        {/* Security badge footer */}
        <div className="text-center text-[11px] text-neutral-500 border-t border-neutral-800/80 pt-3">
          🔒 Secure 256-Bit Encrypted Admin Portal
        </div>

      </div>
    </div>
  );
}

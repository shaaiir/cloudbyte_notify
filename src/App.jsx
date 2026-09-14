import React, { useState, useEffect } from 'react';
import { FlipDigit } from './components/FlipDigit';
import { AdminPage } from './components/AdminPage';
import { soundFx } from './utils/audio';

// Official Synchronized Global Launch Target: October 31, 2026 00:00:00 UTC
const LAUNCH_TARGET_TIME = new Date('2026-10-31T00:00:00Z').getTime();

// Email format validation regex (strictly requires format like name@domain.com)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Secret Endpoint URL String
const SECRET_ENDPOINT = 'Y2xvdWRieXRlaXNtaW5lbm9vbmVjYW5hY2Nlc3M=';

export default function App() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, LAUNCH_TARGET_TIME - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  });
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Route state to check if user is visiting the secret admin endpoint
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const href = window.location.href;
    return `${path} ${hash} ${href}`;
  });

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const href = window.location.href;
      setCurrentRoute(`${path} ${hash} ${href}`);
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const isAdminRoute =
    currentRoute.includes(SECRET_ENDPOINT) ||
    currentRoute.includes('cloudbyteisminenonecanaccess') ||
    window.location.href.includes(SECRET_ENDPOINT) ||
    window.location.pathname.includes(SECRET_ENDPOINT) ||
    window.location.hash.includes(SECRET_ENDPOINT);

  // Persistent subscribers stored in localStorage
  const [subscribers, setSubscribers] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudbyte_collected_emails');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Optional Webhook / Server URL stored in localStorage
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('cloudbyte_webhook_url') || '';
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@') || !EMAIL_REGEX.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      setSubmitted(false);
      return;
    }
    setEmailError('');
    setIsLoading(true);

    // Save collected email persistently
    const newEntry = {
      id: Date.now(),
      email: trimmed,
      date: new Date().toLocaleString(),
      timestamp: Date.now()
    };

    setSubscribers(prev => {
      if (prev.some(item => item.email.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('cloudbyte_collected_emails', JSON.stringify(updated));
      } catch (err) {
        console.error('Storage error:', err);
      }
      return updated;
    });

    // Optional Live Webhook POST dispatch
    if (webhookUrl) {
      try {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry)
        }).catch(err => console.warn('Webhook post warning:', err));
      } catch (err) {
        console.warn('Webhook dispatch failed:', err);
      }
    }

    // Smooth loading spinner before showing success checkmark
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleSaveWebhook = (url) => {
    setWebhookUrl(url);
    try {
      localStorage.setItem('cloudbyte_webhook_url', url);
    } catch (err) {
      console.error('Storage error:', err);
    }
  };

  const handleClearSubscribers = () => {
    if (window.confirm('Are you sure you want to clear all collected emails?')) {
      setSubscribers([]);
      try {
        localStorage.removeItem('cloudbyte_collected_emails');
      } catch (err) {
        console.error('Storage error:', err);
      }
    }
  };

  const handleEmailChange = (e) => {
    const rawVal = e.target.value;
    // Security sanitization: strip any non-email characters (blocking <, >, ", ', ;, script tags, spaces)
    const sanitized = rawVal.replace(/[^a-zA-Z0-9._%+\-@]/g, '');
    setEmail(sanitized);
    if (submitted) setSubmitted(false);

    if (sanitized.length > 0) {
      if (!sanitized.includes('@')) {
        setEmailError("Must include '@' symbol");
      } else if (!EMAIL_REGEX.test(sanitized)) {
        setEmailError("Incomplete email format");
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, LAUNCH_TARGET_TIME - Date.now());

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(prev => {
        if (prev.seconds !== seconds && diff > 0) {
          soundFx.playFlipSound('forward');
        }
        return { days, hours, minutes, seconds };
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // IF VISITING SECRET ADMIN ENDPOINT (/Y2xvdWRieXRlaXNtaW5lbm9vbmVjYW5hY2Nlc3M=)
  if (isAdminRoute) {
    return (
      <AdminPage
        subscribers={subscribers}
        onClearSubscribers={handleClearSubscribers}
        webhookUrl={webhookUrl}
        onSaveWebhook={handleSaveWebhook}
        onReturnHome={() => {
          window.location.href = '/';
        }}
      />
    );
  }

  // PUBLIC LANDING PAGE (Exact public page with 0 admin UI visible to public visitors)
  return (
    <div className="relative w-full min-h-screen bg-[#000000] text-gray-100 overflow-x-hidden flex flex-col justify-between p-3 sm:p-6 md:p-8 select-none bg-pure-black py-4 sm:py-8">
      
      {/* TOP HEADER: CIRCULAR MP4 LOGO & TITLE IMAGE ON TOP LEFT */}
      <header className="relative z-20 w-full max-w-5xl md:max-w-6xl mx-auto flex items-center justify-between mb-4 sm:mb-6 md:mb-8 px-1 sm:px-0">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Circular MP4 Video Logo Container */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center bg-black shrink-0 shadow-md">
            <video
              src="/logo-cloudbyte.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-100"
            />
          </div>

          {/* Title Image */}
          <img
            src="/cloudbytetitle.png"
            alt="Cloudbyte"
            className="h-14 sm:h-16 md:h-20 lg:h-22 object-contain"
          />
        </div>
      </header>

      {/* CENTERED COUNTDOWN DIGITS, NOTIFY VIDEO & SIGNUP CARD */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto w-full gap-5 sm:gap-7 md:gap-8 max-w-5xl md:max-w-6xl mx-auto px-1 sm:px-4">
        {/* Countdown boxes row */}
        <div className="w-full flex items-center justify-center gap-1.5 min-[400px]:gap-2.5 sm:gap-5 md:gap-8 overflow-hidden">
          <FlipDigit digit={timeLeft.days} label="DAYS" crackVariant={0} />
          <div className="text-xl min-[400px]:text-2xl sm:text-4xl md:text-5xl text-sky-400/50 font-extrabold -translate-y-2.5 sm:-translate-y-4 select-none">:</div>

          <FlipDigit digit={timeLeft.hours} label="HOURS" crackVariant={1} />
          <div className="text-xl min-[400px]:text-2xl sm:text-4xl md:text-5xl text-amber-500/50 font-extrabold -translate-y-2.5 sm:-translate-y-4 select-none">:</div>

          <FlipDigit digit={timeLeft.minutes} label="MINUTES" crackVariant={2} />
          <div className="text-xl min-[400px]:text-2xl sm:text-4xl md:text-5xl text-orange-400/50 font-extrabold -translate-y-2.5 sm:-translate-y-4 select-none">:</div>

          <FlipDigit digit={timeLeft.seconds} label="SECONDS" crackVariant={3} />
        </div>

        {/* HORIZONTAL SIDE-BY-SIDE SECTION: VIDEO BANNER (LEFT) + EMAIL SIGNUP CARD (RIGHT) */}
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-5 sm:gap-8 mt-1 sm:mt-2">
          {/* Left: Notify Video Banner (Moved to Left) */}
          <div className="relative w-full md:w-1/2 min-h-[200px] sm:min-h-[260px] md:min-h-0 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <video
              src="/notify.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Right: Ohh, Genius Get Notified Now Card (Placed Horizontally Next to Video) */}
          <div className="w-full md:w-1/2 bg-[#c8c0aa] text-black rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-center items-center gap-4 sm:gap-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-[#b8b09a]">
            {/* Header text */}
            <div className="text-center flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black tracking-tight font-display">
                Ohh, Genius Get Notified Now!
              </h2>
            </div>

            {/* Form with Strict Email Security Validation */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5 sm:gap-4 mt-1">
              <div className="w-full flex flex-col text-left">
                <label className="text-[11px] sm:text-xs font-bold text-neutral-700 tracking-wider uppercase mb-1.5 block">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className={`w-full bg-[#bbb29c] border rounded-xl px-4 py-3 sm:py-3.5 text-black placeholder-neutral-500 font-medium focus:outline-none transition-all text-sm sm:text-base shadow-inner ${
                    emailError
                      ? 'border-red-600 ring-2 ring-red-500/50'
                      : 'border-[#a69e89] focus:ring-2 focus:ring-lime-700'
                  }`}
                />
                {emailError && (
                  <span className="text-xs font-extrabold text-red-700 mt-1.5 flex items-center gap-1">
                    {emailError}
                  </span>
                )}
              </div>

              {/* Pill Button Matching Image with Circular Loading Spinner */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-[#6eb41e] text-black font-extrabold text-base sm:text-lg tracking-tight hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_4px_0_#3f6e14] mt-1 sm:mt-2 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-90"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="w-5 h-5 border-[2.5px] border-black/25 border-t-black rounded-full animate-spin inline-block"></span>
                    <span>Get Notified Now!</span>
                  </div>
                ) : submitted ? (
                  <span>✓ You are subscribed!</span>
                ) : (
                  <span>Get Notified Now!</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Clean Public Footer (Centered Copyright Text) */}
      <footer className="relative z-20 w-full max-w-5xl md:max-w-6xl mx-auto flex items-center justify-center pt-4 pb-2 border-t border-neutral-900/60 text-xs text-neutral-500 text-center">
        <span>© Cloudbyte. All rights reserved.</span>
      </footer>
    </div>
  );
}

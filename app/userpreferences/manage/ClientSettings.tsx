'use client';

import React, { useState, useEffect } from 'react';

export default function ClientSettings() {
  // Default to true unless explicitly 'false'
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  // --- NEW: Force Light Mode for the entire page (Header/Footer included) ---
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains('dark'); // Remember initial state

    // Function to strictly enforce light mode
    const enforceLight = () => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
      }
      html.style.colorScheme = 'light'; // Forces browser UI (scrollbars) to light
    };

    // 1. Apply immediately
    enforceLight();

    // 2. Watch for changes (if system/user tries to toggle dark mode while on this page)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          enforceLight();
        }
      });
    });

    observer.observe(html, { attributes: true });

    // 3. Cleanup: Restore state and stop watching when leaving this page
    return () => {
      observer.disconnect();
      html.style.colorScheme = ''; // Reset browser UI
      
      // Optional: Restore dark mode if it was active before, 
      // or if the user changed preference to dark while on this page 
      // (checking local storage would be ideal here, but restoring initial state is a safe fallback)
      if (wasDark) {
        html.classList.add('dark');
      }
    };
  }, []);
  // --------------------------------------------------------------------------

  // 1. Sync Logic: Check storage on mount AND listen for changes
  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('placebyte_cookie_consent');
      setCookiesEnabled(consent !== 'false');
    };

    // Run on mount
    checkConsent();

    // Listen for updates from Footer
    window.addEventListener('cookie-preference-changed', checkConsent);
    return () => window.removeEventListener('cookie-preference-changed', checkConsent);
  }, []);

  const handleClearData = () => {
    if (confirm("This will reset your cookie preferences, local settings, and clear any cached data for this site.")) {
      localStorage.clear();
      sessionStorage.clear();
      alert("Local data cleared. The page will now reload.");
      window.location.reload();
    }
  };

  const toggleCookies = () => {
    const newState = !cookiesEnabled;
    setCookiesEnabled(newState);
    localStorage.setItem('placebyte_cookie_consent', String(newState));
    // Dispatch event so Footer updates instantly
    window.dispatchEvent(new Event('cookie-preference-changed'));
  };

  return (
    // Forced Light Mode Styles: bg-white, text-black, fix-pixelation
    <div className="bg-white text-black p-8 rounded-2xl shadow-sm border border-gray-100 fix-pixelation">
      <h2 className="font-montserrat font-bold text-xl mb-6 flex items-center gap-2 text-gray-900">
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        Device & Browser Settings
      </h2>
      
      <p className="text-sm text-gray-500 mb-6">
        These settings only affect this specific browser and device.
      </p>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="block font-bold text-gray-800 text-sm">Analytics Cookies</span>
            <span className="block text-xs text-gray-500">Allow us to measure site performance anonymously.</span>
          </div>
          
          {/* Style Fix: Using the exact same button structure as Footer.tsx */}
          <button 
            onClick={toggleCookies} 
            className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${cookiesEnabled ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}
            aria-label="Toggle Cookies"
          >
            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${cookiesEnabled ? 'translate-x-5' : ''}`}></div>
          </button>
        </div>

        <div className="border-t border-gray-100 pt-6">
            <button 
              onClick={handleClearData}
              className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear All Local Storage
            </button>
        </div>
      </div>
    </div>
  );
}
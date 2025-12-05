'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { sendMagicLink } from './actions';
import ClientSettings from './manage/ClientSettings';
import { Turnstile } from '@marsidev/react-turnstile'; // Import Turnstile

export default function UserPreferencesLogin() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null); // State for token

  // --- FORCE LIGHT MODE (Keep existing logic) ---
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains('dark');
    const enforceLight = () => {
      if (html.classList.contains('dark')) html.classList.remove('dark');
      html.style.colorScheme = 'light';
    };
    enforceLight();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') enforceLight();
      });
    });
    observer.observe(html, { attributes: true });
    return () => {
      observer.disconnect();
      html.style.colorScheme = '';
      if (wasDark) html.classList.add('dark');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!turnstileToken) {
        setMessage("Please complete the security check.");
        return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Append the token to FormData
    formData.append('cf-turnstile-response', turnstileToken);
    
    const result = await sendMagicLink(null, formData);
    
    setMessage(result.message);
    setIsSuccess(result.success);
    setLoading(false);
    // Reset token on failure so they can try again
    if (!result.success) setTurnstileToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-20 max-w-2xl">
        <h1 className="font-montserrat font-bold text-3xl mb-8 text-center text-[var(--color-footer-bg)]">Privacy Center</h1>
        
        <div className="mb-10">
            <ClientSettings />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="font-montserrat font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Account & Data
          </h2>
          
          {!isSuccess ? (
            <>
              <p className="font-raleway text-gray-600 mb-6 text-sm">
                To manage your email subscriptions, job alerts, or request data deletion, please verify your identity.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot Field */}
                <input type="text" name="website_url" style={{display:'none'}} tabIndex={-1} autoComplete="off" />

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all text-black"
                    placeholder="you@company.com"
                  />
                </div>

                {/* Turnstile Widget */}
                <div className="py-2">
                    <Turnstile 
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                        options={{ theme: 'light' }}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken(null)}
                    />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !turnstileToken}
                  className="w-full bg-[var(--color-footer-bg)] text-white font-bold font-montserrat py-3 rounded-lg hover:bg-black transition-colors disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Sending Secure Link...' : 'Access Account Settings'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-fadeIn py-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">Check your inbox</h3>
              <p className="text-gray-600 text-sm mb-4">{message}</p>
              <button onClick={() => { setIsSuccess(false); setTurnstileToken(null); }} className="text-xs text-gray-400 underline hover:text-gray-600">Use a different email</button>
            </div>
          )}
          
          {message && !isSuccess && <p className="mt-4 text-red-500 text-center text-sm">{message}</p>}
        </div>

      </div>
      <Footer />
    </div>
  );
}
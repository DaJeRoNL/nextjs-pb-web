'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [cookieConsent, setCookieConsent] = useState(true); 
  const [reduceMotion, setReduceMotion] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true);

    const checkConsent = () => {
      const consent = localStorage.getItem('placebyte_cookie_consent');
      setCookieConsent(consent !== 'false');
    };

    const checkMotion = () => {
      const motion = localStorage.getItem('placebyte_reduce_motion');
      if (motion === 'true') {
        setReduceMotion(true);
        document.documentElement.classList.add('reduce-motion');
      }
    };

    const checkTheme = () => {
      const theme = localStorage.getItem('placebyte_theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    };

    checkConsent();
    checkMotion();
    checkTheme();

    window.addEventListener('cookie-preference-changed', checkConsent);
    return () => window.removeEventListener('cookie-preference-changed', checkConsent);
  }, []);

  const toggleMotion = () => {
    const newState = !reduceMotion;
    setReduceMotion(newState);
    if (newState) {
      localStorage.setItem('placebyte_reduce_motion', 'true');
      document.documentElement.classList.add('reduce-motion');
    } else {
      localStorage.removeItem('placebyte_reduce_motion');
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const toggleDarkMode = () => {
    const newState = !darkMode;
    setDarkMode(newState);
    const html = document.documentElement;
    if (newState) {
      localStorage.setItem('placebyte_theme', 'dark');
      html.classList.add('dark');
    } else {
      localStorage.setItem('placebyte_theme', 'light');
      html.classList.remove('dark');
    }
  };

  if (!mounted) return null; 

  return (
    // Updated: Uses Zinc-900/80 for a neutral, non-blue dark mode footer
    <footer id="contact" className="bg-[var(--color-footer-bg)] dark:bg-zinc-900/80 dark:backdrop-blur-xl dark:border-t dark:border-white/5 text-gray-400 dark:text-zinc-400 px-6 md:px-10 pt-16 pb-8 relative z-20 font-raleway transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.5fr] gap-10 md:gap-6">
        
        <div className="relative">
          <h3 className="font-montserrat font-bold text-lg text-white mb-6">PlaceByte</h3>
          <p className="mb-6 text-base leading-relaxed max-w-xs text-gray-400 dark:text-zinc-400">
            Concepcion Aguila St<br />
            San Miguel, Manila<br />
            1005 Metro Manila<br />
            The Philippines
          </p>
          <p className="mb-2 text-base">
            Email: <a href="mailto:team@placebyte.com" className="hover:text-white transition-colors text-[var(--color-accent)]">team@placebyte.com</a>
          </p>
        </div>
        
        <div>
          <h4 className="font-montserrat font-bold text-lg text-gray-400 dark:text-zinc-200 mb-6">Services</h4>
          <ul className="space-y-3 text-base">
            <li><Link href="/placebyte" className="hover:text-white transition-colors">PlaceByte</Link></li>
            <li><Link href="/opsbyte" className="hover:text-white transition-colors">OpsByte</Link></li>
            <li><Link href="/corebyte" className="hover:text-white transition-colors">CoreByte</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-montserrat font-bold text-lg text-gray-400 dark:text-zinc-200 mb-6">Legal</h4>
          <ul className="space-y-3 text-base">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-montserrat font-bold text-lg text-gray-400 dark:text-zinc-200 mb-6">Preferences</h4>
          
          <div className="space-y-3 text-base">
            
            <Link href="/userpreferences" className="group flex items-center justify-between cursor-pointer hover:text-white transition-colors h-[24px]"> 
              <span className="font-raleway text-base text-gray-400 dark:text-zinc-400 group-hover:text-white transition-colors">Cookies</span>
              
              <div className="flex items-center gap-2">
                <span className={`text-xs transition-colors duration-300 ${cookieConsent ? 'text-green-400' : 'text-gray-500'}`}>
                  {cookieConsent ? '● Active' : '○ Strict'}
                </span>
                <svg className="w-3 h-3 text-gray-600 dark:text-zinc-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <div className="flex items-center justify-between h-[24px]">
              <span className="font-raleway text-base text-gray-400 dark:text-zinc-400">Reduce Motion</span>
              <button 
                onClick={toggleMotion} 
                className={`w-7 h-4 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${reduceMotion ? 'bg-[var(--color-primary)]' : 'bg-gray-600 dark:bg-zinc-700'}`}
                aria-label="Toggle Reduced Motion"
              >
                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${reduceMotion ? 'translate-x-3' : ''}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between h-[24px]">
              <span className="font-raleway text-base text-gray-400 dark:text-zinc-400">Dark Mode</span>
              <button 
                onClick={toggleDarkMode} 
                className={`w-7 h-4 flex items-center rounded-full p-0.5 duration-300 ease-in-out ${darkMode ? 'bg-[var(--color-primary)]' : 'bg-gray-600 dark:bg-zinc-700'}`}
                aria-label="Toggle Dark Mode"
              >
                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${darkMode ? 'translate-x-3' : ''}`}></div>
              </button>
            </div>

            <Link href="/userpreferences" className="block text-xs text-[var(--color-primary)] hover:text-white mt-4 font-bold tracking-wide transition-colors pt-2">
              Manage full privacy settings &rarr;
            </Link>

          </div>
        </div>

        <div className="flex flex-col md:items-end">
          <h4 className="font-montserrat font-bold text-lg text-gray-400 dark:text-zinc-200 mb-6">Socials</h4>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/company/placebyte" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-150 text-gray-400 dark:text-zinc-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://www.instagram.com/placebyte_ph/" className="hover:text-white transition duration-150 text-gray-400 dark:text-zinc-400">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.77-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.77-1.699-4.919-4.92-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.77 4.919-4.919 1.266-.057 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 dark:border-white/10 mt-12 pt-8 text-center">
        <p className="font-raleway text-sm text-gray-500 dark:text-zinc-500">&copy; {new Date().getFullYear()} PlaceByte. All rights reserved.</p>
        <p className="mt-2 text-gray-600 dark:text-zinc-400 font-arimo font-bold text-sm">Powered by CoreByte!</p>
      </div>
    </footer>
  );
}
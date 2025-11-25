'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [cookieConsent, setCookieConsent] = useState(true); 
  const [reduceMotion, setReduceMotion] = useState(false); 

  useEffect(() => {
    const consent = localStorage.getItem('placebyte_cookie_consent');
    if (consent === 'false') setCookieConsent(false);

    const motion = localStorage.getItem('placebyte_reduce_motion');
    if (motion === 'true') {
      setReduceMotion(true);
      document.documentElement.classList.add('reduce-motion');
    }
  }, []);

  const toggleCookies = () => {
    const newState = !cookieConsent;
    setCookieConsent(newState);
    localStorage.setItem('placebyte_cookie_consent', String(newState));
    window.dispatchEvent(new Event('cookie-preference-changed'));
  };

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

    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  return (
    <footer id="contact" className="bg-[var(--color-footer-bg)] text-gray-300 px-10 pt-16 pb-10 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* BRAND COLUMN */}
        <div className="md:col-span-1">
          <h3 className="font-montserrat font-bold text-2xl text-white mb-6">PlaceByte</h3>
          <p className="mb-6 font-raleway text-base leading-relaxed">
            Concepcion Aguila St<br />
            San Miguel, Manila<br />
            1005 Metro Manila<br />
            The Philippines
          </p>
          <p className="mb-2 font-raleway text-base">
            Email: <a href="mailto:team@placebyte.com" className="hover:text-white transition-colors" style={{color: 'var(--color-accent)'}}>team@placebyte.com</a>
          </p>
        </div>
        
        {/* SERVICES COLUMN */}
        <div>
          <h4 className="font-montserrat font-bold text-xl text-white mb-6">Services</h4>
          <ul className="space-y-3 font-raleway text-base">
            <li><Link href="/placebyte" className="hover:text-white transition-colors">PlaceByte (Recruitment)</Link></li>
            <li><Link href="/opsbyte" className="hover:text-white transition-colors">OpsByte (Plug-in Teams)</Link></li>
            <li><Link href="/corebyte" className="hover:text-white transition-colors">CoreByte (Automation)</Link></li>
          </ul>
        </div>

        {/* LEGAL COLUMN */}
        <div>
          <h4 className="font-montserrat font-bold text-xl text-white mb-6">Legal</h4>
          <ul className="space-y-3 font-raleway text-base">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
          </ul>
        </div>

        {/* PREFERENCES COLUMN */}
        <div>
          <h4 className="font-montserrat font-bold text-xl text-white mb-6">Preferences</h4>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-raleway text-sm text-gray-400">Enable Cookies</span>
                <button 
                  onClick={toggleCookies} 
                  className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${cookieConsent ? 'bg-[var(--color-primary)]' : 'bg-gray-600'}`}
                  aria-label="Toggle Cookies"
                >
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${cookieConsent ? 'translate-x-5' : ''}`}></div>
                </button>
              </div>
              <p className="text-xs text-gray-500">Enables analytics & site preferences.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-raleway text-sm text-gray-400">Reduce Motion</span>
                <button 
                  onClick={toggleMotion} 
                  className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${reduceMotion ? 'bg-[var(--color-primary)]' : 'bg-gray-600'}`}
                  aria-label="Toggle Reduced Motion"
                >
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${reduceMotion ? 'translate-x-5' : ''}`}></div>
                </button>
              </div>
              <p className="text-xs text-gray-500">Stops animations for accessibility.</p>
            </div>
          </div>
        </div>

        {/* SOCIALS COLUMN */}
        <div>
          <h4 className="font-montserrat font-bold text-xl text-white mb-6">Socials</h4>
          <div className="flex space-x-4">
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/placebyte" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-150">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="hover:text-white transition duration-150">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.77-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.77-1.699-4.919-4.92-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.77 4.919-4.919 1.266-.057 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-16 pt-8 text-center">
        <p className="font-raleway text-sm text-gray-500">&copy; {new Date().getFullYear()} PlaceByte. All rights reserved.</p>
        <p className="mt-2 text-gray-600 font-arimo font-bold text-sm">Powered by CoreByte!</p>
      </div>
    </footer>
  );
}
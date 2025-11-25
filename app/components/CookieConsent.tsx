'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('placebyte_cookie_consent');
    if (consent === null) {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('placebyte_cookie_consent', 'true');
    setIsVisible(false);
    window.location.reload(); 
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div className="bg-black text-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out"
           style={{ maxHeight: isExpanded ? '400px' : '60px' }}>
        
        {/* Header / Bar */}
        <div className="flex items-center justify-between px-6 py-3 h-[60px] cursor-pointer" onClick={toggleExpand}>
          {/* UPDATED: text-xs for mobile to prevent 3 lines */}
          <p className="text-xs sm:text-sm font-raleway font-medium pr-2">
            We use cookies to ensure you get the best experience on our website.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); handleAccept(); }}
              className="text-xs font-bold font-montserrat bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Accept
            </button>
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>

        {/* Expanded Content */}
        <div className="px-6 pb-6 pt-2 bg-gray-900">
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            We use cookies to analyze site traffic and optimize your experience. You can change your preferences at any time in the site footer.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
               <span className="text-xs font-bold text-gray-300">Strictly Necessary</span>
               <span className="text-[10px] text-green-400 font-bold bg-green-900/30 px-2 py-0.5 rounded">Always Active</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
               <span className="text-xs font-bold text-gray-300">Analytics (Google)</span>
               <span className="text-[10px] text-gray-500">Inactive</span>
            </div>
             <div className="flex items-center justify-between">
               <span className="text-xs font-bold text-gray-300">Marketing</span>
               <span className="text-[10px] text-gray-500">Inactive</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
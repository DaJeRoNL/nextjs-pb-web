'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // New: Sync state with footer
  const [marketingEnabled, setMarketingEnabled] = useState(false); 

  useEffect(() => {
    // 1. Initial Check
    const consent = localStorage.getItem('placebyte_cookie_consent');
    if (consent === null) {
      setTimeout(() => setIsVisible(true), 1500);
    } else {
        // If consent exists, we assume user already chose.
        // But we sync the internal state just in case we want to show it in the expanded view
        setMarketingEnabled(consent === 'true');
    }

    // 2. Listen for Footer changes
    const handleSync = () => {
        const currentConsent = localStorage.getItem('placebyte_cookie_consent');
        if (currentConsent !== null) {
            // If the user touched the footer, they have made a choice.
            // Hide the banner if it was open.
            setIsVisible(false);
            setMarketingEnabled(currentConsent === 'true');
        }
    };

    window.addEventListener('cookie-preference-changed', handleSync);
    return () => window.removeEventListener('cookie-preference-changed', handleSync);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('placebyte_cookie_consent', 'true');
    setIsVisible(false);
    // Notify footer
    window.dispatchEvent(new Event('cookie-preference-changed'));
    // Optional: reload to activate scripts
    // window.location.reload(); 
  };

  const handleDecline = () => {
    // Decline means only strictly necessary
    localStorage.setItem('placebyte_cookie_consent', 'false');
    setIsVisible(false);
    // Notify footer
    window.dispatchEvent(new Event('cookie-preference-changed'));
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
            
            {/* Added Interaction Here */}
            <div className="flex items-center justify-between pt-2">
               <span className="text-xs font-bold text-gray-300">Analytics & Marketing</span>
               <div className="flex gap-2">
                   <button onClick={handleDecline} className="text-[10px] text-gray-400 hover:text-white underline">
                       Disable
                   </button>
                   <span className="text-[10px] text-gray-500">|</span>
                   <button onClick={handleAccept} className="text-[10px] text-[var(--color-primary)] font-bold hover:text-white underline">
                       Enable
                   </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
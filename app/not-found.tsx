'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function NotFound() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col" style={{ '--scroll': `${scrollY}px` } as React.CSSProperties}>
      
      <div className="fixed-background">
        <div className="blob-intro-1 absolute inset-0 pointer-events-none">
           <div className="glass-blob-1"></div>
        </div>
        <div className="blob-intro-2 absolute inset-0 pointer-events-none">
           <div className="glass-blob-2"></div>
        </div>
        <div className="blob-intro-3 absolute inset-0 pointer-events-none">
           <div className="glass-blob-3"></div>
        </div>
        <div className="glass-overlay"></div>
      </div>

      <Header />

      <div className="main-content flex-grow flex items-center justify-center relative z-10 px-6 py-20">
        <div className="content-island p-10 md:p-16 text-center max-w-2xl w-full animate-fadeIn">
          
          <div className="mb-8 relative inline-block">
            <h1 className="font-montserrat font-black text-8xl md:text-9xl text-[var(--color-footer-bg)] opacity-10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
               <svg className="w-24 h-24 text-[var(--color-accent)] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
          </div>

          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[var(--color-footer-bg)] mb-4">
            Page Not Found
          </h2>
          
          <p className="font-raleway text-lg text-gray-600 mb-10 leading-relaxed">
            It looks like this page has gone missing or never existed. 
            Even the best systems have a loose byte occasionally.
          </p>

          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white font-montserrat font-bold px-8 py-4 rounded-full shadow-lg hover:bg-[var(--color-primary-dark)] hover:scale-105 transition-all duration-300"
          >
            Return Home
          </Link>

        </div>
      </div>

      <Footer />
    </div>
  );
}
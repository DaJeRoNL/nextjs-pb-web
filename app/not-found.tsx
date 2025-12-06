'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        {/* UPDATED: Forced White Glassmorphism in Dark Mode */}
        <div className="content-island p-10 md:p-16 text-center max-w-2xl w-full animate-fadeIn !bg-white/80 dark:!bg-white/80 backdrop-blur-xl dark:text-[var(--color-footer-bg)] border-none shadow-2xl">
          
          <h1 className="font-montserrat font-black text-8xl md:text-9xl text-[var(--color-footer-bg)] opacity-10 select-none mb-6">
            404
          </h1>

          <div className="relative w-full h-64 md:h-20 mx-auto mb-8">
             <Image 
               src="/404.png" 
               alt="Page Not Found" 
               fill 
               className="object-contain"
               priority
             />
          </div>

          {/* Enforced dark text color for dark mode */}
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-[var(--color-footer-bg)] dark:text-[var(--color-footer-bg)] mb-4">
            Page Not Found
          </h2>
          
          <p className="font-raleway text-lg text-gray-600 dark:text-gray-600 mb-10 leading-relaxed">
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
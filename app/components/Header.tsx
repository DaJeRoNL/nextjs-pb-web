'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const useScrollPosition = (scrollThreshold = 30) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > scrollThreshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);
  return isScrolled;
};

// Animated Dark Mode Toggle
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 1. Initial Check
    const checkTheme = () => {
      const theme = localStorage.getItem('placebyte_theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDark(true);
      } else {
        setIsDark(false);
      }
    };

    checkTheme();

    // 2. Listen for synchronization event from Footer
    window.addEventListener('theme-changed', checkTheme);
    return () => window.removeEventListener('theme-changed', checkTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const html = document.documentElement;
    if (newTheme) {
      localStorage.setItem('placebyte_theme', 'dark');
      html.classList.add('dark');
    } else {
      localStorage.setItem('placebyte_theme', 'light');
      html.classList.remove('dark');
    }
    // 3. Dispatch event to notify Footer
    window.dispatchEvent(new Event('theme-changed'));
  };

  if (!mounted) return <div className="w-10 h-10" />; 

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
      aria-label="Toggle Dark Mode"
    >
      <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[var(--color-primary)] dark:group-hover:border-white transition-colors duration-300 scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>

      {isDark ? (
        // FIX: Changed 'text-white' to 'text-gray-700 dark:text-white'
        // This ensures the icon is dark gray (visible) when on a forced-light page,
        // but turns white when actual dark mode is applied.
        <svg className="w-5 h-5 text-gray-700 dark:text-white transition-transform duration-500 rotate-0 group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-700 transition-transform duration-500 rotate-0 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
};

export default function Header() {
  const isScrolled = useScrollPosition(30); 
  const headerLogoUrl = '/PB Header.svg'; 
  const faviconLogoUrl = '/PB Favicon.png';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
        
        <div className="header-base header-large w-full px-4 md:px-10 flex justify-between items-center transition-colors duration-300">
          
          {/* LOGO */}
          <Link href='/' className='flex items-center select-none'>
            {/* Light Mode */}
            <div className="flex dark:hidden items-center">
               <span className="font-montserrat font-bold text-2xl tracking-[0.2em] text-[var(--color-footer-bg)]">PLACE</span>
               <span className="font-montserrat font-bold text-2xl tracking-[0.2em] text-[var(--color-accent)]">BYTE</span>
            </div>
            {/* Dark Mode */}
            <div className="hidden dark:flex items-center">
               <span className="font-montserrat font-bold text-2xl tracking-[0.2em] text-white">PLACE</span>
               <span className="font-montserrat font-bold text-2xl tracking-[0.2em] text-[var(--color-accent)]">BYTE</span>
            </div>
          </Link>

          {/* DESKTOP LINKS & TOGGLE - Decreased gap to keep them closer */}
          <div className='hidden md:flex items-center gap-5 text-base md:text-lg font-raleway font-medium'>
            <Link href='/about' className='text-gray-700 hover:text-[var(--color-primary)] dark:text-white dark:hover:text-[var(--color-primary)] transition duration-150'>About Us</Link>
            <Link href='/contact' className='text-gray-700 hover:text-[var(--color-primary)] dark:text-white dark:hover:text-[var(--color-primary)] transition duration-150'>Contact</Link>
            <ThemeToggle />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button 
            className="md:hidden p-2 text-gray-700 dark:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
             <div className="space-y-1.5">
                <span className="block w-8 h-0.5 bg-gray-800 dark:bg-white"></span>
                <span className="block w-8 h-0.5 bg-gray-800 dark:bg-white"></span>
                <span className="block w-8 h-0.5 bg-gray-800 dark:bg-white"></span>
             </div>
          </button>
        </div>

        {/* --- SMALL HEADER --- */}
        <div className="header-base header-small hidden md:block">
          <div className="w-full h-full relative px-4 md:px-10">
            <Link href="/" className="absolute" style={{ top: '100%', left: '1.5rem', marginTop: '0.85rem' }}>
              <img 
                src={faviconLogoUrl} 
                alt="PlaceByte Favicon" 
                width={60}
                height={60}
                className="transition-all duration-300 ease-in-out hover:scale-110" 
                style={{ height: '60px', width: 'auto' }} 
              />
            </Link>
            <div className="absolute bg-white dark:bg-zinc-800 rounded-full shadow-lg px-4 py-2 flex items-center" style={{ top: '100%', right: '1.5rem', marginTop: '0.85rem' }}>
              <div className="space-x-6 text-md font-raleway flex items-center">
                <Link href="/about" className="text-gray-700 hover:text-[color:var(--color-primary)] dark:text-white dark:hover:text-[color:var(--color-primary)] transition duration-150">About Us</Link>
                <Link href="/contact" className="text-gray-700 hover:text-[color:var(--color-primary)] dark:text-white dark:hover:text-[color:var(--color-primary)] transition duration-150">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE DRAWER --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-white dark:bg-zinc-900 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
               {/* Mobile Logo Matching Dark Mode Style */}
               <div className="flex items-center">
                  <span className="font-montserrat font-bold text-2xl tracking-[0.2em] text-[var(--color-footer-bg)] dark:text-white">PLACE</span>
                  <span className="font-montserrat font-bold text-2xl tracking-[0.2em] text-[var(--color-accent)]">BYTE</span>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-4xl text-gray-800 dark:text-white focus:outline-none">&times;</button>
            </div>
            
            <nav className="flex flex-col gap-8 text-2xl font-montserrat font-bold text-[var(--color-footer-bg)] dark:text-white">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                <div className="h-px bg-gray-100 dark:bg-zinc-700 w-full my-2"></div>
                <Link href="/placebyte" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-600 dark:text-gray-300">PlaceByte</Link>
                <Link href="/opsbyte" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-600 dark:text-gray-300">OpsByte</Link>
                <Link href="/corebyte" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-600 dark:text-gray-300">CoreByte</Link>
                <div className="h-px bg-gray-100 dark:bg-zinc-700 w-full my-2"></div>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--color-accent)]">Contact Us</Link>
                <div className="mt-4 flex items-center">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-4">Theme:</span>
                  <ThemeToggle />
                </div>
            </nav>
        </div>
      </div>
    </>
  );
}
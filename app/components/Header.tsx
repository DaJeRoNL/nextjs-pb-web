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

export default function Header() {
  const isScrolled = useScrollPosition(30); 
  const headerLogoUrl = '/PB Header.svg'; 
  const faviconLogoUrl = '/PB Favicon.png';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
        
        {/* --- LARGE HEADER (Top State) --- */}
        <div className="header-base header-large w-full px-4 md:px-10 flex justify-between items-center">
          
          {/* LOGO */}
          <Link href='/' className='flex items-center select-none'>
            <img 
              src={headerLogoUrl} 
              alt='PlaceByte Logo' 
              className='block w-auto h-[45px] md:h-[55px] object-contain' 
              style={{ display: 'block' }} 
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className='hidden md:flex items-center gap-4 md:gap-8 text-base md:text-lg font-raleway font-medium'>
            <Link href='/about' className='text-gray-700 hover:text-[var(--color-primary)] transition duration-150'>About Us</Link>
            <Link href='/contact' className='text-gray-700 hover:text-[var(--color-primary)] transition duration-150'>Contact</Link>
          </div>

          {/* MOBILE MENU BUTTON (Hamburger) */}
          <button 
            className="md:hidden p-2 text-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
             <div className="space-y-1.5">
                <span className="block w-8 h-0.5 bg-gray-800"></span>
                <span className="block w-8 h-0.5 bg-gray-800"></span>
                <span className="block w-8 h-0.5 bg-gray-800"></span>
             </div>
          </button>
        </div>

        {/* --- SMALL HEADER (Scroll State - Desktop Only) --- */}
        <div className="header-base header-small hidden md:block">
          <div className="w-full h-full relative px-4 md:px-10">
            <Link href="/" className="absolute" style={{ top: '100%', left: '1.5rem', marginTop: '0.85rem' }}>
              <img src={faviconLogoUrl} alt="PlaceByte Favicon" className="transition-all duration-300 ease-in-out hover:scale-110" style={{ height: '60px' }} />
            </Link>
            <div className="absolute bg-white rounded-full shadow-lg px-4 py-2" style={{ top: '100%', right: '1.5rem', marginTop: '0.85rem' }}>
              <div className="space-x-6 text-md font-raleway">
                <Link href="/about" className="text-gray-700 hover:text-[color:var(--color-primary)] transition duration-150">About Us</Link>
                <Link href="/contact" className="text-gray-700 hover:text-[color:var(--color-primary)] transition duration-150">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE DRAWER (Overlay) --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-white transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
               <img src={headerLogoUrl} alt="PlaceByte" className="h-[40px] w-auto" />
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-4xl text-gray-800 focus:outline-none">&times;</button>
            </div>
            
            <nav className="flex flex-col gap-8 text-2xl font-montserrat font-bold text-[var(--color-footer-bg)]">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                <div className="h-px bg-gray-100 w-full my-2"></div>
                <Link href="/placebyte" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-600">PlaceByte</Link>
                <Link href="/opsbyte" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-600">OpsByte</Link>
                <Link href="/corebyte" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-600">CoreByte</Link>
                <div className="h-px bg-gray-100 w-full my-2"></div>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--color-accent)]">Contact Us</Link>
            </nav>
        </div>
      </div>
    </>
  );
}
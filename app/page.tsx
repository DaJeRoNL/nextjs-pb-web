'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import { useScrollReveal } from './hooks/useScrollReveal';
import { useElementInView } from './hooks/useElementInView';

const useScrollToTop = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);
};

/* --- COMPONENTS --- */

const ScrollDownArrow = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: any;
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setVisible(false);
        if (timer) clearTimeout(timer); 
      }
    };

    timer = setTimeout(() => {
      if (window.scrollY < 20) setVisible(true);
    }, 5000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      className={`absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ bottom: '8rem' }}
    >
      <div className="animate-bounce-arrow text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
};

const HeroButtons = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-col sm:flex-row gap-10 justify-center items-center w-full mt-16 relative z-20">
      
      {/* LEFT BUTTON WRAPPER */}
      <div 
        className={`btn-wrapper ${hovered === 'right' ? 'fade-out-full' : ''}`}
        onMouseEnter={() => setHovered('left')}
        onMouseLeave={() => setHovered(null)}
      >
        <Link 
          href="/contact?type=client" 
          className="min-btn"
          style={{ 
            backgroundColor: 'var(--color-accent)', 
            color: 'white',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: '700'
          }}
        >
          Scale your team
        </Link>
        <span className="floating-pill left-bonus flex items-center justify-end">
          ...and build faster!
        </span>
      </div>

      {/* RIGHT BUTTON WRAPPER */}
      <div 
        className={`btn-wrapper ${hovered === 'left' ? 'fade-out-full' : ''}`}
        onMouseEnter={() => setHovered('right')}
        onMouseLeave={() => setHovered(null)}
      >
        <Link 
          href="/contact?type=talent" 
          className="min-btn min-btn-dark-blue" // Added class for dark mode override
          style={{ 
            backgroundColor: 'var(--color-footer-bg)', 
            color: 'white',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: '700'
          }}
        >
          Find your next role!
        </Link>
        <span className="floating-pill right-bonus flex items-center justify-start">
          Stop searching and...
        </span>
      </div>

    </div>
  );
};

const HeroSection = () => {
  const [byteColor, setByteColor] = useState('var(--color-accent)');

  const handleByteLeave = () => {
    const colors = [
      'var(--color-accent)',       // Orange
      'var(--color-lime-dark)',    // Green
      'var(--color-purple)'   // Yellow/Purple
    ];
    const nextColors = colors.filter(c => c !== byteColor);
    const randomColor = nextColors[Math.floor(Math.random() * nextColors.length)];
    setByteColor(randomColor);
  };

  return (
    <section id="home" className="relative pt-40 pb-32 overflow-hidden z-10 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
        <h1 className="font-arimo font-light text-4xl md:text-6xl text-gray-900 dark:text-white leading-tight mb-12" style={{ fontWeight: 300 }}>
          Where people, platforms, and performance come together one smart{' '}
          <span 
            onMouseLeave={handleByteLeave}
            className="transition-colors duration-300 cursor-default"
            style={{ color: byteColor, fontWeight: '600' }}
          >
            Byte
          </span>{' '}
          at a time.
        </h1>
        <p className="font-raleway font-light italic text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mt-12 max-w-4xl mx-auto mb-16 leading-relaxed">
          On-demand people and platform support that strengthens your ops with recruitment, plug-and-play teams, or automation so your team moves faster with less effort.
        </p>
        
        <HeroButtons />
      </div>
      <ScrollDownArrow />
    </section>
  );
};

const ServicesSection = () => {
  const wrapperRef = useRef(null);
  useScrollReveal(wrapperRef, 0, 0.25);

  const services = [
    { title: "PlaceByte", description: "Specialist recruitment in Tech, Healthcare, Startups, and Travel. We find the right fit for challenging roles.", color: 'var(--color-accent)', image: "/PBh.jpg", link: '/placebyte', mirrored: false },
    { title: "OpsByte", description: "Plug-and-play, vetted teams that scale your operations instantly. Removing the chaos of traditional hiring.", color: 'var(--color-lime-dark)', image: "/OBh.jpg", link: '/opsbyte', mirrored: true },
    { title: "CoreByte", description: "System development and workflow automation. We build the intelligent workspace that quietly removes the manual work.", color: 'var(--color-purple)', image: "/CBh.jpg", link: '/corebyte', mirrored: false }
  ];

  return (
    <section id="services" className="py-16 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Big Island 1: Keeps borders (via content-island class default) */}
        <div ref={wrapperRef} className="content-island p-8 md:p-12 scroll-reveal relative !bg-white/80 dark:!bg-zinc-900/80 backdrop-blur-xl">
          <div className="text-center mb-12 px-6">
            <p className="font-raleway font-bold uppercase tracking-wider mb-4" style={{color: 'var(--color-accent)'}}>HOW CAN WE HELP YOU?</p>
            <h2 className="font-montserrat font-bold text-4xl text-[var(--color-footer-bg)] dark:text-white">A Smarter Way to Grow</h2>
            <p className="font-raleway text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">Three layers that work together or solo, depending on what you need.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              // UPDATED: Removed dark:border-white/10 (now border-none in dark mode implicitly or explicit dark:border-none)
              <div key={index} className="flex flex-col bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group border border-transparent dark:border-none">
                <div className="h-48 relative overflow-hidden clip-diagonal-bottom">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="service-card-image object-cover" 
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-montserrat font-bold text-2xl mb-4" style={{ color: service.color }}>{service.title}</h3>
                  <p className="font-raleway text-gray-600 dark:text-gray-200 mb-6 flex-grow leading-relaxed">{service.description}</p>
                  <Link href={service.link} className="font-raleway font-bold text-sm self-end mt-auto transition-all duration-300 group flex items-center gap-1" style={{ color: service.color }}>
                    Learn more<span className="transform transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTABeforeFooter = () => {
  const ctaRef = useRef(null);
  useScrollReveal(ctaRef, 100);
  return (
    <section className="pt-16 pb-32 relative z-10"> 
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <div ref={ctaRef} className="relative scroll-reveal">
          <p className="font-raleway font-bold uppercase tracking-wider mb-4" style={{color: 'var(--color-accent)'}}>Ready to grow?</p>
          <h2 className="font-montserrat font-bold text-5xl mb-12 text-[var(--color-footer-bg)] dark:text-white">Start your transformation.</h2>
          <HeroButtons />
        </div>
      </div>
    </section>
  );
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Only show after scrolling down 1200px
    const handleScroll = () => setIsVisible(window.scrollY > 1200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <button 
      onClick={scrollToTop} 
      // UPDATED: Light mode = White bg/Dark text. Dark mode = Zinc-800 bg/White text.
      className={`scroll-to-top-button 
        bg-white text-[var(--color-footer-bg)] border border-gray-200
        dark:bg-zinc-800 dark:text-white dark:border-white/10
        ${isVisible ? 'visible' : ''} ${isClicked ? 'clicked' : ''}`} 
      aria-label="Scroll to top"
    >
      {isClicked ? (
        <div className="w-6 h-1 bg-[var(--color-footer-bg)] dark:bg-white rounded-full"></div>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"></path>
        </svg>
      )}
    </button>
  );
};

/* --- MAIN APP COMPONENT --- */
export default function App() {
  const aboutRef = useRef(null);
  const mainContainerRef = useRef<HTMLDivElement>(null); 
  
  const aboutSectionInView = useElementInView(aboutRef); 
  useScrollReveal(aboutRef, 100); 

  useScrollToTop();

  // --- OPTIMIZED PARALLAX LOGIC (requestAnimationFrame) ---
  useEffect(() => {
    let requestRunning: number | null = null;

    const handleScroll = () => {
      // If a frame is already scheduled, don't schedule another one
      if (requestRunning === null) {
        requestRunning = window.requestAnimationFrame(() => {
          if (mainContainerRef.current) {
            mainContainerRef.current.style.setProperty('--scroll', `${window.scrollY}px`);
          }
          requestRunning = null; // Reset lock
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestRunning) window.cancelAnimationFrame(requestRunning);
    };
  }, []);

  return (
    <>
      <div 
        ref={mainContainerRef}
        className="min-h-screen relative" 
        style={{ '--scroll': '0px' } as React.CSSProperties}
      >
        
        {/* BACKGROUND - UPDATED FOR GPU PERFORMANCE */}
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

        <div className="main-content">
          <HeroSection />
          <ServicesSection />

          <section id='about' ref={aboutRef} className='py-16 relative overflow-hidden scroll-reveal z-10'>
            <div className='container mx-auto px-6 max-w-7xl'>
              {/* Big Island 2: Keeps borders */}
              <div className='content-island relative p-10 md:p-16 !bg-white/80 dark:!bg-zinc-900/80 backdrop-blur-xl'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Column: Copy */}
                    <div>
                        <p className='font-raleway font-bold uppercase tracking-wider mb-4' style={{color:'var(--color-accent)'}}>Why PlaceByte?</p>
                        <h2 className='font-montserrat font-bold text-4xl mb-6 text-[var(--color-footer-bg)] dark:text-white'>Engineered for Growth</h2>
                        <hr className='header-separator mx-0 mb-8'/>
                        <div className='font-raleway text-lg text-gray-700 dark:text-gray-300 space-y-6'>
                            <p className='leading-relaxed'>
                              We built PlaceByte on a simple idea. Great teams are engineered, supported, and powered. So we created three layers that work together or solo, depending on what you need. Recruitment brings you the talent. OpsByte plugs in the team that keeps your workflows moving without the cost and chaos of traditional hiring. CoreByte powers the workspace behind it all with automation.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Benefits with SVGs */}
                    <div className="space-y-8 bg-gray-50/50 dark:bg-zinc-800/30 p-8 rounded-2xl border border-gray-100 dark:border-white/10">
                        
                        {/* Talent */}
                        <div className="flex gap-5 items-start min-h-[90px]">
                            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-full shadow-sm text-[var(--color-accent)]">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-montserrat font-bold text-lg text-[var(--color-footer-bg)] dark:text-white">Talent</h4>
                                <p className="font-raleway text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">PlaceByte finds the cultural fits that generic recruiters miss.</p>
                            </div>
                        </div>

                        {/* Speed */}
                        <div className="flex gap-5 items-start min-h-[90px]">
                            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-full shadow-sm text-[var(--color-lime-dark)]">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-montserrat font-bold text-lg text-[var(--color-footer-bg)] dark:text-white">Speed</h4>
                                <p className="font-raleway text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">OpsByte plugs in vetted teams instantly. No 3-month hiring cycles.</p>
                            </div>
                        </div>

                        {/* System */}
                        <div className="flex gap-5 items-start min-h-[90px]">
                            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-full shadow-sm text-[var(--color-purple)]">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.066 2.573c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-montserrat font-bold text-lg text-[var(--color-footer-bg)] dark:text-white">System</h4>
                                <p className="font-raleway text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">CoreByte automates the manual work so your people can focus on strategy.</p>
                            </div>
                        </div>

                    </div>

                </div>
              </div>
            </div>
          </section>

          <CTABeforeFooter />

          <Footer />

        </div>

        <ScrollToTopButton />

      </div>
    </>
  );
}
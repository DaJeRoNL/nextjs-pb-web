'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';

// --- HOOKS ---
const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrollY;
};

// --- SCROLL TO TOP ---
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 600);
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
      className={`fixed bottom-8 right-8 bg-[var(--color-footer-bg)] text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-50 hover:scale-110
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        ${isClicked ? 'opacity-0 !translate-y-[-20px]' : ''}
      `}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"></path>
      </svg>
    </button>
  );
};

export default function OpsBytePage() {
  const scrollY = useScrollY();

  // Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // New Refs for overlap detection
  const quoteRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState('Overview');
  const [isNavVisible, setIsNavVisible] = useState(true);

  const sections = [
    { ref: heroRef, name: 'Overview' },
    { ref: valuesRef, name: 'Why Us' },
    { ref: processRef, name: 'Process' },
    { ref: storiesRef, name: 'Stories' },
    { ref: ctaRef, name: 'Build Team' },
  ];

  // --- SCROLL SPY LOGIC ---
  useEffect(() => {
    const observerOptions = {
      root: null,
      // Keep active band near the top 20-30% of screen
      rootMargin: '-20% 0px -70% 0px', 
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matchedSection = sections.find(s => s.ref.current === entry.target);
          if (matchedSection) {
            setActiveSection(matchedSection.name);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
      if (section.ref.current) observer.observe(section.ref.current);
    });

    // Bottom check
    const handleBottomScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        setActiveSection('Build Team');
      }
    };
    window.addEventListener('scroll', handleBottomScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleBottomScroll);
    };
  }, [sections]);

  // --- OVERLAP DETECTION LOGIC ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNavVisible(!entry.isIntersecting);
      },
      { 
        rootMargin: '0px 0px -60% 0px', 
        threshold: 0.1 
      }
    );

    if (quoteRef.current) {
      observer.observe(quoteRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    // FIX: Removed 'bg-gray-50' so the fixed background can show through
    <div className="min-h-screen relative" style={{ '--scroll': `${scrollY}px` } as React.CSSProperties}>
      
      {/* BACKGROUND - STATIC 2 ORBS (Blue + Green) */}
      <div className="fixed-background">
        {/* Constant Blue Orb */}
        <div 
          className="absolute rounded-full opacity-40"
          style={{
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(255,255,255,0) 70%)',
            top: '-20%',
            right: '-20%',
          }}
        />
        {/* Theme Green Orb */}
        <div 
          className="absolute rounded-full opacity-40"
          style={{
            width: '70vw',
            height: '70vw',
            background: 'radial-gradient(circle, rgba(101,163,13,0.3) 0%, rgba(255,255,255,0) 70%)',
            bottom: '-20%',
            left: '-20%',
          }}
        />
        <div className="glass-overlay"></div>
      </div>

      <Header />

      <div className="main-content pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* BIG CARD LAYOUT */}
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row min-h-[800px]">
            
            {/* --- LEFT PANEL --- */}
            <div className="lg:w-1/3 bg-[var(--color-footer-bg)] text-white flex flex-col relative rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none" 
                   style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, var(--color-lime-dark), transparent 40%)' }}>
              </div>
              
              <div className="flex flex-col p-10 lg:p-14 lg:pt-28 h-full relative z-10">
                
                {/* TITLE BLOCK */}
                <div className="mb-8">
                  <p className="font-raleway font-bold text-[var(--color-lime-dark)] uppercase tracking-[0.2em] text-sm mb-6">OpsByte</p>
                  <h1 className="font-montserrat font-bold text-4xl lg:text-5xl mb-6 leading-tight">
                    Scale.<br/>Manage.<br/>Optimize.
                  </h1>
                  <div className="w-16 h-1 bg-[var(--color-lime-dark)] mb-8"></div>
                </div>
                
                {/* NAVIGATION (Sticky with Fade Logic) */}
                <nav 
                  className={`hidden lg:flex flex-col gap-4 lg:sticky lg:top-20 transition-opacity duration-500 ease-in-out
                    ${isNavVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  {sections.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => scrollToSection(s.ref)}
                      className={`text-left text-sm font-montserrat font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-3
                        ${activeSection === s.name ? 'text-white translate-x-2' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {activeSection === s.name && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime-dark)]"></div>}
                      {s.name}
                    </button>
                  ))}
                </nav>

                {/* BOTTOM QUOTE (Observed Ref) */}
                <div ref={quoteRef} className="hidden lg:block mt-auto pt-20">
                   <p className="font-arimo text-xl italic text-gray-400 leading-relaxed border-l-2 border-[var(--color-lime-dark)] pl-4">
                     &quot;Chaos kills growth. We build the systems that let you scale.&quot;
                   </p>
                </div>
              </div>
            </div>

            {/* --- RIGHT PANEL (Content) --- */}
            <div className="lg:w-2/3 p-10 lg:p-16 flex flex-col gap-20 rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">

              {/* HERO */}
              <section ref={heroRef} className="flex flex-col gap-8 scroll-mt-32">
                  <p className="font-raleway font-bold uppercase tracking-wider text-[var(--color-lime-dark)]">OPERATIONAL EXCELLENCE</p>
                  <h2 className="font-arimo font-light text-3xl md:text-5xl text-gray-900 leading-tight">
                    Scale Your <span style={{ color: 'var(--color-lime-dark)', fontWeight: 700 }}>Operations</span>
                  </h2>
                  <p className="font-raleway text-lg text-gray-600 leading-relaxed">
                    Plug-and-play teams that handle your day-to-day, allowing you to focus on the big picture. We remove the overhead and chaos of traditional scaling.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
                    {['Support', 'Admin', 'Data', 'CX'].map((tag) => (
                      <div key={tag} className="h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {tag}
                      </div>
                    ))}
                  </div>
              </section>

              {/* VALUE PROPOSITIONS */}
              <section ref={valuesRef} className="scroll-mt-32">
                <h3 className="font-montserrat font-bold text-2xl text-[var(--color-footer-bg)] mb-8 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> The OpsByte Advantage
                </h3>
                <div className="space-y-8">
                   {[
                     { 
                       title: 'Flexible Teams', 
                       icon: (
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                       ),
                       desc: 'Scale your workforce up or down instantly based on project demands without the HR nightmare.' 
                     },
                     { 
                       title: 'Process Management', 
                       icon: (
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                       ),
                       desc: "We don't just bring people; we bring processes. Our teams come equipped with best-practice workflows." 
                     },
                     { 
                       title: 'Cost Efficiency', 
                       icon: (
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       ),
                       desc: 'Reduce overhead costs significantly compared to hiring full-time in-house staff for operational roles.' 
                     }
                   ].map((val, i) => (
                      <div key={i} className="flex gap-5 items-start group">
                        <div className="w-12 h-12 shrink-0 bg-green-50 rounded-full flex items-center justify-center text-[var(--color-lime-dark)] group-hover:scale-110 transition-transform">
                           {val.icon}
                        </div>
                        <div>
                           <h4 className="font-bold text-lg text-gray-900 mb-1">{val.title}</h4>
                           <p className="text-sm text-gray-600 font-raleway leading-relaxed">{val.desc}</p>
                        </div>
                      </div>
                   ))}
                </div>
              </section>

              {/* PROCESS SECTION (3 STEPS) */}
              <section ref={processRef} className="scroll-mt-32">
                <h3 className="font-montserrat font-bold text-2xl text-[var(--color-footer-bg)] mb-8 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> Implementation
                </h3>
                <div className="space-y-4">
                   {[
                     { 
                       step: '01', 
                       title: 'Audit & Mapping', 
                       desc: 'We analyze your current workflows to identify bottlenecks and define the exact team structure needed.' 
                     },
                     { 
                       step: '02', 
                       title: 'Deployment', 
                       desc: 'We plug in a vetted, managed team trained on your specific tools and processes. Day 1 readiness.' 
                     },
                     { 
                       step: '03', 
                       title: 'Optimization Loop', 
                       desc: 'Continuous monitoring and process refinement. We don’t just work; we improve how the work is done.' 
                     }
                   ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                         <span className="text-3xl font-montserrat font-bold text-[var(--color-lime-dark)] opacity-40 w-12">{item.step}</span>
                         <div>
                            <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
              </section>

              {/* SUCCESS STORIES */}
              <section ref={storiesRef} className="scroll-mt-32">
                <h3 className="font-montserrat font-bold text-2xl text-[var(--color-footer-bg)] mb-8 flex items-center gap-3">
                   <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> Operational Wins
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-[var(--color-lime-dark)]">
                      <h4 className="font-bold text-lg text-[var(--color-footer-bg)] mb-2">Seasonal Support</h4>
                      <p className="text-sm text-gray-600 mb-3">Managed 24/7 support team for e-commerce peak.</p>
                      <span className="text-xs font-bold text-[var(--color-lime-dark)] uppercase tracking-wider">100% Uptime</span>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-[var(--color-footer-bg)]">
                      <h4 className="font-bold text-lg text-[var(--color-footer-bg)] mb-2">Back-Office Clean Up</h4>
                      <p className="text-sm text-gray-600 mb-3">Migrated and cleaned 50k+ data entries.</p>
                      <span className="text-xs font-bold text-[var(--color-footer-bg)] uppercase tracking-wider">2 Weeks Ahead of Schedule</span>
                   </div>
                </div>
              </section>

              {/* CTA */}
              <section ref={ctaRef} className="py-16 text-center relative scroll-mt-32">
                <div className="relative z-10">
                  <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)] mb-4">
                    Ready to Streamline?
                  </h2>
                  <p className="text-gray-600 font-raleway mb-8 max-w-xl mx-auto">
                    Stop drowning in admin. Start scaling your business with a team that works as hard as you do.
                  </p>
                  
                  <div className="relative inline-block">
                    <Link 
                      href="/contact?type=client"
                      className="relative z-10 inline-block bg-[var(--color-lime-dark)] text-white font-montserrat px-10 py-4 rounded-full shadow-lg hover:bg-[var(--color-footer-bg)] transition-all duration-300 text-lg font-bold hover:scale-105"
                    >
                      Build Your Team
                    </Link>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
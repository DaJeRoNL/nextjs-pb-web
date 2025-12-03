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

export default function CoreBytePage() {
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
    { ref: valuesRef, name: 'Optimization' },
    { ref: processRef, name: 'Methodology' },
    { ref: storiesRef, name: 'Results' },
    { ref: ctaRef, name: 'Automate' },
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
        setActiveSection('Automate');
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
      
      {/* BACKGROUND - STATIC 2 ORBS (Blue + Yellow) */}
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
        {/* Theme Yellow Orb */}
        <div 
          className="absolute rounded-full opacity-40"
          style={{
            width: '70vw',
            height: '70vw',
            background: 'radial-gradient(circle, rgba(202,138,4,0.3) 0%, rgba(255,255,255,0) 70%)',
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
                   style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, var(--color-purple), transparent 40%)' }}>
              </div>
              
              <div className="flex flex-col p-10 lg:p-14 lg:pt-28 h-full relative z-10">
                
                {/* TITLE BLOCK */}
                <div className="mb-8">
                  <p className="font-raleway font-bold text-[var(--color-purple)] uppercase tracking-[0.2em] text-sm mb-6">CoreByte</p>
                  <h1 className="font-montserrat font-bold text-4xl lg:text-5xl mb-6 leading-tight">
                    Automate.<br/>Integrate.<br/>Secure.
                  </h1>
                  <div className="w-16 h-1 bg-[var(--color-purple)] mb-8"></div>
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
                      {activeSection === s.name && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-purple)]"></div>}
                      {s.name}
                    </button>
                  ))}
                </nav>

                {/* BOTTOM QUOTE (Observed Ref) */}
                <div ref={quoteRef} className="hidden lg:block mt-auto pt-20">
                   <p className="font-arimo text-xl italic text-gray-400 leading-relaxed border-l-2 border-[var(--color-purple)] pl-4">
                     &quot;The best workflow is the one you don't even notice. We automate the mundane so you can build the extraordinary.&quot;
                   </p>
                </div>
              </div>
            </div>

            {/* --- RIGHT PANEL (Content) --- */}
            <div className="lg:w-2/3 p-10 lg:p-16 flex flex-col gap-20 rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">

              {/* HERO */}
              <section ref={heroRef} className="flex flex-col gap-8 scroll-mt-32">
                  <p className="font-raleway font-bold uppercase tracking-wider text-[var(--color-purple)]">INTELLIGENT WORKSPACES</p>
                  <h2 className="font-arimo font-light text-3xl md:text-5xl text-gray-900 leading-tight">
                    {/* UPDATED: Highlight "Automate" */}
                    <span style={{ color: 'var(--color-purple)', fontWeight: 700 }}>Automate</span> the Mundane
                  </h2>
                  <p className="font-raleway text-lg text-gray-600 leading-relaxed">
                    We build the systems that automate your busywork and secure your data. CoreByte transforms manual, error-prone processes into streamlined, intelligent workflows.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
                    {['API', 'Scripts', 'CRM', 'Cloud'].map((tag) => (
                      <div key={tag} className="h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {tag}
                      </div>
                    ))}
                  </div>
              </section>

              {/* VALUE PROPOSITIONS */}
              <section ref={valuesRef} className="scroll-mt-32">
                <h3 className="font-montserrat font-bold text-2xl text-[var(--color-footer-bg)] mb-8 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> System Optimization
                </h3>
                <div className="space-y-8">
                   {[
                     { 
                       title: 'Workflow Automation', 
                       icon: (
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                       ),
                       desc: 'Eliminate repetitive tasks with custom scripts and integrations that free up your team for high-value work.' 
                     },
                     { 
                       title: 'Custom Integrations', 
                       icon: (
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                       ),
                       desc: "We make your disparate software tools talk to each other, creating a single source of truth for your data." 
                     },
                     { 
                       title: 'Data Hygiene', 
                       icon: (
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                       ),
                       desc: 'Clean, organized, and secure data is the lifeblood of a modern business. We ensure your information architecture is sound.' 
                     }
                   ].map((val, i) => (
                      <div key={i} className="flex gap-5 items-start group">
                        <div className="w-12 h-12 shrink-0 bg-yellow-50 rounded-full flex items-center justify-center text-[var(--color-purple)] group-hover:scale-110 transition-transform">
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
                  <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> Methodology
                </h3>
                <div className="space-y-4">
                   {[
                     { 
                       step: '01', 
                       title: 'Diagnostic & Blueprint', 
                       desc: 'We audit your current tech stack and manual workflows to identify high-impact opportunities for automation.' 
                     },
                     { 
                       step: '02', 
                       title: 'Build & Integrate', 
                       desc: 'Our engineers write the scripts, build the APIs, and connect the pipes. Rigorous testing ensures data integrity.' 
                     },
                     { 
                       step: '03', 
                       title: 'Deploy & Monitor', 
                       desc: 'We launch the new system and set up monitoring alerts. Your data is now working for you, 24/7.' 
                     }
                   ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                         <span className="text-3xl font-montserrat font-bold text-[var(--color-purple)] opacity-40 w-12">{item.step}</span>
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
                   <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> System Wins
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-[var(--color-purple)]">
                      <h4 className="font-bold text-lg text-[var(--color-footer-bg)] mb-2">Invoice Automation</h4>
                      <p className="text-sm text-gray-600 mb-3">Automated processing for 500+ monthly invoices.</p>
                      <span className="text-xs font-bold text-[var(--color-purple)] uppercase tracking-wider">20 Hours Saved/Week</span>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-[var(--color-footer-bg)]">
                      <h4 className="font-bold text-lg text-[var(--color-footer-bg)] mb-2">CRM Migration</h4>
                      <p className="text-sm text-gray-600 mb-3">Merged three disparate databases into one source of truth.</p>
                      <span className="text-xs font-bold text-[var(--color-footer-bg)] uppercase tracking-wider">Zero Downtime</span>
                   </div>
                </div>
              </section>

              {/* CTA */}
              <section ref={ctaRef} className="py-16 text-center relative scroll-mt-32">
                <div className="relative z-10">
                  <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)] mb-4">
                    Ready to Optimize?
                  </h2>
                  <p className="text-gray-600 font-raleway mb-8 max-w-xl mx-auto">
                    Stop doing the work your computer should be doing. Build a workspace that scales with you.
                  </p>
                  
                  <div className="relative inline-block">
                    <Link 
                      href="/contact?type=client"
                      className="relative z-10 inline-block bg-[var(--color-purple)] text-white font-montserrat px-10 py-4 rounded-full shadow-lg hover:bg-[var(--color-footer-bg)] transition-all duration-300 text-lg font-bold hover:scale-105"
                    >
                      Optimize Systems
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
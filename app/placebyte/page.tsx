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

export default function PlaceBytePage() {
  const scrollY = useScrollY();

  // Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Overlap detection
  const quoteRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState('Overview');
  const [isNavVisible, setIsNavVisible] = useState(true);
  
  // --- NEW: SCROLL LOCK REF ---
  // Prevents the scroll listener from overwriting the active state during a click-scroll
  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const sections = [
    { ref: heroRef, name: 'Overview' },
    { ref: valuesRef, name: 'Why Us' },
    { ref: processRef, name: 'Process' },
    { ref: storiesRef, name: 'Stories' },
    { ref: ctaRef, name: 'Start Hiring' },
  ];

  // --- 1. ROBUST SCROLL SPY ---
  useEffect(() => {
    const handleScroll = () => {
      // If we are scrolling via click, IGNORE this logic
      if (isManualScrolling.current) return;

      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;

      // A. Bottom Safety (Force last item if at very bottom)
      if ((windowHeight + currentScroll) >= docHeight - 20) {
        setActiveSection(sections[sections.length - 1].name);
        return;
      }

      // B. Top Safety (Force first item if at very top)
      if (currentScroll < 50) {
        setActiveSection(sections[0].name);
        return;
      }

      // C. "30% Line" Logic
      // We draw a line at 30% of the screen height. 
      // The ACTIVE section is the LAST section whose top edge is ABOVE this line.
      const triggerPoint = currentScroll + (windowHeight * 0.3);

      let newActive = sections[0].name;

      sections.forEach((section) => {
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          
          // If the trigger point has passed this section's start...
          if (triggerPoint >= sectionTop) {
            newActive = section.name;
          }
        }
      });

      setActiveSection(newActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // --- 2. RELIABLE CLICK HANDLER ---
  const handleNavClick = (sectionName: string, ref: React.RefObject<HTMLDivElement>) => {
    // 1. Lock the scroll listener
    isManualScrolling.current = true;
    
    // 2. Set active state immediately (UI responsiveness)
    setActiveSection(sectionName);

    // 3. Perform the scroll
    if (ref.current) {
      // 100px Offset for header clearance
      const offset = 100;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // 4. Unlock after animation (approx 1000ms is safe for smooth scroll)
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 1000);
  };

  // --- 3. OVERLAP DETECTION ---
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen relative" style={{ '--scroll': `${scrollY}px` } as React.CSSProperties}>
      
      {/* BACKGROUND */}
      <div className="fixed-background">
        <div 
          className="absolute rounded-full opacity-40"
          style={{
            width: '60vw', height: '60vw',
            background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(255,255,255,0) 70%)',
            top: '-20%', right: '-20%',
          }}
        />
        <div 
          className="absolute rounded-full opacity-40"
          style={{
            width: '70vw', height: '70vw',
            background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(255,255,255,0) 70%)',
            bottom: '-20%', left: '-20%',
          }}
        />
        <div className="glass-overlay"></div>
      </div>

      <Header />

      <div className="main-content pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row min-h-[800px]">
            
            {/* LEFT PANEL */}
            <div className="lg:w-1/3 bg-[var(--color-footer-bg)] text-white flex flex-col relative rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none" 
                   style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, var(--color-accent), transparent 40%)' }}>
              </div>
              
              <div className="flex flex-col p-10 lg:p-14 lg:pt-28 h-full relative z-10">
                <div className="mb-8">
                  <p className="font-raleway font-bold text-[var(--color-accent)] uppercase tracking-[0.2em] text-sm mb-6">PlaceByte</p>
                  <h1 className="font-montserrat font-bold text-4xl lg:text-5xl mb-6 leading-tight">
                    Precision.<br/>Speed.<br/>Scale.
                  </h1>
                  <div className="w-16 h-1 bg-[var(--color-accent)] mb-8"></div>
                </div>
                
                {/* NAVIGATION */}
                <nav 
                  className={`hidden lg:flex flex-col gap-4 lg:sticky lg:top-20 transition-opacity duration-500 ease-in-out
                    ${isNavVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  {sections.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => handleNavClick(s.name, s.ref)}
                      className={`text-left text-sm font-montserrat font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-3
                        ${activeSection === s.name ? 'text-white translate-x-2' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {activeSection === s.name && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></div>}
                      {s.name}
                    </button>
                  ))}
                </nav>

                <div ref={quoteRef} className="hidden lg:block mt-auto pt-20">
                   <p className="font-arimo text-xl italic text-gray-400 leading-relaxed border-l-2 border-[var(--color-accent)] pl-4">
                     &quot;Recruitment isn't a transaction. It's a transformation.&quot;
                   </p>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="lg:w-2/3 p-10 lg:p-16 flex flex-col gap-20 rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
              <section ref={heroRef} className="flex flex-col gap-8">
                  <p className="font-raleway font-bold uppercase tracking-wider text-[var(--color-accent)]">RECRUITMENT REFINED</p>
                  <h2 className="font-arimo font-light text-3xl md:text-5xl text-gray-900 leading-tight">
                    Talent That <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Elevates</span> Your Team
                  </h2>
                  <p className="font-raleway text-lg text-gray-600 leading-relaxed">
                    PlaceByte delivers focused and effective recruitment solutions. We identify candidates who can perform, adapt, and strengthen your long-term growth.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
                    {['Tech', 'Medical', 'Startups', 'Others'].map((tag) => (
                      <div key={tag} className="h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {tag}
                      </div>
                    ))}
                  </div>
              </section>

              <section ref={valuesRef}>
                <h3 className="font-montserrat font-bold text-2xl text-[var(--color-footer-bg)] mb-8 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> What Sets Us Apart
                </h3>
                <div className="space-y-8">
                   {[
                     { title: 'Precision Screening', icon: 'target', desc: 'Thoroughly evaluated professionals. Every candidate passes structured technical and behavioral checks.' },
                     { title: 'Human Understanding', icon: 'users', desc: 'We look beyond experience to understand personality, expectations, and compatibility.' },
                     { title: 'Efficient Delivery', icon: 'clock', desc: 'Fast shortlisting without compromising quality. You receive strong profiles in a matter of days.' }
                   ].map((val, i) => (
                      <div key={i} className="flex gap-5 items-start group">
                        <div className="w-12 h-12 shrink-0 bg-orange-50 rounded-full flex items-center justify-center text-[var(--color-accent)] group-hover:scale-110 transition-transform">
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                        </div>
                        <div>
                           <h4 className="font-bold text-lg text-gray-900 mb-1">{val.title}</h4>
                           <p className="text-sm text-gray-600 font-raleway leading-relaxed">{val.desc}</p>
                        </div>
                      </div>
                   ))}
                </div>
              </section>

              <section ref={processRef}>
                <h3 className="font-montserrat font-bold text-2xl text-[var(--color-footer-bg)] mb-8 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> How It Works
                </h3>
                <div className="space-y-4">
                   {[
                     { step: '01', title: 'Strategy & Sourcing', desc: 'We align on your ideal profile and launch a targeted search across our premium networks to find the perfect match.' },
                     { step: '02', title: 'Assessment & Selection', desc: 'Candidates undergo rigorous technical and behavioral screening. We manage the interviews so you only see the best.' },
                     { step: '03', title: 'Placement & Integration', desc: 'We secure your top choice with offer support and help structure the onboarding for a successful start.' }
                   ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                         <span className="text-3xl font-montserrat font-bold text-[var(--color-accent)] opacity-40 w-12">{item.step}</span>
                         <div>
                            <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
              </section>

              <section ref={storiesRef}>
                <h3 className="font-montserrat font-bold text-2xl text-[var(--color-footer-bg)] mb-8 flex items-center gap-3">
                   <span className="w-8 h-0.5 bg-[var(--color-footer-bg)]"></span> Recent Wins
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-[var(--color-accent)]">
                      <h4 className="font-bold text-lg text-[var(--color-footer-bg)] mb-2">Tech Team Scale-Up</h4>
                      <p className="text-sm text-gray-600 mb-3">Sourced 3 Senior Devs for a FinTech startup.</p>
                      <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">Hired in 4 Weeks</span>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-[var(--color-footer-bg)]">
                      <h4 className="font-bold text-lg text-[var(--color-footer-bg)] mb-2">Executive Placement</h4>
                      <p className="text-sm text-gray-600 mb-3">Head of Operations for a Logistics firm.</p>
                      <span className="text-xs font-bold text-[var(--color-footer-bg)] uppercase tracking-wider">1st Candidate Hired</span>
                   </div>
                </div>
              </section>

              <section ref={ctaRef} className="py-16 text-center relative">
                <div className="relative z-10">
                  <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)] mb-4">
                    Ready to Build Your Dream Team?
                  </h2>
                  <p className="text-gray-600 font-raleway mb-8 max-w-xl mx-auto">
                    Stop sifting through resumes. Start meeting candidates who are ready to make an impact.
                  </p>
                  
                  <div className="relative inline-block">
                    <Link 
                      href="/contact?type=client"
                      className="relative z-10 inline-block bg-[var(--color-accent)] text-white font-montserrat px-10 py-4 rounded-full shadow-lg hover:bg-[var(--color-footer-bg)] transition-all duration-300 text-lg font-bold hover:scale-105"
                    >
                      Start Hiring
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
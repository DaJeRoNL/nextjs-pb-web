'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutPage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (mainContainerRef.current) {
        mainContainerRef.current.style.setProperty('--scroll', `${window.scrollY}px`);
      }
    };
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState('Overview');

  const sections = [
    { ref: heroRef, id: 'Overview' },
    { ref: missionRef, id: 'Mission' },
    { ref: valuesRef, id: 'Values' },
    { ref: storiesRef, id: 'Success Stories' },
    { ref: timelineRef, id: 'Journey' },
    { ref: ctaRef, id: 'Contact' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // @ts-ignore
            setActiveSection(entry.target.dataset.sectionId || 'Overview');
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        section.ref.current.dataset.sectionId = section.id;
        observer.observe(section.ref.current);
      }
    });

    const handleBottomCheck = () => {
      const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
      if (isBottom) {
        setActiveSection(sections[sections.length - 1].id);
      }
    };

    window.addEventListener('scroll', handleBottomCheck, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleBottomCheck);
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useScrollReveal(heroRef, 0);
  useScrollReveal(missionRef, 150);
  useScrollReveal(valuesRef, 300);
  useScrollReveal(storiesRef, 450);
  useScrollReveal(timelineRef, 600);
  useScrollReveal(ctaRef, 750);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div 
      ref={mainContainerRef}
      className="min-h-screen relative transition-colors duration-300" 
      style={{ '--scroll': '0px' } as React.CSSProperties}
    >
      
      {/* Dynamic Parallax Background */}
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
        <div className="glass-overlay dark:bg-black/60"></div>
      </div>

      <Header />

      <div className="main-content pt-24 pb-24 relative z-10 px-4 md:px-8">
        
        {/* --- MAIN WRAPPER CONTAINER --- */}
        <div className="container mx-auto max-w-[1400px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 shadow-2xl fix-pixelation transition-colors duration-300">
            
            {/* Header Section */}
            <div className="mb-16">
              <h1 className="font-montserrat font-black text-5xl md:text-7xl text-[var(--color-footer-bg)] dark:text-white tracking-tight opacity-90">
                The Blueprint
                <span className="text-[var(--color-accent)]">.</span>
              </h1>
              <p className="font-raleway text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-xl ml-1">
                The architecture behind our mission to redefine the modern workforce.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">

              {/* Sidebar Navigation */}
              <nav className="hidden lg:flex flex-col gap-3 sticky top-32 h-max min-w-[200px]">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 pl-4">On This Page</p>
                {sections.map((s) => (
                  <button
                    key={s.id}
                    className={`px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 text-left flex items-center justify-between group
                      ${activeSection === s.id
                        ? 'bg-[var(--color-footer-bg)] text-white shadow-md translate-x-2 dark:bg-white dark:text-zinc-900' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-[var(--color-accent)] dark:text-gray-400 dark:hover:bg-zinc-800'}`}
                    onClick={() => scrollToSection(s.ref)}
                  >
                    {s.id}
                    {activeSection === s.id && <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></span>}
                  </button>
                ))}
              </nav>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-20">

                {/* Hero Section */}
                <section ref={heroRef} className="content-island fix-pixelation p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 bg-gray-50 dark:bg-zinc-800 border-none opacity-0 transition-colors duration-300">
                  <div className="flex-1 text-left">
                    <p className="font-raleway font-bold uppercase tracking-wider mb-4 text-[var(--color-accent)]">About PlaceByte</p>
                    <h1 className="font-arimo font-light text-3xl md:text-5xl text-[var(--color-footer-bg)] dark:text-white mb-8 leading-tight">
                      Where People, Platforms, and Performance come together one smart Byte at a time
                    </h1>
                    <p className="font-raleway text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 font-light">
                      PlaceByte connects exceptional people with forward-thinking companies using a blend of technology, data, and human insight.
                    </p>
                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Powering Growth For</p>
                      <div className="flex flex-wrap gap-4 opacity-100">
                        {['TECH', 'MEDICAL', 'STARTUPS', 'OTHERS'].map((tag) => (
                          <div key={tag} className="h-8 px-5 bg-[var(--color-footer-bg)] dark:bg-zinc-700 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 hidden md:flex justify-center">
                    <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 flex items-center justify-center border border-[var(--color-footer-bg)]/5 dark:border-white/10 shadow-inner">
                        <span className="font-arimo text-8xl font-bold text-[var(--color-footer-bg)]/5 dark:text-white/10 select-none">PB</span>
                    </div>
                  </div>
                </section>

                {/* Mission Section */}
                <section ref={missionRef} className="py-10 text-center opacity-0">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="font-arimo font-light text-3xl md:text-5xl text-[var(--color-footer-bg)] dark:text-white mb-8 leading-tight">
                      Our Mission
                    </h2>
                    <p className="font-montserrat font-medium italic text-gray-700 dark:text-gray-300 leading-relaxed text-xl md:text-2xl px-4">
                      &quot;We aim to redefine how businesses scale their workforce by blending smart recruitment, operational excellence, and workspace optimization. What started as a simple idea connecting talent with opportunity has evolved into a complete ecosystem of people, systems, and performance.&quot;
                    </p>
                  </div>
                </section>

                {/* Values Section */}
                <section ref={valuesRef} className="opacity-0">
                  <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)] dark:text-white mb-10 text-left px-4 border-l-8 border-[var(--color-accent)] pl-6">
                    Core Values
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Precision',
                        color: 'text-red-600',
                        dash: 260,
                        paths: [
                          { d: "M12 2a10 10 0 100 20 10 10 0 000-20z", delay: 0 },
                          { d: "M12 8a4 4 0 100 8 4 4 0 000-8z", delay: 100 },
                          { d: "M12 10a2 2 0 100 4 2 2 0 000-4z", delay: 200 }
                        ],
                        desc: "We don't just fill roles, we engineer fits. Every placement is data-backed and culturally aligned."
                      },
                      {
                        title: 'Agility',
                        color: 'text-yellow-500',
                        dash: 180,
                        paths: [
                          { d: "M13 10V3L4 14h7v7l9-11h-7z", delay: 0 }
                        ],
                        desc: 'The world moves fast. We move faster. OpsByte teams deploy in days, not months.',
                        thunder: true
                      },
                      {
                        title: 'Innovation',
                        color: 'text-[var(--color-primary)]',
                        dash: 240,
                        paths: [
                          { d: "M9.663 17h4.673", delay: 200 },
                          { d: "M8.464 15.536a5 5 0 117.072 0l-.548 5.474A1 1 0 0114.95 21H9.05a1 1 0 01-.995-.91l-.548-5.474z", delay: 100 },
                          { d: "M12 3v1", delay: 300 },
                          { d: "M18.364 4.636l-.707.707", delay: 350 },
                          { d: "M21 12h-1", delay: 400 },
                          { d: "M4 12H3", delay: 450 },
                          { d: "M6.343 6.343l-.707-.707", delay: 500 }
                        ],
                        desc: 'We use technology to remove friction, automate the boring, and elevate human potential.'
                      }
                    ].map((v, i) => (
                      <div
                        key={i}
                        className="group relative content-island fix-pixelation p-8 transition-all duration-300 hover:-translate-y-2 border-l-4 border-transparent hover:border-[var(--color-accent)] hover:shadow-xl flex flex-col items-start bg-gray-50 dark:bg-zinc-800 border-none"
                      >
                        <div className="relative w-14 h-14 mb-6">
                          <svg
                            className="w-full h-full text-gray-300 dark:text-zinc-600 absolute top-0 left-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {v.paths.map((p, idx) => (
                              <path key={idx} d={p.d} />
                            ))}
                          </svg>

                          <svg
                            className={`w-full h-full relative stroke-current ${v.color} draw-path ${v.thunder ? 'shock-hover' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{ 
                                '--dash-length': v.dash,
                                transition: 'stroke-dashoffset 2s ease, opacity 0.4s ease' 
                            } as React.CSSProperties}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {v.paths.map((p, idx) => (
                              <path
                                key={idx}
                                className={`draw-path draw-path-delay-${p.delay}`}
                                d={p.d}
                                style={{ transition: 'stroke-dashoffset 2s ease, opacity 0.4s ease' }}
                              />
                            ))}
                          </svg>
                        </div>

                        <h3 className="font-montserrat font-bold text-xl mb-3 text-[var(--color-footer-bg)] dark:text-white text-left">
                          {v.title}
                        </h3>
                        <p className="font-raleway text-gray-600 dark:text-gray-400 text-left leading-relaxed">{v.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Success Stories Section */}
                <section ref={storiesRef} className="opacity-0">
                  <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)] dark:text-white mb-10 text-left px-4 border-l-8 border-[var(--color-accent)] pl-6">Success Stories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Seasonal Retail Support', desc: 'Supported a retail chain with temporary staff during peak season.', result: '95% Shift Fulfillment', color: 'text-[var(--color-accent)]' },
                      { title: 'Process Automation', desc: 'Automated invoice processing for a consultancy firm.', result: '25% Time Saved', color: 'text-[var(--color-primary)]' },
                      { title: 'Strategic Recruitment', desc: 'Placed key operational managers for a growing logistics company.', result: '3 Hires in 5 Weeks', color: 'text-[var(--color-lime-dark)]' }
                    ].map((card, i) => (
                      <div key={i} className="group content-island fix-pixelation p-0 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-gray-50 dark:bg-zinc-800 border-none">
                        <div className="bg-gray-100 dark:bg-zinc-700/50 h-32 flex items-center justify-center text-gray-300 dark:text-zinc-500 group-hover:bg-gray-200 dark:group-hover:bg-zinc-600 transition-colors">
                          <div className={`${card.color} opacity-50 group-hover:opacity-100 transition-all text-4xl font-bold`}>★</div>
                        </div>
                        <div className="p-8">
                            <h3 className="font-montserrat font-bold text-lg mb-2 text-[var(--color-footer-bg)] dark:text-white">{card.title}</h3>
                            <p className="font-raleway text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{card.desc}</p>
                            <p className={`font-montserrat font-bold text-sm ${card.color}`}>{card.result}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Timeline Section */}
                <section ref={timelineRef} className="relative opacity-0">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 px-4 border-l-8 border-[var(--color-accent)] pl-6">
                      <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)] dark:text-white">Our Journey</h2>
                      <p className="text-gray-400 dark:text-gray-500 font-raleway text-sm uppercase tracking-widest hidden md:block">Est. 2022</p>
                  </div>
                  
                  {/* 1. The Grid (Source of Hover) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 group peer">
                      {[
                          { 
                            year: '2022', 
                            color: '#9ca3af', 
                            title: 'The Idea', 
                            desc: 'PlaceByte is born. A smarter way to match talent with opportunity.' 
                          },
                          { 
                            year: '2023', 
                            color: '#c48b5e', 
                            title: 'Expansion', 
                            desc: 'OpsByte expands our services into operational teams and workforce deployment.' 
                          },
                          { 
                            year: '2024', 
                            color: '#df7f39', 
                            title: 'Automation', 
                            desc: 'CoreByte system officially launches, bringing automation and system optimization to clients.' 
                          },
                          { 
                            year: '2025', 
                            color: 'var(--color-accent)', 
                            title: 'Ecosystem', 
                            desc: 'Today: A complete ecosystem powering recruitment, operations, and workplace optimization.' 
                          }
                      ].map((t, i) => (
                          <div 
                            key={i} 
                            className="content-island fix-pixelation !bg-gray-50 p-6 flex flex-col items-start hover:shadow-lg transition-all duration-300 hover:-translate-y-2 md:w-auto dark:!bg-zinc-800 border-none group-hover:opacity-60 hover:!opacity-100"
                          >
                              <div 
                                className="text-4xl font-bold mb-2" 
                                style={{ color: t.color }}
                              >
                                {t.year}
                              </div>
                              <div className="w-12 h-1 bg-[var(--color-footer-bg)] dark:bg-zinc-500 mb-4 opacity-20"></div>
                              <h3 className="font-montserrat font-bold text-lg text-[var(--color-footer-bg)] dark:text-white mb-2">{t.title}</h3>
                              <p className="font-raleway text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.desc}</p>
                          </div>
                      ))}
                  </div>

                  {/* 2. The Stripes (Target of Hover) */}
                  
                  {/* Desktop Curve */}
                  <div className="absolute top-[50%] left-0 w-full hidden md:block z-0 -translate-y-1/2 peer-hover:opacity-0 transition-opacity duration-300">
                    <svg width="100%" height="150" viewBox="0 0 1200 150" preserveAspectRatio="none" className="opacity-40">
                      <path d="M0,75 C300,0 900,150 1200,75" stroke="var(--color-accent)" strokeWidth="10" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  {/* Mobile Line */}
                  <div className="absolute top-24 bottom-0 left-8 w-1 bg-[var(--color-accent)] opacity-30 md:hidden z-0 peer-hover:opacity-0 transition-opacity duration-300"></div>

                </section>
                
                {/* CTA Section - REMOVED ISLAND CLASSES */}
                <section ref={ctaRef} className="py-20 text-center relative overflow-hidden opacity-0">
                  <div className="relative z-10">
                    <h2 className="font-montserrat font-bold text-4xl text-[var(--color-footer-bg)] dark:text-white mb-6">
                      Ready to Build the Future of Work?
                    </h2>

                    <p className="max-w-3xl font-raleway mx-auto text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10">
                      Whether you&apos;re scaling fast, optimizing workflows, or looking for exceptional talent,
                      PlaceByte is built to accelerate your next chapter.
                    </p>

                    <div className="relative inline-block">
                      <Link
                        href="/contact?type=client"
                        className="relative z-10 inline-block bg-[var(--color-accent)] text-white font-montserrat px-10 py-4 rounded-full shadow-lg hover:bg-[var(--color-footer-bg)] hover:scale-105 transition-all duration-300 text-lg font-bold"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </section>

              </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
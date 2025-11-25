'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutPage() {
  // Parallax scroll state
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
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
    { ref: heroRef, name: 'Overview' },
    { ref: missionRef, name: 'Mission' },
    { ref: valuesRef, name: 'Values' },
    { ref: storiesRef, name: 'Success Stories' },
    { ref: timelineRef, name: 'Journey' },
    { ref: ctaRef, name: 'Contact' },
  ];

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (const section of sections) {
        if (section.ref.current) {
          const offsetTop = section.ref.current.offsetTop;
          const offsetHeight = section.ref.current.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section.name);
            break; 
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Consolidated Hooks
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
    <div className="min-h-screen relative bg-gray-50" style={{ '--scroll': `${scrollY}px` } as React.CSSProperties}>
      
      <div className="fixed-background">
        <div className="glass-blob-static-1"></div>
        <div className="glass-blob-static-2"></div>
        <div className="glass-blob-static-3"></div>
        <div className="glass-overlay"></div>
      </div>

      <Header />

      <div className="main-content pt-16 pb-24 relative z-10">
        
        <div className="container mx-auto px-6 max-w-7xl mb-16">
          <h1 className="font-montserrat font-black text-5xl md:text-7xl text-[var(--color-footer-bg)] tracking-tight opacity-90">
            The Blueprint
            <span className="text-[var(--color-accent)]">.</span>
          </h1>
          <p className="font-raleway text-lg text-gray-500 mt-4 max-w-xl ml-1">
            The architecture behind our mission to redefine the modern workforce.
          </p>
        </div>

        <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-12">

          <nav className="hidden lg:flex flex-col gap-3 sticky top-32 h-max min-w-[200px]">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-4">On This Page</p>
            {sections.map((s) => (
              <button
                key={s.name}
                className={`px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 text-left flex items-center justify-between group
                  ${activeSection === s.name
                    ? 'bg-[var(--color-footer-bg)] text-white shadow-md translate-x-2' 
                    : 'text-gray-500 hover:bg-white/50 hover:text-[var(--color-accent)]'}`}
                onClick={() => scrollToSection(s.ref)}
              >
                {s.name}
                {activeSection === s.name && <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></span>}
              </button>
            ))}
          </nav>

          <div className="flex-1 flex flex-col gap-20">

            <section ref={heroRef} className="content-island p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 bg-white">
              <div className="flex-1 text-left">
                <p className="font-raleway font-bold uppercase tracking-wider mb-4 text-[var(--color-accent)]">About PlaceByte</p>
                <h1 className="font-arimo font-light text-3xl md:text-5xl text-[var(--color-footer-bg)] mb-8 leading-tight">
                  Where People, Platforms, and Performance come together one smart Byte at a time
                </h1>
                <p className="font-raleway text-xl text-gray-600 leading-relaxed mb-10 font-light">
                  PlaceByte connects exceptional people with forward-thinking companies using a blend of technology, data, and human insight.
                </p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Powering Growth For</p>
                  <div className="flex flex-wrap gap-4 opacity-100">
                    {['TECH', 'MEDICAL', 'STARTUPS', 'OTHERS'].map((tag) => (
                      <div key={tag} className="h-8 px-5 bg-[var(--color-footer-bg)] rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 hidden md:flex justify-center">
                <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 flex items-center justify-center border border-[var(--color-footer-bg)]/5 shadow-inner">
                   <span className="font-arimo text-8xl font-bold text-[var(--color-footer-bg)]/5 select-none">PB</span>
                </div>
              </div>
            </section>

            <section ref={missionRef} className="py-10 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-7xl md:text-7xl text-[var(--color-footer-bg)] font-handwriting">
                  Our Mission
                </h2>
                <p className="font-raleway font-thin italic text-gray-700 leading-relaxed text-2xl md:text-3xl px-4">
                  &quot;We aim to redefine how businesses scale their workforce by blending smart recruitment, operational excellence, and workspace optimization. What started as a simple idea connecting talent with opportunity has evolved into a complete ecosystem of people, systems, and performance.&quot;
                </p>
              </div>
            </section>

            <section ref={valuesRef}>
              <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)] mb-10 text-left px-4 border-l-8 border-[var(--color-accent)] pl-6">Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[ 
                  { 
                    title: 'Precision', 
                    icon: <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8a4 4 0 100 8 4 4 0 000-8z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10a2 2 0 100 4 2 2 0 000-4z" /></svg>,
                    desc: 'We don\'t just fill roles, we engineer fits. Every placement is data-backed and culturally aligned.' 
                  },
                  { 
                    title: 'Agility', 
                    icon: <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                    desc: 'The world moves fast. We move faster. OpsByte teams deploy in days, not months.' 
                  },
                  { 
                    title: 'Innovation', 
                    icon: <svg className="w-12 h-12 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548 5.474A1 1 0 0114.95 21H9.05a1 1 0 01-.995-.91l-.548-5.474z" /></svg>,
                    desc: 'We use technology to remove friction, automate the boring, and elevate human potential.' 
                  }
                ].map((v, i) => (
                  <div key={i} className="group content-island p-8 hover:-translate-y-2 transition-all duration-300 border-l-4 border-transparent hover:border-[var(--color-accent)] hover:shadow-xl">
                    <div className="mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{v.icon}</div>
                    <h3 className="font-montserrat font-bold text-xl mb-3 text-[var(--color-footer-bg)] text-left">{v.title}</h3>
                    <p className="font-raleway text-gray-600 text-left leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section ref={storiesRef}>
              <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)] mb-10 text-left px-4 border-l-8 border-[var(--color-accent)] pl-6">Success Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { title: 'Seasonal Retail Support', desc: 'Supported a retail chain with temporary staff during peak season.', result: '95% Shift Fulfillment', color: 'text-[var(--color-accent)]' },
                   { title: 'Process Automation', desc: 'Automated invoice processing for a consultancy firm.', result: '25% Time Saved', color: 'text-[var(--color-primary)]' },
                   { title: 'Strategic Recruitment', desc: 'Placed key operational managers for a growing logistics company.', result: '3 Hires in 5 Weeks', color: 'text-[var(--color-lime-dark)]' }
                 ].map((card, i) => (
                   <div key={i} className="group content-island p-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <div className="bg-gray-50 h-32 flex items-center justify-center text-gray-300 group-hover:bg-gray-100 transition-colors">
                        <div className={`${card.color} opacity-50 group-hover:opacity-100 transition-all text-4xl font-bold`}>★</div>
                      </div>
                      <div className="p-8">
                          <h3 className="font-montserrat font-bold text-lg mb-2 text-[var(--color-footer-bg)]">{card.title}</h3>
                          <p className="font-raleway text-sm text-gray-600 mb-4 leading-relaxed">{card.desc}</p>
                          <p className={`font-montserrat font-bold text-sm ${card.color}`}>{card.result}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </section>

            <section ref={timelineRef} className="relative">
               <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4 border-l-8 border-[var(--color-accent)] pl-6">
                  <h2 className="font-montserrat font-bold text-3xl text-[var(--color-footer-bg)]">Our Journey</h2>
                  <p className="text-gray-400 font-raleway text-sm uppercase tracking-widest hidden md:block">Est. 2022</p>
               </div>
               
               <div className="absolute top-[50%] left-0 w-full hidden md:block z-0 -translate-y-1/2">
                 <svg width="100%" height="150" viewBox="0 0 1200 150" preserveAspectRatio="none" className="opacity-40">
                   <path d="M0,75 C300,0 900,150 1200,75" stroke="var(--color-accent)" strokeWidth="10" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                 </svg>
               </div>
               <div className="absolute top-24 bottom-0 left-8 w-1 bg-[var(--color-accent)] opacity-30 md:hidden z-0"></div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
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
                       <div key={i} className="content-island !bg-white p-6 flex flex-col items-start hover:shadow-lg transition-all duration-300 hover:-translate-y-2 md:w-auto">
                           <div 
                             className="text-4xl font-bold mb-2" 
                             style={{ color: t.color }}
                           >
                             {t.year}
                           </div>
                           <div className="w-12 h-1 bg-[var(--color-footer-bg)] mb-4 opacity-20"></div>
                           <h3 className="font-montserrat font-bold text-lg text-[var(--color-footer-bg)] mb-2">{t.title}</h3>
                           <p className="font-raleway text-sm text-gray-600 leading-relaxed">{t.desc}</p>
                       </div>
                   ))}
               </div>
           </section>
           
           <section ref={ctaRef} className="content-island py-20 text-center bg-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="font-montserrat font-bold text-4xl text-[var(--color-footer-bg)] mb-6">
                  Ready to Build the Future of Work?
                </h2>

                <p className="max-w-3xl font-raleway mx-auto text-gray-600 text-lg leading-relaxed mb-10">
                  Whether you&apos;re scaling fast, optimizing workflows, or looking for exceptional talent,
                  PlaceByte is built to accelerate your next chapter.
                </p>

                <div className="relative inline-block">
                  {/* Optimized CTA Image */}
                  <Image 
                    src="/cta-splash.png" 
                    alt="Background Splash" 
                    width={300} 
                    height={300}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-auto opacity-60 pointer-events-none z-0"
                  />
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

      <Footer />
    </div>
  );
}
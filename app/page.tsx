'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // IMPORT ADDED
import Header from './components/Header'; 
import Footer from './components/Footer'; 

/* --- HOOKS --- */
const useScrollReveal = (ref: React.RefObject<HTMLElement | null>, delay = 0, threshold = 0.1) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.animationDelay = `${delay}ms`;
          element.classList.add('visible', 'scroll-reveal');
          observer.unobserve(element); 
        }
      }, { threshold }
    );
    observer.observe(element);
    return () => { if (element) observer.unobserve(element); };
  }, [ref, delay, threshold]);
};

const useElementInView = (ref: any) => {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting), { threshold: 0 }
    );
    observer.observe(element);
    return () => { if (element) observer.unobserve(element); };
  }, [ref]);
  return isInView;
};

const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return scrollY;
};

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

    // 5 second delay before showing
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
      style={{ bottom: '8rem' }} // Higher up
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
          className="min-btn"
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
      'var(--color-yellow-dark)'   // Yellow
    ];
    const nextColors = colors.filter(c => c !== byteColor);
    const randomColor = nextColors[Math.floor(Math.random() * nextColors.length)];
    setByteColor(randomColor);
  };

  return (
    <section id="home" className="relative pt-40 pb-32 overflow-hidden z-10 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
        <h1 className="font-arimo font-light text-4xl md:text-6xl text-gray-900 leading-tight mb-12" style={{ fontWeight: 300 }}>
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
        <p className="font-raleway font-light italic text-2xl md:text-3xl text-gray-600 mt-12 max-w-4xl mx-auto mb-16 leading-relaxed">
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
    { title: "CoreByte", description: "System development and workflow automation. We build the intelligent workspace that quietly removes the manual work.", color: 'var(--color-yellow-dark)', image: "/CBh.jpg", link: '/corebyte', mirrored: false }
  ];

  return (
    <section id="services" className="py-16 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div ref={wrapperRef} className="content-island p-8 md:p-12 scroll-reveal relative">
          <div className="text-center mb-12 px-6">
            <p className="font-raleway font-bold uppercase tracking-wider mb-4" style={{color: 'var(--color-accent)'}}>HOW CAN WE HELP YOU?</p>
            <h2 className="font-montserrat font-bold text-4xl" style={{ color: 'var(--color-footer-bg)' }}>A Smarter Way to Grow</h2>
            <p className="font-raleway text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Three layers that work together or solo, depending on what you need.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
                {/* UPDATED IMAGE COMPONENT */}
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
                  <p className="font-raleway text-gray-600 mb-6 flex-grow leading-relaxed">{service.description}</p>
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
        <div ref={ctaRef} className="content-island p-8 md:p-12 scroll-reveal relative">
          <p className="font-raleway font-bold uppercase tracking-wider mb-4" style={{color: 'var(--color-accent)'}}>Convinced?</p>
          <h2 className="font-montserrat font-bold text-4xl mb-8" style={{ color: 'var(--color-footer-bg)' }}>Let&apos;s Connect!</h2>
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
      className={`scroll-to-top-button ${isVisible ? 'visible' : ''} ${isClicked ? 'clicked' : ''}`} 
      aria-label="Scroll to top"
    >
      {isClicked ? (
        <div className="w-6 h-1 bg-[var(--color-footer-bg)] rounded-full"></div>
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
  const aboutSectionInView = useElementInView(aboutRef); 
  useScrollReveal(aboutRef, 100); 
  const scrollY = useScrollY(); 

  // Force Scroll to Top on Load
  useScrollToTop();

  return (
    <>
      {/* No StyleInjector anymore! */}
      <div className="min-h-screen relative" style={{ '--scroll': `${scrollY}px` } as React.CSSProperties}>
        
        <div className="fixed-background">
          <div className="glass-blob-1"></div>
          <div className="glass-blob-2"></div>
          <div className="glass-blob-3"></div>
          <div className="glass-overlay"></div>
        </div>

        <Header />

        <div className="main-content">
          <HeroSection />
          <ServicesSection />

          <section id='about' ref={aboutRef} className='py-16 relative overflow-hidden scroll-reveal z-10'>
            <div className='container mx-auto px-6 max-w-7xl text-center'>
              <div className='content-island relative'>
                <p className='font-raleway font-bold uppercase tracking-wider mb-4' style={{color:'var(--color-accent)'}}>Why PlaceByte?</p>
                <h2 className='font-montserrat font-bold text-4xl mb-6' style={{ color: 'var(--color-footer-bg)' }}>Engineered for Growth</h2>
                <hr className='header-separator'/>
                <div className='font-raleway text-lg text-gray-700 space-y-6'>
                  <p className='leading-relaxed'>
                    We built PlaceByte on a simple idea. Great teams are engineered, supported, and powered. So we created three layers that work together or solo, depending on what you need. Recruitment brings you the talent. OpsByte plugs in the team that keeps your workflows moving without the cost and chaos of traditional hiring. CoreByte powers the workspace behind it all with automation that quietly removes the manual work nobody wants to do.
                  </p>
                  <p className='leading-relaxed font-semibold text-gray-900'>
                    Our mission is to give businesses a smarter way to grow through flexible talent, clean processes, and an intelligent workspace that keeps everything synced, documented, and running on time. The right people keep daily operations sharp. The right systems keep your workflows aligned through automation, diagnostics, and real-time data accuracy. Together, they help teams move faster, work cleaner, and operate with far less stress.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <CTABeforeFooter />

          {/* Shared Footer */}
          <Footer />

        </div>

        <ScrollToTopButton />

      </div>
    </>
  );
}
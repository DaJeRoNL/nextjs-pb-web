'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

const useScrollY = () => {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return scrollY;
};

export default function DisclaimerPage() {
  const scrollY = useScrollY();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen relative" style={{ '--scroll': `${scrollY}px` } as React.CSSProperties}>
      <div className="fixed-background">
        <div className="glass-blob-1"></div>
        <div className="glass-blob-2"></div>
        <div className="glass-blob-3"></div>
        <div className="glass-overlay"></div>
      </div>

      <Header />

      <div className="main-content pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          
          <div className="content-island p-10 md:p-16 !bg-white text-black fix-pixelation">
             <h1 className="font-montserrat font-bold text-4xl mb-8 text-[var(--color-footer-bg)] text-center">Disclaimer</h1>
             <p className="font-raleway text-sm text-gray-500 text-center mb-12">Last Updated: June 19, 2025</p>

             <div className="font-raleway text-gray-700 space-y-8 leading-relaxed text-justify">
                
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">1. Hiring Outcomes</h2>
                  <p>While PlaceByte screens all candidates rigorously, we cannot guarantee the future performance, attendance, or longevity of any candidate placed. Hiring decisions are the sole responsibility of the Client.</p>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">2. Software Services (CoreByte)</h2>
                  <p>CoreByte provides software solutions on an "as is" basis. While we adhere to high development standards, we do not warrant that our software will be entirely error-free, uninterrupted, or compatible with all future systems. We are not liable for data loss resulting from Client misuse or external cyber-attacks.</p>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">3. No Professional Advice</h2>
                  <p>Information provided on this website does not constitute legal, financial, or HR advice. Clients should consult with their own professional advisors regarding employment laws and compliance in their specific jurisdictions.</p>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">4. Third-Party Links</h2>
                  <p>This website may contain links to external websites. PlaceByte is not responsible for the content, privacy policies, or practices of any third-party sites.</p>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">5. No Co-Employment</h2>
                  <p>Personnel provided through OpsByte are independent contractors or employees of PlaceByte. No co-employment relationship is created between the Client and OpsByte personnel. PlaceByte retains sole responsibility for the payment of wages, benefits, and taxes for its own employees.</p>
                </section>

             </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
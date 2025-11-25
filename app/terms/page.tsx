'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Keep if you use Link inside content
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

export default function TermsPage() {
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
          
          <div className="content-island p-10 md:p-16">
             <h1 className="font-montserrat font-bold text-4xl mb-8 text-[var(--color-footer-bg)] text-center">Terms & Conditions</h1>
             <p className="font-raleway text-sm text-gray-500 text-center mb-12">Last Updated: June 19, 2025</p>

             <div className="font-raleway text-gray-700 space-y-8 leading-relaxed text-justify">
                
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">1. Introduction</h2>
                  <p>Welcome to PlaceByte. These Terms & Conditions ("Terms") govern your engagement with PlaceByte ("we," "us," or "our") and the use of our services, including PlaceByte (Recruitment), OpsByte (Operations Staffing), and CoreByte (Systems & Automation). By engaging our services or using our website, you agree to be bound by these Terms.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">2. Definitions</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>"Client"</strong> refers to the entity engaging PlaceByte for services.</li>
                    <li><strong>"Candidate"</strong> refers to an individual presented by PlaceByte for employment.</li>
                    <li><strong>"Services"</strong> encompasses recruitment, operational staffing, and software development provided by PlaceByte.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">3. Scope of Services</h2>
                  <p><strong>3.1 PlaceByte (Recruitment):</strong> We source, screen, and present candidates for your consideration. The final hiring decision rests solely with the Client.</p>
                  <p><strong>3.2 OpsByte (Operations):</strong> We provide managed teams or staff augmentation services. While we supervise performance, daily task direction typically remains with the Client unless otherwise agreed.</p>
                  <p><strong>3.3 CoreByte (Automation):</strong> We design and implement software solutions. Specific deliverables, milestones, and acceptance criteria will be defined in a separate Statement of Work (SOW).</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">4. Fees and Payment</h2>
                  <p>Invoices are due within the timeframe specified in your Service Agreement (typically 14 or 30 days). Late payments may incur interest at a rate of 1.5% per month or the maximum allowable by law. All fees are exclusive of applicable taxes, which are the responsibility of the Client.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">5. Intellectual Property (IP) Rights</h2>
                  <p><strong>5.1 Client IP:</strong> You retain all rights to materials you provide to us.</p>
                  <p><strong>5.2 CoreByte Deliverables:</strong> Upon full payment of all fees, ownership of custom software code developed specifically for the Client transfers to the Client. PlaceByte retains ownership of pre-existing background IP, libraries, and tools used to create the deliverable, granting the Client a perpetual, non-exclusive, royalty-free license to use such background IP.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">6. Recruitment Guarantee (PlaceByte)</h2>
                  <p>If a candidate engaged by the Client leaves voluntarily or is terminated for cause within <strong>ninety (90) days</strong> of their start date, PlaceByte will provide a one-time replacement candidate for the same role at no additional cost. This guarantee applies only if invoices were paid on time and the termination was not due to redundancy or restructuring. PlaceByte does not offer monetary refunds.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">7. Software Acceptance (CoreByte)</h2>
                  <p>For software deliverables, the Client shall have a period of <strong>fourteen (14) days</strong> ("Acceptance Period") to test the deliverables. If no material errors are reported in writing within this period, the deliverables shall be deemed accepted. Warranty claims after this period will be subject to separate support agreements.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">8. Term and Termination</h2>
                  <p>Either party may terminate an ongoing engagement for convenience with <strong>thirty (30) days'</strong> written notice, subject to payment for all work performed up to the termination date. Either party may terminate immediately for material breach if such breach is not cured within ten (10) days of notice.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">9. Confidentiality</h2>
                  <p>Both parties agree to maintain the confidentiality of proprietary information disclosed during the engagement. This includes, but is not limited to, business strategies, candidate data, software architecture, and pricing. This obligation persists for two (2) years following the termination of services.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">10. Limitation of Liability</h2>
                  <p>To the maximum extent permitted by law, PlaceByte shall not be liable for indirect, incidental, or consequential damages, including lost profits. Our total liability for any claim arising out of these Terms shall not exceed the total fees paid by the Client in the three (3) months preceding the claim.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">11. Non-Solicitation</h2>
                  <p>During the term of engagement and for twelve (12) months thereafter, the Client agrees not to directly solicit or hire PlaceByte internal employees or contractors without our prior written consent. A placement fee may apply for any such hires.</p>
                </section>

                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">12. Governing Law</h2>
                  <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes shall be resolved in the courts of Metro Manila.</p>
                </section>

             </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
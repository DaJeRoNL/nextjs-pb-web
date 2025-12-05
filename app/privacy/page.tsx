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

export default function PrivacyPage() {
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
             <h1 className="font-montserrat font-bold text-4xl mb-8 text-[var(--color-footer-bg)] text-center">Privacy Policy</h1>
             <p className="font-raleway text-sm text-gray-500 text-center mb-12">Last Updated: June 19, 2025</p>

             <div className="font-raleway text-gray-700 space-y-8 leading-relaxed text-justify">
                
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">1. Data Collection</h2>
                  <p>We collect information to provide better services to our clients and candidates.</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>For Clients:</strong> We collect contact details, company information, project requirements, and billing data.</li>
                    <li><strong>For Candidates:</strong> We collect resumes (CVs), contact information, employment history, and interview notes. By submitting your CV to PlaceByte, you consent to us processing your data for recruitment purposes.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">2. Use of Information</h2>
                  <p>Your data is used strictly for:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Facilitating recruitment processes (matching candidates to roles).</li>
                    <li>Managing operational teams under OpsByte.</li>
                    <li>Developing and deploying software solutions under CoreByte.</li>
                    <li>Communication regarding service updates or legal notices.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">3. Data Sharing and Disclosure</h2>
                  <p>We do not sell your personal data. We may share data with:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Prospective Employers:</strong> Candidate data is shared with clients only after candidate consent or preliminary screening.</li>
                    <li><strong>Service Providers:</strong> Third-party tools we use for CRM, project management, or hosting (e.g., Firebase, Google Cloud), strictly under confidentiality agreements.</li>
                    <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">4. Data Security</h2>
                  <p>We implement industry-standard security measures, including encryption and access controls, to protect your data. CoreByte systems are designed with privacy-by-design principles to minimize data exposure risks.</p>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">5. Data Retention</h2>
                  <p>We retain candidate data for a period of 24 months to consider you for future roles, unless you request deletion. Client data is retained as long as necessary for business relationships and tax compliance.</p>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">6. Cookies & Tracking</h2>
                  <p>We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. You can control cookie preferences through your browser settings.</p>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">7. International Data Transfers</h2>
                  <p>Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ. By using our services, you consent to such transfers.</p>
                </section>
                <section>
                  <h2 className="font-montserrat font-bold text-xl text-[var(--color-primary-dark)] mb-4">8. Your Rights</h2>
                  <p>You have the right to access, correct, or delete your personal data held by us. To exercise these rights, please contact us at <a href="mailto:team@placebyte.com" className="text-[var(--color-primary)] hover:underline">team@placebyte.com</a>.</p>
                </section>

             </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
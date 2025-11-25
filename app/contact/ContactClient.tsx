'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Turnstile } from '@marsidev/react-turnstile'; // Import Turnstile
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import { sendEmail } from '../actions'; 

// --- TYPES ---
interface ContactFormData {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  role?: string;
  specificRole?: string;
  contactMethod?: string;
  details?: string;
  message?: string;
  cv?: File | null;
  terms?: boolean;
}

// --- REUSING HOOKS ---
const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    if (typeof window !== 'undefined') {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);
  return scrollY;
};

// --- ICONS ---
const Icons = {
  Building: () => (
    <svg className="w-5 h-5 mr-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5 mr-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  )
};

// --- LOADING SPINNER COMPONENT ---
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
    <p className="font-raleway text-gray-500 animate-pulse">Loading form...</p>
  </div>
);

// --- FORM CONTENT COMPONENT ---
const ContactClient = () => {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const [activeTab, setActiveTab] = useState('general');
  
  const [formData, setFormData] = useState<ContactFormData>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null); // State for Turnstile Token
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const scrollY = useScrollY();

  useEffect(() => {
    if (typeParam === 'client' || typeParam === 'talent') {
      setActiveTab(typeParam);
    } else {
      setActiveTab('general');
    }
    setIsSubmitted(false); 
    setFormData({});
    setTurnstileToken(null); // Reset token on tab change
    setIsFormValid(false);
    setIsSubmitting(false);
  }, [typeParam]);

  // --- VALIDATION LOGIC ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    const checked = target.checked;
    const files = target.files;
    
    if (type === 'file') {
      const file = files ? files[0] : null;
      if (file) {
        if (file.type !== 'application/pdf') {
          alert("Only PDF files are allowed.");
          target.value = ''; 
          return;
        }
        if (file.size > 5 * 1024 * 1024) { 
          alert("File size too large. Max limit is 5MB.");
          target.value = '';
          return;
        }
      }
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  useEffect(() => {
    let isValid = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasEmail = formData.email && emailRegex.test(formData.email);
    
    // Check if token exists
    const hasToken = !!turnstileToken; 

    if (activeTab === 'client') {
       isValid = Boolean(
         formData.name?.trim() &&
         formData.company?.trim() &&
         hasEmail &&
         formData.phone?.trim() &&
         formData.terms === true &&
         hasToken
       );
    } else if (activeTab === 'talent') {
       isValid = Boolean(
         formData.name?.trim() &&
         hasEmail &&
         formData.phone?.trim() &&
         formData.cv && 
         formData.terms === true &&
         hasToken
       );
    } else {
       isValid = Boolean(
         formData.name?.trim() &&
         hasEmail &&
         formData.message?.trim() &&
         formData.terms === true &&
         hasToken
       );
    }
    setIsFormValid(isValid);
  }, [formData, activeTab, turnstileToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !turnstileToken) return; // Prevent submit without token
    
    setIsSubmitting(true);

    try {
        const payload = new FormData();
        
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'cv' && value instanceof File) {
                payload.append('cv', value);
            } else if (value !== undefined && value !== null && key !== 'cv') {
                payload.append(key, String(value));
            }
        });

        payload.append('typeParam', activeTab);
        payload.append('cf-turnstile-response', turnstileToken); // Send the token
        
        const honeypotInput = (e.target as HTMLFormElement).querySelector('input[name="website_url"]') as HTMLInputElement;
        if (honeypotInput) {
            payload.append('website_url', honeypotInput.value);
        }

        const result = await sendEmail(null, payload);

        if (result.success) {
            setIsSubmitted(true);
        } else {
            alert(result.message);
            // Optional: reset token on failure so user can try again
            setTurnstileToken(null); 
        }
    } catch (error) {
        console.error("Submission Error:", error);
        alert("An unexpected error occurred. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // UPDATED: Using onSuccess instead of onVerify
  const TurnstileWidget = () => (
    <div className="mt-4 mb-4">
      <Turnstile 
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''} 
        onSuccess={(token) => setTurnstileToken(token)}
        onExpire={() => setTurnstileToken(null)}
      />
    </div>
  );

  return (
    <div className="min-h-screen relative" style={{ '--scroll': `${scrollY}px` } as React.CSSProperties}>
      
      <div className="fixed-background">
        <div className="glass-blob-static-1"></div>
        <div className="glass-blob-static-2"></div>
        <div className="glass-blob-static-3"></div>
        <div className="glass-overlay"></div>
      </div>

      <Header />

      <div className="main-content pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-6xl"> 
          <Suspense fallback={<LoadingSpinner />}>
            {/* Render the actual form content here */}
            <div className="w-full max-w-[1400px] mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white flex flex-col lg:flex-row min-h-[700px] animate-fadeIn">
              
              {/* LEFT PANEL */}
              <div className="lg:w-1/3 bg-[var(--color-footer-bg)] text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, var(--color-accent), transparent 40%)' }}></div>
                <div className="relative z-10">
                  <p className="font-raleway font-bold text-[var(--color-accent)] uppercase tracking-[0.2em] text-sm mb-4">Contact Us</p>
                  <h1 className="font-montserrat font-bold text-4xl lg:text-5xl mb-6 leading-tight">
                    {activeTab === 'client' ? 'Scale Your\nVision.' : activeTab === 'talent' ? 'Future\nProof Your\nCareer.' : "Let's\nConnect."}
                  </h1>
                  <p className="font-raleway text-gray-300 text-lg leading-relaxed mb-8">
                    {activeTab === 'client' ? "Partner with PlaceByte to build dedicated, high-performance teams tailored to your operational needs." : activeTab === 'talent' ? "Join a network of top-tier professionals working with global companies from the comfort of your home." : "Have a question? We are here to help you navigate your next step."}
                  </p>
                </div>
                <div className="relative z-10 space-y-6 pt-8 border-t border-gray-700">
                  <div className="flex items-start"><Icons.Building /><div><h3 className="font-montserrat font-bold text-sm mb-1">Headquarters</h3><p className="font-raleway text-gray-300 text-sm leading-relaxed">Concepcion Aguila St<br />San Miguel, Manila, Philippines</p></div></div>
                  <div className="flex items-start"><Icons.Mail /><div><h3 className="font-montserrat font-bold text-sm mb-1">Email Us</h3><a href="mailto:team@placebyte.com" className="font-raleway text-gray-300 text-sm hover:text-white transition-colors">team@placebyte.com</a></div></div>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="lg:w-2/3 bg-white p-8 lg:p-14 flex flex-col">
                {!isSubmitted && (
                  <div className="flex flex-wrap gap-6 border-b border-gray-200 pb-1 mb-10">
                    <button onClick={() => setActiveTab('client')} disabled={isSubmitting} className={`pb-3 text-sm font-montserrat font-bold tracking-wide uppercase transition-all relative ${activeTab === 'client' ? 'text-[var(--color-accent)]' : 'text-gray-400 hover:text-gray-600'}`}>For Clients{activeTab === 'client' && <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-[var(--color-accent)] rounded-t-full"></span>}</button>
                    <button onClick={() => setActiveTab('talent')} disabled={isSubmitting} className={`pb-3 text-sm font-montserrat font-bold tracking-wide uppercase transition-all relative ${activeTab === 'talent' ? 'text-[var(--color-footer-bg)]' : 'text-gray-400 hover:text-gray-600'}`}>For Talent{activeTab === 'talent' && <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-[var(--color-footer-bg)] rounded-t-full"></span>}</button>
                    <button onClick={() => setActiveTab('general')} disabled={isSubmitting} className={`pb-3 text-sm font-montserrat font-bold tracking-wide uppercase transition-all relative ${activeTab === 'general' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}>General Inquiry{activeTab === 'general' && <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-[var(--color-primary)] rounded-t-full"></span>}</button>
                  </div>
                )}

                <div className="flex-grow">
                  {isSubmitted ? (
                    activeTab === 'client' ? (
                      <div className="text-center animate-fadeIn h-full flex flex-col w-full">
                        <h2 className="font-montserrat font-bold text-3xl mb-2 text-[var(--color-footer-bg)]">Thank You!</h2>
                        <p className="font-raleway text-gray-600 mb-6">We have received your information. To fast-track the process, please schedule a brief introductory call with us below.</p>
                        <div className="w-full relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-inner flex-grow min-h-[800px]"><iframe src="https://calendly.com/trish_alvarez_placebyte/placebyte-discovery-call?hide_gdpr_banner=1" width="100%" height="100%" frameBorder="0" title="Select a Date & Time - Calendly" style={{ minHeight: '100%', minWidth: '100%' }}></iframe></div>
                        <div className="mt-6 text-center"><button onClick={() => setIsSubmitted(false)} className="text-gray-500 hover:text-[var(--color-accent)] font-medium text-sm transition-colors underline">← Return to form</button></div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn min-h-[400px]">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 text-green-600 shadow-sm"><Icons.Check /></div>
                        <h2 className="font-montserrat font-bold text-3xl mb-4 text-[var(--color-footer-bg)]">Message Received!</h2>
                        <p className="font-raleway text-gray-600 mb-10 text-lg leading-relaxed max-w-md mx-auto">{activeTab === 'talent' ? "Thank you for your application. Our recruitment team is currently reviewing your profile against our open requirements." : "Thank you for reaching out. We have received your inquiry and will respond shortly."}</p>
                        <Link href="/" className="inline-flex items-center justify-center bg-[var(--color-footer-bg)] text-white font-bold font-montserrat py-3 px-8 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl">Back to Home</Link>
                      </div>
                    )
                  ) : (
                    <>
                      {/* CLIENT FORM */}
                      {activeTab === 'client' && (
                        <form className="space-y-6 animate-fadeIn" onSubmit={handleSubmit}>
                          <input type="text" name="website_url" style={{display:'none'}} tabIndex={-1} autoComplete="off" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Name</label><input name="name" type="text" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-all disabled:opacity-50" placeholder="John Doe" required /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name</label><input name="company" type="text" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-all disabled:opacity-50" placeholder="Tech Corp Inc." required /></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label><input name="email" type="email" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-all disabled:opacity-50" placeholder="john@company.com" required /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label><input name="phone" type="tel" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-all disabled:opacity-50" placeholder="+1 (555) 000-0000" required /></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Service Interest</label><div className="relative"><select name="service" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-all appearance-none text-gray-700 disabled:opacity-50"><option>Recruitment (PlaceByte)</option><option>Operations Team (OpsByte)</option><option>Systems & Automation (CoreByte)</option><option>Other / Not Sure</option></select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preferred Contact</label><div className="relative"><select name="contactMethod" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-all appearance-none text-gray-700 disabled:opacity-50"><option>Email</option><option>Phone Call</option><option>WhatsApp</option></select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div></div>
                          </div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Additional Details</label><textarea name="details" onChange={handleInputChange} disabled={isSubmitting} rows={3} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none transition-all resize-none disabled:opacity-50" placeholder="Tell us about your needs..."></textarea></div>
                          
                          <div className="flex items-start mt-4"><input id="terms-client" name="terms" type="checkbox" onChange={handleInputChange} disabled={isSubmitting} className="mt-1 h-4 w-4 text-[var(--color-accent)] border-gray-300 rounded focus:ring-[var(--color-accent)] cursor-pointer" required /><label htmlFor="terms-client" className="ml-2 block text-xs text-gray-500">I agree to the <a href="/terms" target="_blank" className="underline hover:text-gray-800">Terms</a> & <a href="/privacy" target="_blank" className="underline hover:text-gray-800">Privacy Policy</a>.</label></div>
                          
                          <TurnstileWidget />

                          <button type="submit" disabled={!isFormValid || isSubmitting} className={`px-8 py-3 rounded-md font-bold font-montserrat text-sm uppercase tracking-wide transition-all duration-300 flex items-center shadow-md ${!isFormValid || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[var(--color-accent)] text-white hover:bg-orange-700 hover:shadow-lg translate-y-0'}`}>{isSubmitting ? 'Processing...' : <>Start Discovery <Icons.ArrowRight /></>}</button>
                          <p className="text-sm text-gray-400 text-left italic mt-4 pl-1 border-l-2 border-gray-200">Note: Submitting this form unlocks the option to book a meeting directly with our team.</p>
                        </form>
                      )}

                      {/* TALENT FORM */}
                      {activeTab === 'talent' && (
                        <form encType="multipart/form-data" className="space-y-6 animate-fadeIn" onSubmit={handleSubmit}>
                          <input type="text" name="website_url" style={{display:'none'}} tabIndex={-1} autoComplete="off" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Legal Name</label><input name="name" type="text" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-footer-bg)] focus:ring-1 focus:ring-[var(--color-footer-bg)] outline-none transition-all disabled:opacity-50" required /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label><input name="email" type="email" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-footer-bg)] focus:ring-1 focus:ring-[var(--color-footer-bg)] outline-none transition-all disabled:opacity-50" required /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label><input name="phone" type="tel" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-footer-bg)] focus:ring-1 focus:ring-[var(--color-footer-bg)] outline-none transition-all disabled:opacity-50" required /></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discipline</label><div className="relative"><select name="role" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-footer-bg)] focus:ring-1 focus:ring-[var(--color-footer-bg)] outline-none transition-all appearance-none text-gray-700 disabled:opacity-50"><option>Tech / Developer</option><option>Operations / Admin</option><option>Healthcare / Medical</option><option>Marketing</option><option>Other</option></select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preferred Contact</label><div className="relative"><select name="contactMethod" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-footer-bg)] focus:ring-1 focus:ring-[var(--color-footer-bg)] outline-none transition-all appearance-none text-gray-700 disabled:opacity-50"><option>Email</option><option>Phone Call</option><option>WhatsApp</option></select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div></div>
                          </div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specific Role / Title</label><input name="specificRole" type="text" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-footer-bg)] focus:ring-1 focus:ring-[var(--color-footer-bg)] outline-none transition-all disabled:opacity-50" placeholder="e.g. React Dev" /></div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Additional Information / Work Preferences</label><textarea name="details" rows={4} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-footer-bg)] focus:ring-1 focus:ring-[var(--color-footer-bg)] outline-none transition-all disabled:opacity-50" placeholder="e.g. Remote work only, Part-time availability, Salary expectations..."></textarea></div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Upload CV (PDF)</label><div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 transition-colors"><input name="cv" type="file" accept=".pdf" onChange={handleInputChange} disabled={isSubmitting} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required /><div className="text-gray-500"><span className="block text-sm font-medium text-[var(--color-footer-bg)]">Click to upload</span><span className="block text-xs mt-1">or drag and drop PDF (Max 5MB)</span>{formData.cv && <span className="block mt-2 text-sm text-green-600 font-bold">Selected: {formData.cv.name}</span>}</div></div></div>
                          
                          <div className="flex items-center mt-4"><input id="terms-talent" name="terms" type="checkbox" onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-[var(--color-footer-bg)] border-gray-300 rounded focus:ring-[var(--color-footer-bg)] cursor-pointer" required /><label htmlFor="terms-talent" className="ml-2 block text-xs text-gray-500">I agree to the <a href="/terms" target="_blank" className="underline hover:text-gray-800">Terms</a> & <a href="/privacy" target="_blank" className="underline hover:text-gray-800">Privacy Policy</a>.</label></div>
                          
                          <TurnstileWidget />

                          <button type="submit" disabled={!isFormValid || isSubmitting} className={`w-full font-bold font-montserrat py-4 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg mt-4 ${!isFormValid || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[var(--color-footer-bg)] text-white hover:bg-gray-800'}`}>{isSubmitting ? 'Sending Application...' : 'Submit Application'}</button>
                        </form>
                      )}

                      {/* GENERAL FORM */}
                      {activeTab === 'general' && (
                        <form className="space-y-6 animate-fadeIn" onSubmit={handleSubmit}>
                          <input type="text" name="website_url" style={{display:'none'}} tabIndex={-1} autoComplete="off" />
                          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label><input name="name" type="text" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all disabled:opacity-50" required /></div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label><input name="email" type="email" onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all disabled:opacity-50" required /></div>
                          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label><textarea name="message" rows={4} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all disabled:opacity-50" required></textarea></div>
                          
                          <div className="flex items-center mt-4"><input id="terms-general" name="terms" type="checkbox" onChange={handleInputChange} disabled={isSubmitting} className="mt-1 h-4 w-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)] cursor-pointer" required /><label htmlFor="terms-general" className="ml-2 block text-xs text-gray-500">I agree to the <a href="/terms" target="_blank" className="underline hover:text-gray-800">Terms</a> & <a href="/privacy" target="_blank" className="underline hover:text-gray-800">Privacy Policy</a>.</label></div>
                          
                          <TurnstileWidget />

                          <button type="submit" disabled={!isFormValid || isSubmitting} className={`w-full font-bold font-montserrat py-4 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg mt-4 ${!isFormValid || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'}`}>{isSubmitting ? 'Sending...' : 'Send Message'}</button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactClient;
import React, { Suspense } from 'react';
import ContactClient from './ContactClient';

// We define metadata here because this is a Server Component
export const metadata = {
  title: 'Contact Us - PlaceByte',
  description: 'Get in touch with PlaceByte for recruitment, operations, and systems automation solutions.',
};

export default function ContactPage() {
  return (
    // The Suspense boundary is required because ContactClient uses useSearchParams
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactClient />
    </Suspense>
  );
}
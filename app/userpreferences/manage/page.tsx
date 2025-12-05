import React from 'react';
import Link from 'next/link';
import { verifyMagicToken } from '../actions';
import PreferencesForm from './PreferencesForm';
import ClientSettings from './ClientSettings';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ForceLightMode from '../../components/ForceLightMode'; // Import the helper

export default async function ManagePreferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const token = typeof resolvedParams.token === 'string' ? resolvedParams.token : '';
  const auth = await verifyMagicToken(token);

  if (!auth.valid || !auth.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Force Light Mode for Error State */}
        <ForceLightMode />
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4 border border-gray-100">
            <h1 className="font-montserrat font-bold text-xl text-red-500 mb-4">Link Expired or Invalid</h1>
            <p className="text-gray-600 mb-6">For security reasons, access links expire after 1 hour. Please request a new one.</p>
            <Link href="/userpreferences" className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">Return to Login</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Force Light Mode for Success State */}
      <ForceLightMode />
      <Header />
      <div className="flex-grow container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="font-montserrat font-bold text-3xl mb-2 text-gray-900">Preferences</h1>
        
        {/* UPDATED: Email is now wrapped in a bold, colored span */}
        <p className="text-gray-500 font-raleway mb-10">
          Manage settings for <span className="font-bold text-[var(--color-footer-bg)]">{auth.email}</span>
        </p>
        
        <div className="space-y-8">
           <PreferencesForm email={auth.email} token={token} />
           <ClientSettings />
        </div>
      </div>
      <Footer />
    </div>
  );
}
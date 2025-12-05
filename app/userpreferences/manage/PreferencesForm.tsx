'use client';

import React, { useState } from 'react';
import { updatePreferences } from '../actions'; // Adjusted import based on file structure

export default function PreferencesForm({ email, token }: { email: string, token: string }) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Default state could potentially be fetched from DB later. 
  // For now, we assume 'opted-in' or neutral until they change it.
  const [formData, setFormData] = useState({
    marketing: true,
    jobs: true,
    deleteData: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.deleteData && !confirm("Are you sure? This will permanently remove your CV and profile from our systems.")) {
      return;
    }

    setLoading(true);
    const result = await updatePreferences(token, formData);
    setLoading(false);
    
    if (result.success) {
      setSuccessMsg(result.message);
      // Optional: Redirect home after a delay if deleted
      if (formData.deleteData) {
        setTimeout(() => window.location.href = '/', 3000);
      }
    } else {
      alert(result.message);
    }
  };

  return (
    // Forced Light Mode: bg-white, text-black/gray-800, fix-pixelation
    <div className="bg-white text-black p-8 rounded-2xl shadow-sm border border-gray-100 fix-pixelation">
      <h2 className="font-montserrat font-bold text-xl mb-6 flex items-center gap-2 text-gray-900">
        <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
        Account & Data
      </h2>

      {successMsg ? (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center font-bold">
          <p>{successMsg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Toggles */}
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition cursor-pointer bg-white">
              <div>
                <span className="block font-bold text-gray-800 text-sm">Marketing Updates</span>
                <span className="block text-xs text-gray-500">Receive news, newsletters, and general updates.</span>
              </div>
              <input 
                type="checkbox" 
                checked={formData.marketing}
                onChange={(e) => setFormData({...formData, marketing: e.target.checked})}
                className="w-5 h-5 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)] border-gray-300 bg-white" 
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition cursor-pointer bg-white">
              <div>
                <span className="block font-bold text-gray-800 text-sm">Job Opportunities</span>
                <span className="block text-xs text-gray-500">Allow us to contact you about roles that fit your profile.</span>
              </div>
              <input 
                type="checkbox" 
                checked={formData.jobs}
                onChange={(e) => setFormData({...formData, jobs: e.target.checked})}
                className="w-5 h-5 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)] border-gray-300 bg-white" 
              />
            </label>
          </div>

          <hr className="border-gray-100" />

          {/* Danger Zone */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wider">Danger Zone</h3>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.deleteData}
                onChange={(e) => setFormData({...formData, deleteData: e.target.checked})}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 bg-white" 
              />
              <span className="text-sm text-gray-700">Request complete data deletion (Right to be Forgotten)</span>
            </label>
            {formData.deleteData && (
               <p className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded">
                 Warning: This action triggers a manual removal request. We will purge your CV, contact details, and application history. This cannot be undone.
               </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold font-montserrat transition-all text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
              ${formData.deleteData 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] shadow-blue-200'}`}
          >
            {loading ? 'Processing...' : (formData.deleteData ? 'Confirm Deletion Request' : 'Save Preferences')}
          </button>
        </form>
      )}
    </div>
  );
}
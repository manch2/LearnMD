import React, { useState, useEffect } from 'react';
import { useLearnMD } from '@learnmd/core';
import { MainLayout, Header } from '../layouts/MainLayout';
import { Link } from 'react-router-dom';

export function ProfileViewer() {
  const { storage } = useLearnMD();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const p = await storage.getUserProfile() || { id: '1', name: '', email: '', totalPoints: 0, badges: [], coursesProgress: {}, streak: { current: 0, longest: 0, lastActiveDate: '' }, achievements: [], createdAt: Date.now(), updatedAt: Date.now() };
      setName(p.name || '');
      setEmail(p.email || '');
    }
    loadProfile();
  }, [storage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const p = await storage.getUserProfile() || { id: '1', name: '', email: '', totalPoints: 0, badges: [], coursesProgress: {}, streak: { current: 0, longest: 0, lastActiveDate: '' }, achievements: [], createdAt: Date.now(), updatedAt: Date.now() };
    await storage.saveUserProfile({ ...p, name, email });
    
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <MainLayout>
      <Header 
        title="User Profile" 
        actions={
          <Link to="/" className="text-sm font-medium hover:text-emerald-500">
            &laquo; Back to Catalog
          </Link>
        }
      />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
              {name ? name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Your Account</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Update your basic information</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                placeholder="john@example.com"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className={`text-sm font-medium text-emerald-600 transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}>
                ✅ Profile saved successfully!
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

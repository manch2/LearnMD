import React, { useState, useEffect } from 'react';
import { useLearnMD, getTranslatedString, createDefaultUserProfile } from '@learnmd/core';
import { MainLayout, Header } from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
import type { UserProfile, CourseProgress } from '@learnmd/core';
import { useI18n } from '../hooks/useI18n';
import { PluginSlot } from './PluginSlot';

export function ProfileViewer() {
  const { storage } = useLearnMD();
  const { translate, currentLanguage } = useI18n();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progressData, setProgressData] = useState<Record<string, CourseProgress>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      const p = (await storage.getUserProfile()) || createDefaultUserProfile();
      setProfile(p as UserProfile);
      setName(p.name || '');
      setEmail(p.email || '');

      const allProgress = await storage.getAllCourseProgress();
      setProgressData(allProgress);
    }
    loadData();
  }, [storage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    
    const updated = { ...profile, name, email };
    await storage.saveUserProfile(updated);
    setProfile(updated);
    
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-left">
      <Link to="/" className="inline-block mb-6 text-sm font-medium text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--color-primary-500))] transition-colors">{translate('profile.back')}</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[rgb(var(--bg-secondary))] p-8 rounded-xl shadow-sm border border-[rgb(var(--border-color))] h-fit">
          <div className="flex items-center gap-4 mb-8 border-b border-[rgb(var(--border-color))] pb-6">
            <div className="w-16 h-16 rounded-full bg-[rgb(var(--color-primary-100))] dark:bg-[rgb(var(--color-primary-900))] flex items-center justify-center text-[rgb(var(--color-primary-600))] dark:text-[rgb(var(--color-primary-400))] text-2xl font-bold">
              {name ? name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">{translate('profile.account')}</h1>
              <p className="text-[rgb(var(--text-secondary))] text-sm">{translate('profile.update_info')}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-2">
                {translate('profile.full_name')}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-color))] text-[rgb(var(--text-primary))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] outline-none transition-shadow"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--text-primary))] mb-2">
                {translate('profile.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-color))] text-[rgb(var(--text-primary))] rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] outline-none transition-shadow"
                placeholder="john@example.com"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className={`text-sm font-medium text-[rgb(var(--color-primary-500))] transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}>
                {translate('profile.saved')}
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-[rgb(var(--color-primary-500))] hover:bg-[rgb(var(--color-primary-600))] text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50"
              >
                {isSaving ? translate('profile.saving') : translate('profile.save')}
              </button>
            </div>
          </form>
        </div>

        {/* Metrics & History Section */}
        <div className="space-y-8">
          <div className="bg-[rgb(var(--bg-secondary))] p-8 rounded-xl shadow-sm border border-[rgb(var(--border-color))]">
            <h2 className="text-xl font-bold mb-4 text-[rgb(var(--text-primary))]">{translate('profile.score')}</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-[rgb(var(--color-primary-500))]">{profile?.globalScore || 0}</span>
              <span className="text-sm font-medium text-[rgb(var(--text-secondary))]">{translate('profile.score_public')}</span>
            </div>
            <PluginSlot
              slot="profile:summary"
              slotProps={{ profile, progressData, translate, currentLanguage }}
              className="mt-4"
            />
          </div>

          <div className="bg-[rgb(var(--bg-secondary))] p-8 rounded-xl shadow-sm border border-[rgb(var(--border-color))]">
            <h2 className="text-xl font-bold mb-4 text-[rgb(var(--text-primary))]">{translate('profile.history')}</h2>
            <div className="space-y-6">
              {Object.keys(progressData || {}).length > 0 ? (
                Object.entries(progressData).map(([courseId, progress]) => {
                  const isCompleted = !!progress.completedAt;
                  return (
                    <div key={courseId} className="border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-primary))] p-4 rounded-lg mb-4 last:mb-0">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-[rgb(var(--text-primary))]">{courseId}</span>
                        {!isCompleted ? (
                          <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full font-semibold tracking-wide uppercase">{translate('profile.in_progress') || 'In Progress'}</span>
                        ) : (
                          <span className="text-xs px-2.5 py-1 bg-[rgb(var(--color-primary-100))] text-[rgb(var(--color-primary-800))] dark:bg-[rgb(var(--color-primary-900))/50 dark:text-[rgb(var(--color-primary-300))] rounded-full font-semibold tracking-wide uppercase">{translate('profile.completed') || 'Completed'}</span>
                        )}
                      </div>
                      <div className="mb-4">
                        <div className="h-2 w-full bg-[rgb(var(--bg-tertiary))] rounded-full overflow-hidden">
                           <div className="h-full bg-[rgb(var(--color-primary-500))] transition-all duration-500" style={{ width: `${Math.min(100, Math.max(10, (progress as any).progressPercentage || (progress.completedAt ? 100 : (progress.completedLessons.length * 20))))}%` }} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[rgb(var(--text-secondary))]">{translate('profile.points')}: {progress.totalPoints || 0}</span>
                        <PluginSlot
                          slot="profile:courseActions"
                          slotProps={{ profile, courseId, progress, translate, currentLanguage }}
                          className="contents"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[rgb(var(--text-secondary))] text-sm">{translate('profile.no_progress')}</p>
              )}
            </div>
          </div>

          <div className="bg-[rgb(var(--bg-secondary))] p-8 rounded-xl shadow-sm border border-[rgb(var(--border-color))]">
            <h2 className="text-xl font-bold mb-4 text-[rgb(var(--text-primary))]">{translate('profile.badges')}</h2>
            {profile?.badges && profile.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-72 overflow-y-auto pr-2">
                {profile.badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center p-4 bg-[rgb(var(--bg-primary))] rounded-lg text-center border border-[rgb(var(--border-color))]">
                    <span className="text-3xl mb-2">{badge.icon || '🏆'}</span>
                    <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">{getTranslatedString(badge.name as Record<string, string>, currentLanguage || 'en')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[rgb(var(--text-secondary))] text-sm">{translate('profile.no_badges')}</p>
            )}
          </div>

          <PluginSlot
            slot="profile:sections"
            slotProps={{ profile, progressData, translate, currentLanguage }}
            className="space-y-8"
          />
        </div>
      </div>
    </div>
  );
}

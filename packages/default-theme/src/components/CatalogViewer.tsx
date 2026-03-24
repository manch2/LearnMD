import React, { useState, useMemo } from 'react';
import { useLearnMD } from '@learnmd/core';
import { MainLayout, Header } from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import { Callout } from './Callout';
import { Quiz } from './Quiz';
import { VideoEmbed } from './VideoEmbed';
import { Progress } from './Progress';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Paragraph } from './Paragraph';
import { useI18n } from '../hooks/useI18n';

const components = {
  Callout,
  Quiz,
  VideoEmbed,
  Progress,
  LanguageSwitcher,
  Paragraph,
};

export interface CatalogViewerProps {
  courses: Array<{ courseSlug: string; slug: string; frontmatter: Record<string, unknown> }>;
  HomeComponent?: React.ComponentType;
}

export function CatalogViewer({ courses, HomeComponent }: CatalogViewerProps) {
  const { translate } = useI18n();

  // Group lessons by courseSlug
  const courseMap = new Map<string, { id: string; title: string; totalLessons: number; difficulty?: string; duration?: string; category?: string; frontmatter: any }>();
  courses.forEach(lesson => {
    if (!courseMap.has(lesson.courseSlug)) {
      courseMap.set(lesson.courseSlug, {
        id: lesson.courseSlug,
        title: lesson.courseSlug.replace(/-/g, ' ').toUpperCase(),
        totalLessons: 0,
        difficulty: lesson.frontmatter.difficulty as string | undefined,
        duration: lesson.frontmatter.duration as string | undefined,
        category: lesson.frontmatter.category as string | undefined,
        frontmatter: lesson.frontmatter
      });
    }
    const course = courseMap.get(lesson.courseSlug);
    if (course) {
      course.totalLessons += 1;
    }
  });

  const uniqueCourses = Array.from(courseMap.values());

  const categories = useMemo(() => Array.from(new Set(uniqueCourses.map(c => c.category).filter(Boolean))) as string[], [uniqueCourses]);
  const difficulties = useMemo(() => Array.from(new Set(uniqueCourses.map(c => c.difficulty).filter(Boolean))) as string[], [uniqueCourses]);
  const durations = useMemo(() => Array.from(new Set(uniqueCourses.map(c => c.duration).filter(Boolean))) as string[], [uniqueCourses]);

  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [filterDuration, setFilterDuration] = useState<string>('');

  const filteredCourses = useMemo(() => {
    return uniqueCourses.filter(course => {
      if (filterCategory && course.category !== filterCategory) return false;
      if (filterDifficulty && course.difficulty !== filterDifficulty) return false;
      if (filterDuration && course.duration !== filterDuration) return false;
      return true;
    });
  }, [uniqueCourses, filterCategory, filterDifficulty, filterDuration]);

  return (
    <MainLayout>
      <Header 
        title={translate('catalog.title')} 
      />
      {HomeComponent ? (
        <div className="hero bg-gradient-to-b from-[rgb(var(--color-primary-50))] to-transparent dark:from-[rgb(var(--color-primary-900))/20 dark:to-transparent border-b border-[rgb(var(--border-color))] py-12 md:py-20 mb-8 md:mb-12">
          <div className="container mx-auto px-4 max-w-4xl text-center prose dark:prose-invert prose-lg">
            <MDXProvider components={components}>
              <HomeComponent />
            </MDXProvider>
          </div>
        </div>
      ) : (
        <div className="hero bg-gradient-to-b from-[rgb(var(--color-primary-50))] to-transparent dark:from-[rgb(var(--color-primary-900))/20 dark:to-transparent border-b border-[rgb(var(--border-color))] py-12 md:py-20 mb-8 md:mb-12 text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--text-primary))] mb-4 tracking-tight">
              {translate('catalog.title') || 'Course Catalog'}
            </h1>
            <p className="text-lg md:text-xl text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
              {translate('catalog.hero_subtitle') || 'Ready to learn? Choose from our interactive courses below and start your journey.'}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-16 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))]">{translate('catalog.available')}</h1>
          
          <div className="flex flex-wrap gap-2 text-sm">
            {categories.length > 0 && (
              <select 
                value={filterCategory} 
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-[rgb(var(--text-primary))]"
              >
                <option value="">{translate('catalog.filter_all_categories') || 'All Categories'}</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            
            {difficulties.length > 0 && (
              <select 
                value={filterDifficulty} 
                onChange={e => setFilterDifficulty(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-[rgb(var(--text-primary))]"
              >
                <option value="">{translate('catalog.filter_all_difficulties') || 'All Difficulties'}</option>
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}

            {durations.length > 0 && (
              <select 
                value={filterDuration} 
                onChange={e => setFilterDuration(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500 text-[rgb(var(--text-primary))]"
              >
                <option value="">{translate('catalog.filter_all_durations') || 'All Durations'}</option>
                {durations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
          </div>
        </div>

...
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {translate('catalog.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Link 
                key={course.id} 
                to={`/courses/${course.id}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-[rgb(var(--color-primary-500))] transition-all group flex flex-col h-full items-start"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-[rgb(var(--color-primary-500))] transition-colors text-left text-[rgb(var(--text-primary))]">
                  {course.title}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.category && <span className="text-xs px-2 py-0.5 bg-[rgb(var(--color-primary-100))] text-[rgb(var(--color-primary-800))] dark:bg-[rgb(var(--color-primary-900))/50 dark:text-[rgb(var(--color-primary-300))] rounded-full font-medium">{course.category}</span>}
                  {course.difficulty && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded-full font-medium">{course.difficulty}</span>}
                  {course.duration && <span className="text-xs flex items-center text-gray-500 dark:text-gray-400 font-medium">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {course.duration}
                  </span>}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1 text-left">
                  {course.totalLessons} {translate('catalog.lessons_inside')}
                </p>

                <div className="text-[rgb(var(--color-primary-600))] dark:text-[rgb(var(--color-primary-400))] text-sm font-medium flex items-center mt-auto w-full">
                  {translate('course.start')}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

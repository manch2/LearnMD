import React, { useMemo, useEffect, useState } from 'react';
import { ThemeProvider } from '../hooks';
import { CourseLayout } from '../layouts';
// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import { Callout } from './Callout';
import { Quiz } from './Quiz';
import { VideoEmbed } from './VideoEmbed';
import { Progress } from './Progress';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Paragraph } from './Paragraph';
import { Title } from './Title';
import { getTranslatedString, Course, useLearnMD } from '@learnmd/core';
import { CourseOverview } from './CourseOverview';
import { useI18n } from '../hooks/useI18n';
import { defaultMDXComponents } from './mdx';

import { useParams, useNavigate } from 'react-router-dom';

export interface CourseViewerProps {
  allLessons: Array<{ courseSlug: string; slug: string; Component: React.ComponentType; frontmatter: Record<string, unknown> }>;
  coursesConfig?: Record<string, Course>;
}

export function CourseViewer({ allLessons, coursesConfig = {} }: CourseViewerProps) {
  const { courseId, '*': pathLessonSlug } = useParams();
  const navigate = useNavigate();
  const { storage, completeLesson } = useLearnMD() as any;
  const { currentLanguage, translate } = useI18n();

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [courseProgress, setCourseProgress] = useState<number>(0);
  
  const courseLessons = useMemo(() => allLessons.filter(l => l.courseSlug === courseId), [allLessons, courseId]);
  
  // If no specific lesson slug is provided, we are at the course root -> show overview
  const isOverview = !pathLessonSlug;
  const currentSlug = pathLessonSlug || '';
  
  const currentLesson = courseLessons.find(l => l.slug === currentSlug);
  const Component = currentLesson?.Component;
  
  const currentIndex = courseLessons.findIndex(l => l.slug === currentSlug);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;
  
  useEffect(() => {
    if (!courseId) return;
    storage.getCourseProgress(courseId).then((progress: any) => {
      if (progress) {
        setCompletedLessons(progress.completedLessons || []);
        const pct = courseLessons.length > 0 ? ((progress.completedLessons?.length || 0) / courseLessons.length) * 100 : 0;
        setCourseProgress(Math.min(100, Math.round(pct)));
      }
    });
  }, [courseId, currentSlug, storage, courseLessons.length]);

  const handleNavigate = (slug: string) => {
    navigate(`/courses/${courseId}/${slug}`);
  };

  const handleCompleteAndNext = async () => {
    if (courseId && currentSlug) {
      await completeLesson(courseId, currentSlug, { totalLessons: courseLessons.length });
      
      const progress = await storage.getCourseProgress(courseId);

      if (nextLesson) {
        handleNavigate(nextLesson.slug);
      } else {
        // Force refresh progress if it's the last lesson
        if (progress) {
          setCompletedLessons(progress.completedLessons || []);
          setCourseProgress(100);
        }
        handleNavigate(''); // Go back to overview
      }
    }
  };

  const navigation = [{
    type: 'module' as const,
    id: `module-${courseId}`,
    title: String(courseId).replace(/-/g, ' ').toUpperCase(),
    children: courseLessons.map(l => ({
      type: 'lesson' as const,
      id: l.slug,
      title: getTranslatedString(l.frontmatter?.title as unknown as Record<string, string>, currentLanguage) || l.slug,
      slug: l.slug,
      completed: completedLessons.includes(l.slug)
    }))
  }];

  const courseData = coursesConfig[courseId || ''] || {
    id: courseId || '',
    title: String(courseId).replace(/-/g, ' ').toUpperCase(),
    modules: [],
    lessons: courseLessons.map(l => ({ slug: l.slug, title: getTranslatedString(l.frontmatter?.title as unknown as Record<string, string>, currentLanguage) || l.slug })),
    frontmatter: {},
    basePath: `/courses/${courseId}`
  };

  // Inject props into Quiz to handle completion
  const components = {
    ...defaultMDXComponents,
    Quiz: (props: any) => {
      const isCompleted = completedLessons.includes(currentSlug);
      // We don't have the exact score in completedLessons array, but we can assume 100 or fetch it
      // For now, if the lesson is completed, we pass initialCompleted=true
      return (
        <Quiz 
          {...props} 
          initialCompleted={isCompleted}
          initialScore={100}
          onComplete={async (results: any) => {
            if (props.onComplete) props.onComplete(results);
            if (results.passed && courseId && currentSlug) {
              await completeLesson(courseId, currentSlug, { 
                totalLessons: courseLessons.length, 
                score: results.score, 
                passed: results.passed 
              });
              
              const progress = await storage.getCourseProgress(courseId);
              if (progress) {
                setCompletedLessons(progress.completedLessons || []);
                const pct = courseLessons.length > 0 ? ((progress.completedLessons?.length || 0) / courseLessons.length) * 100 : 0;
                setCourseProgress(Math.min(100, Math.round(pct)));
              }
            }
          }} 
        />
      );
    },
    VideoEmbed,
    Progress: (props: any) => {
      // If the label hints at "Lesson", compute lesson progress. For now we use the core courseProgress.
      return <Progress {...props} value={props.label?.toLowerCase().includes('lesson') ? 100 : courseProgress} />;
    },
    LanguageSwitcher,
    Paragraph,
    Title,
  };

  return (
    <ThemeProvider>
      <CourseLayout
        courseTitle={String(courseId).replace(/-/g, ' ').toUpperCase()}
        navigation={navigation}
        currentLessonSlug={currentSlug}
        completedLessons={completedLessons}
        progress={courseProgress}
        onNavigate={handleNavigate}
      >
        <div className="prose dark:prose-invert prose-lg px-4 sm:px-8 py-6 max-w-3xl mx-auto pb-24">
          {isOverview ? (
             <CourseOverview 
               course={courseData} 
               overviewContent={undefined} 
               onStartCourse={() => {
                 const firstUncompleted = courseLessons.find(l => !completedLessons.includes(l.slug));
                 handleNavigate(firstUncompleted?.slug || courseLessons[0]?.slug || '');
               }}
               completedLessons={completedLessons}
               courseProgress={courseProgress}
             />
          ) : Component ? (
            <>
              <MDXProvider components={components}>
                <Component />
              </MDXProvider>
              
              <div className="mt-16 pt-8 border-t border-[rgb(var(--border-color))] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  {prevLesson && (
                    <button 
                      onClick={() => handleNavigate(prevLesson.slug)}
                      className="w-full px-6 py-3 border border-[rgb(var(--border-color))] hover:bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>←</span> {translate('course.previous')}
                    </button>
                  )}
                </div>
                
                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 ml-auto">
                  {!completedLessons.includes(currentSlug) && (
                    <button 
                      onClick={handleCompleteAndNext}
                      className="w-full px-6 py-3 bg-[rgb(var(--color-primary-500))] hover:bg-[rgb(var(--color-primary-600))] text-white font-bold rounded-lg transition-colors shadow-sm"
                    >
                      {nextLesson ? translate('course.mark_complete') : translate('course.finish')}
                    </button>
                  )}
                  {completedLessons.includes(currentSlug) && nextLesson && (
                    <button 
                      onClick={() => handleNavigate(nextLesson.slug)}
                      className="w-full px-6 py-3 bg-[rgb(var(--bg-secondary))] hover:bg-[rgb(var(--border-color))] text-[rgb(var(--text-primary))] font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {translate('course.next')} <span>→</span>
                    </button>
                  )}
                  {completedLessons.includes(currentSlug) && !nextLesson && (
                    <button 
                      onClick={() => handleNavigate('')}
                      className="w-full px-6 py-3 bg-[rgb(var(--bg-secondary))] hover:bg-[rgb(var(--border-color))] text-[rgb(var(--text-primary))] font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {translate('course.return_overview')} <span>→</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <p className="text-lg text-[rgb(var(--text-muted))]">{translate('course.not_found')}</p>
            </div>
          )}
        </div>
      </CourseLayout>
    </ThemeProvider>
  );
}

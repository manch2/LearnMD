import React, { useMemo } from 'react';
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
import { getTranslatedString, Course } from '@learnmd/core';
import { CourseOverview } from './CourseOverview';

import { useParams, useNavigate } from 'react-router-dom';

export interface CourseViewerProps {
  allLessons: Array<{ courseSlug: string; slug: string; Component: React.ComponentType; frontmatter: Record<string, unknown> }>;
  coursesConfig?: Record<string, Course>;
}

const components = {
  Callout,
  Quiz,
  VideoEmbed,
  Progress,
  LanguageSwitcher,
  Paragraph,
};

export function CourseViewer({ allLessons, coursesConfig = {} }: CourseViewerProps) {
  const { courseId, '*': pathLessonSlug } = useParams();
  const navigate = useNavigate();
  
  const courseLessons = useMemo(() => allLessons.filter(l => l.courseSlug === courseId), [allLessons, courseId]);
  
  // If no specific lesson slug is provided, we are at the course root -> show overview
  const isOverview = !pathLessonSlug;
  const currentSlug = pathLessonSlug || '';
  
  const currentLesson = courseLessons.find(l => l.slug === currentSlug);
  const Component = currentLesson?.Component;
  
  const navigation = [{
    type: 'module' as const,
    id: `module-${courseId}`,
    title: String(courseId).replace(/-/g, ' ').toUpperCase(),
    children: courseLessons.map(l => ({
      type: 'lesson' as const,
      id: l.slug,
      title: getTranslatedString(l.frontmatter?.title as any, 'en') || l.slug,
      slug: l.slug,
    }))
  }];

  const handleNavigate = (slug: string) => {
    navigate(`/courses/${courseId}/${slug}`);
  };

  const courseData = coursesConfig[courseId || ''] || {
    id: courseId || '',
    title: String(courseId).replace(/-/g, ' ').toUpperCase(),
    modules: [],
    lessons: courseLessons.map(l => ({ slug: l.slug, title: getTranslatedString(l.frontmatter?.title as any, 'en') || l.slug }) as any),
    frontmatter: {},
    basePath: `/courses/${courseId}`
  };

  return (
    <ThemeProvider>
      <CourseLayout
        courseTitle={String(courseId).replace(/-/g, ' ').toUpperCase()}
        navigation={navigation}
        currentLessonSlug={currentSlug}
        completedLessons={[]}
        progress={0}
        onNavigate={handleNavigate}
      >
        <div className="prose px-8 py-4 max-w-4xl mx-auto">
          {isOverview ? (
             <CourseOverview 
               course={courseData} 
               overviewContent={undefined} 
               onStartCourse={() => handleNavigate(courseLessons[0]?.slug || '')} 
             />
          ) : Component ? (
            <MDXProvider components={components}>
              <Component />
            </MDXProvider>
          ) : (
            <div className="text-center p-8">
              <p className="text-lg text-[rgb(var(--text-muted))]">Lesson not found.</p>
            </div>
          )}
        </div>
      </CourseLayout>
    </ThemeProvider>
  );
}

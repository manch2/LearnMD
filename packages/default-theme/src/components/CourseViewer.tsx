import React, { useState } from 'react';
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
import { getTranslatedString } from '@learnmd/core';

import { useParams, useNavigate } from 'react-router-dom';

export interface CourseViewerProps {
  allLessons: Array<{ courseSlug: string; slug: string; Component: React.ComponentType; frontmatter: any }>;
}

const components = {
  Callout,
  Quiz,
  VideoEmbed,
  Progress,
  LanguageSwitcher,
  Paragraph,
};

export function CourseViewer({ allLessons }: CourseViewerProps) {
  const { courseId, '*': pathLessonSlug } = useParams();
  const navigate = useNavigate();
  
  const courseLessons = allLessons.filter(l => l.courseSlug === courseId);
  const currentSlug = pathLessonSlug || courseLessons[0]?.slug;
  const currentLesson = courseLessons.find(l => l.slug === currentSlug) || courseLessons[0];
  const Component = currentLesson?.Component;
  
  const navigation = [{
    type: 'module' as const,
    id: `module-${courseId}`,
    title: String(courseId).replace(/-/g, ' ').toUpperCase(),
    children: courseLessons.map(l => ({
      type: 'lesson' as const,
      id: l.slug,
      title: getTranslatedString(l.frontmatter?.title, 'en') || l.slug,
      slug: l.slug,
    }))
  }];

  const handleNavigate = (slug: string) => {
    navigate(`/courses/${courseId}/${slug}`);
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
        <div className="prose px-8 py-4">
          {Component ? (
            <MDXProvider components={components}>
              <Component />
            </MDXProvider>
          ) : (
            <div className="text-center p-8">
              <p className="text-lg text-[rgb(var(--text-muted))]">Add markdown lessons in the \`lessons/\` folder to get started.</p>
            </div>
          )}
        </div>
      </CourseLayout>
    </ThemeProvider>
  );
}

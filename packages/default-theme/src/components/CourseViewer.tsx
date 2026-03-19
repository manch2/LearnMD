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

export interface CourseViewerProps {
  lessons: Array<{ slug: string; Component: React.ComponentType; frontmatter: any }>;
}

const components = {
  Callout,
  Quiz,
  VideoEmbed,
  Progress,
  LanguageSwitcher,
  Paragraph,
};

export function CourseViewer({ lessons }: CourseViewerProps) {
  const [currentSlug, setCurrentSlug] = useState(lessons[0]?.slug);
  
  const navigation = [{
    type: 'module' as const,
    id: 'module-default',
    title: 'Course Lessons',
    children: lessons.map(l => ({
      type: 'lesson' as const,
      id: l.slug,
      title: getTranslatedString(l.frontmatter?.title, 'en') || l.slug,
      slug: l.slug,
    }))
  }];

  const currentLesson = lessons.find(l => l.slug === currentSlug) || lessons[0];
  const Component = currentLesson?.Component;

  return (
    <ThemeProvider>
      <CourseLayout
        courseTitle="Interactive Course"
        navigation={navigation}
        currentLessonSlug={currentSlug}
        completedLessons={[]}
        progress={0}
        onNavigate={(slug) => setCurrentSlug(slug)}
      >
        <div className="markdown-body px-8 py-4">
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

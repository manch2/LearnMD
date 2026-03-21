import React from 'react';
import type { Course } from '@learnmd/core';
import { useI18n } from '../hooks';

import { Link } from 'react-router-dom';

export interface CourseOverviewProps {
  course: Course;
  overviewContent?: React.ReactNode;
  onStartCourse?: () => void;
  completedLessons?: string[];
  courseProgress?: number;
}

export function CourseOverview({ course, overviewContent, onStartCourse, completedLessons = [], courseProgress = 0 }: CourseOverviewProps) {
  const { currentLanguage } = useI18n();

  const title = typeof course.title === 'string' 
    ? course.title 
    : course.title[currentLanguage] || Object.values(course.title)[0];

  const description = course.description 
    ? (typeof course.description === 'string' ? course.description : course.description[currentLanguage] || Object.values(course.description)[0])
    : null;

  return (
    <div className="course-overview container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-8 border-b border-[rgb(var(--border-color))] pb-8">
        <h1 className="text-4xl font-bold mb-4 text-[rgb(var(--text-primary))]">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-[rgb(var(--text-secondary))] mb-6">
            {description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm mb-6">
          {course.difficulty && (
            <span className="px-3 py-1 bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))] rounded-full">
              Difficulty: <span className="font-semibold capitalize">{course.difficulty}</span>
            </span>
          )}
          {course.estimatedTime && (
            <span className="px-3 py-1 bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))] rounded-full">
              Time: <span className="font-semibold">{course.estimatedTime}</span>
            </span>
          )}
        </div>

        {onStartCourse && (
          <button 
            onClick={onStartCourse}
            className="px-6 py-3 bg-[rgb(var(--color-primary-500))] hover:bg-[rgb(var(--color-primary-600))] text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            {completedLessons.length > 0 ? (completedLessons.length >= (course.lessons?.length || 0) ? 'Review Course' : 'Continue Course') : 'Start Course'}
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {overviewContent && (
            <div className="prose dark:prose-invert max-w-none mb-8 text-[rgb(var(--text-primary))]">
              {overviewContent}
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-4 text-[rgb(var(--text-primary))]">Syllabus</h2>
          <div className="space-y-4">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, idx) => {
                const lessonTitle = typeof lesson === 'string' 
                  ? lesson 
                  : (typeof lesson.frontmatter.title === 'string' ? lesson.frontmatter.title : 'Lesson');
                const slug = typeof lesson === 'string' ? lesson : lesson.slug;
                
                const isCompleted = completedLessons.includes(slug);
                return (
                  <div key={idx} className="p-4 border border-[rgb(var(--border-color))] rounded-lg hover:border-[rgb(var(--color-primary-500))] transition-colors bg-[rgb(var(--bg-secondary))] flex justify-between items-center">
                    <Link to={`${course.basePath}/${slug}`} className="text-lg font-medium text-[rgb(var(--text-primary))] hover:text-[rgb(var(--color-primary-500))] transition-colors block">
                      <span className="text-[rgb(var(--text-secondary))] mr-2">{idx + 1}.</span> {lessonTitle}
                    </Link>
                    {isCompleted && (
                       <span className="text-sm text-emerald-500 font-semibold flex items-center gap-1">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Completed
                       </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-[rgb(var(--text-secondary))]">No lessons available yet.</p>
            )}
          </div>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="bg-[rgb(var(--bg-secondary))] p-6 rounded-lg border border-[rgb(var(--border-color))]">
              <h3 className="font-bold mb-3 text-[rgb(var(--text-primary))]">Prerequisites</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-[rgb(var(--text-secondary))]">
                {course.prerequisites.map((prereq, i) => (
                  <li key={i}>{prereq}</li>
                ))}
              </ul>
            </div>
          )}
          
          {course.expectedSkills && course.expectedSkills.length > 0 && (
            <div className="bg-[rgb(var(--bg-secondary))] p-6 rounded-lg border border-[rgb(var(--border-color))]">
              <h3 className="font-bold mb-3 text-[rgb(var(--text-primary))]">What You&apos;ll Learn</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-[rgb(var(--text-secondary))]">
                {course.expectedSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
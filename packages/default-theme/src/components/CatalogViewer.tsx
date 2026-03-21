import React from 'react';
import { MainLayout, Header } from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';

export interface CatalogViewerProps {
  courses: Array<{ courseSlug: string; slug: string; frontmatter: Record<string, unknown> }>;
  HomeComponent?: React.ComponentType;
}

export function CatalogViewer({ courses, HomeComponent }: CatalogViewerProps) {
  // Remove unused storage


  // Group lessons by courseSlug
  const courseMap = new Map<string, { id: string; title: string; totalLessons: number }>();
  courses.forEach(lesson => {
    if (!courseMap.has(lesson.courseSlug)) {
      courseMap.set(lesson.courseSlug, {
        id: lesson.courseSlug,
        title: lesson.courseSlug.replace(/-/g, ' ').toUpperCase(),
        totalLessons: 0,
      });
    }
    const course = courseMap.get(lesson.courseSlug);
    if (course) {
      course.totalLessons += 1;
    }
  });

  const uniqueCourses = Array.from(courseMap.values());

  return (
    <MainLayout>
      <Header 
        title="Course Catalog" 
        actions={
          <Link to="/profile" className="text-sm font-medium hover:text-emerald-500">
            Profile
          </Link>
        }
      />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {HomeComponent && (
          <div className="prose dark:prose-invert max-w-none mb-12">
            <MDXProvider>
              <HomeComponent />
            </MDXProvider>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
        
        {uniqueCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No courses available yet. Add some courses in the &apos;courses/&apos; folder!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueCourses.map(course => (
              <Link 
                key={course.id} 
                to={`/courses/${course.id}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-emerald-500 transition-all group"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-500 transition-colors">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {course.totalLessons} lessons inside
                </p>
                <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center">
                  Start Course
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

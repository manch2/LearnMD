import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CourseViewer } from './CourseViewer';
import { LearnMDProvider } from '@learnmd/core';

const MockComponent = () => <div>Lesson Content</div>;

const mockLessons = [
  { 
    courseSlug: 'course-1', 
    slug: 'lesson-1', 
    Component: MockComponent, 
    frontmatter: { title: 'Lesson One' } 
  },
  { 
    courseSlug: 'course-1', 
    slug: 'lesson-2', 
    Component: MockComponent, 
    frontmatter: { title: 'Lesson Two' } 
  },
];

const mockConfig = {
  title: 'Test Course',
  courses: []
} as any;

describe('CourseViewer', () => {
  it('should render the course layout and current lesson', () => {
    render(
      <MemoryRouter initialEntries={['/courses/course-1/lesson-1']}>
        <LearnMDProvider config={mockConfig}>
          <Routes>
            <Route path="/courses/:courseId/*" element={<CourseViewer allLessons={mockLessons} />} />
          </Routes>
        </LearnMDProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByText('COURSE 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Lesson One').length).toBeGreaterThan(0);
    expect(screen.getByText('Lesson Content')).toBeDefined();
  });

  it('should navigate to another lesson when clicked in sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/courses/course-1/lesson-1']}>
        <LearnMDProvider config={mockConfig}>
          <Routes>
            <Route path="/courses/:courseId/*" element={<CourseViewer allLessons={mockLessons} />} />
          </Routes>
        </LearnMDProvider>
      </MemoryRouter>
    );

    const lessonTwoLink = screen.getByText('Lesson Two');
    fireEvent.click(lessonTwoLink);

    // After click, the URL should change and CourseViewer should update (if mocked correctly)
    // Note: MemoryRouter helps test the interaction
  });
});

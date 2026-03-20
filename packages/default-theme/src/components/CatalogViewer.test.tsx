import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CatalogViewer } from './CatalogViewer';
import { LearnMDProvider } from '@learnmd/core';

const mockCourses = [
  { courseSlug: 'course-1', slug: 'lesson-1', frontmatter: { title: 'L1' } },
  { courseSlug: 'course-1', slug: 'lesson-2', frontmatter: { title: 'L2' } },
  { courseSlug: 'course-2', slug: 'lesson-3', frontmatter: { title: 'L3' } },
];

const mockConfig = {
  title: 'Test Catalog',
  courses: []
} as any;

describe('CatalogViewer', () => {
  it('should render a list of unique courses', () => {
    render(
      <BrowserRouter>
        <LearnMDProvider config={mockConfig}>
          <CatalogViewer courses={mockCourses} />
        </LearnMDProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('COURSE 1')).toBeDefined();
    expect(screen.getByText('COURSE 2')).toBeDefined();
    expect(screen.getByText('2 lessons inside')).toBeDefined();
    expect(screen.getByText('1 lessons inside')).toBeDefined();
  });

  it('should show empty state when no courses are provided', () => {
    render(
      <BrowserRouter>
        <LearnMDProvider config={mockConfig}>
          <CatalogViewer courses={[]} />
        </LearnMDProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/No courses available yet/i)).toBeDefined();
  });
});

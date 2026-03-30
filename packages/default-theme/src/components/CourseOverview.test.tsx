import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CourseOverview } from './CourseOverview';

vi.mock('../hooks', () => ({
  useI18n: () => ({
    currentLanguage: 'en',
    translate: (key: string) => key,
  }),
}));

describe('CourseOverview', () => {
  it('renders the course summary and starts the course', () => {
    const onStartCourse = vi.fn();
    render(
      <MemoryRouter>
        <CourseOverview
          course={{
            id: 'architecture',
            title: { en: 'Architecture', es: 'Arquitectura' },
            description: { en: 'Learn the architecture', es: 'Aprende la arquitectura' },
            lessons: ['intro', 'storage'],
            modules: [],
            frontmatter: { title: 'Architecture' },
            basePath: '/courses/architecture',
            author: 'LearnMD Team',
            lastUpdated: '2026-03-30',
            difficulty: 'advanced',
            estimatedTime: '1h',
            prerequisites: ['CLI basics'],
            expectedSkills: ['Plugin slots'],
          }}
          overviewContent={<p>Overview body</p>}
          completedLessons={['intro']}
          onStartCourse={onStartCourse}
          courseProgress={50}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getByText('Overview body')).toBeInTheDocument();
    expect(screen.getByText('CLI basics')).toBeInTheDocument();
    expect(screen.getByText('Plugin slots')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(onStartCourse).toHaveBeenCalled();
  });
});

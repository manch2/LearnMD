import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileViewer } from './ProfileViewer';

const storage = {
  getUserProfile: vi.fn(async () => ({
    id: 'user-1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    globalScore: 320,
    totalPoints: 320,
    badges: [
      {
        id: 'fast-start',
        name: { en: 'Fast Start', es: 'Inicio rápido' },
        description: { en: 'Start', es: 'Inicio' },
        icon: '🚀',
        earnedAt: Date.now(),
      },
    ],
    achievements: [],
    coursesProgress: {},
    streak: { current: 0, longest: 0, lastActiveDate: '' },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })),
  saveUserProfile: vi.fn(async (profile) => profile),
  getAllCourseProgress: vi.fn(async () => ({
    architecture: {
      courseId: 'architecture',
      lessons: {},
      completedLessons: ['intro'],
      totalPoints: 120,
      badges: [],
      startedAt: Date.now(),
      lastAccessedAt: Date.now(),
      progressPercentage: 60,
      completedAt: Date.now(),
    },
  })),
};

vi.mock('@learnmd/core', async () => {
  const actual = await vi.importActual<typeof import('@learnmd/core')>('@learnmd/core');
  return {
    ...actual,
    useLearnMD: () => ({ storage }),
  };
});

vi.mock('../hooks/useI18n', () => ({
  useI18n: () => ({
    currentLanguage: 'en',
    translate: (key: string) => key,
  }),
}));

describe('ProfileViewer', () => {
  it('renders profile data, progress history, and saves updates', async () => {
    render(
      <MemoryRouter>
        <ProfileViewer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Ada Lovelace')).toBeInTheDocument();
    });

    expect(screen.getByText('320')).toBeInTheDocument();
    expect(screen.getByText('architecture')).toBeInTheDocument();
    expect(screen.getByText('Fast Start')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('profile.full_name'), {
      target: { value: 'Ada Byron' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'profile.save' }).closest('form')!);

    await waitFor(() => {
      expect(storage.saveUserProfile).toHaveBeenCalled();
    });
  });
});

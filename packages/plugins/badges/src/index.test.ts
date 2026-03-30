import { describe, expect, it, vi } from 'vitest';
import { BadgesPlugin } from './index';
import { HOOKS, type LearnMDStorage, type PluginContext, type UserProfile } from '@learnmd/core';

function createStorage(profile: UserProfile): LearnMDStorage {
  return {
    get: vi.fn(async (key: string) => {
      if (key === 'userProfile') return profile;
      if (key === 'progress:architecture') {
        return {
          courseId: 'architecture',
          lessons: {},
          completedLessons: ['01-monorepo'],
          totalPoints: 200,
          badges: [],
          startedAt: Date.now(),
          lastAccessedAt: Date.now(),
          progressPercentage: 60,
        };
      }
      return null;
    }),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn(async () => ['progress:architecture']),
    getUserProfile: vi.fn(),
    saveUserProfile: vi.fn(),
    getCourseProgress: vi.fn(),
    saveCourseProgress: vi.fn(),
    getAllCourseProgress: vi.fn(),
    getLessonProgress: vi.fn(),
    updateLessonProgress: vi.fn(),
    completeLesson: vi.fn(),
  } as unknown as LearnMDStorage;
}

describe('BadgesPlugin', () => {
  it('awards badges based on global score when progress updates', async () => {
    const profile: UserProfile = {
      id: 'user-1',
      globalScore: 250,
      totalPoints: 250,
      badges: [],
      achievements: [],
      coursesProgress: {},
      streak: { current: 0, longest: 0, lastActiveDate: '' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const storage = createStorage(profile);
    const hooks = new Map<string, (...args: unknown[]) => unknown>();
    const plugin = new BadgesPlugin([
      {
        id: 'score-200',
        name: { en: 'Score Runner', es: 'Racha de Puntos' },
        description: { en: 'Reach 200 points', es: 'Alcanza 200 puntos' },
        icon: '🏁',
        criteria: { type: 'global_score', score: 200 },
      },
    ]);

    const context: PluginContext = {
      course: {
        id: 'architecture',
        title: 'Architecture',
        lessons: [],
        modules: [],
        frontmatter: { title: 'Architecture' },
        basePath: '/courses/architecture',
      },
      storage,
      i18n: {
        currentLanguage: 'en',
        availableLanguages: ['en', 'es'],
        setLanguage: vi.fn(),
        translate: vi.fn((key: string) => key),
        translateObject: vi.fn((value) => value),
      },
      registerComponent: vi.fn(),
      registerHook: vi.fn((hook: string, fn: (...args: unknown[]) => unknown) => hooks.set(hook, fn)),
      config: {},
    };

    plugin.onLoad(context);
    await hooks.get(HOOKS.PROGRESS_UPDATE)?.();

    expect(storage.set).toHaveBeenCalledWith(
      'userProfile',
      expect.objectContaining({
        badges: [
          expect.objectContaining({
            id: 'score-200',
            icon: '🏁',
          }),
        ],
      })
    );
    expect(plugin.getAvailableBadges()).toHaveLength(1);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDefaultUserProfile, LocalStorageAdapter, StorageManager } from './index';
import type { CourseProgress, UserProfile } from '../types';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  let store: Record<string, string>;

  beforeEach(() => {
    adapter = new LocalStorageAdapter('test');
    store = {};
    const mock = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { 
        store[key] = value; 
        (mock as any)[key] = value;
      },
      removeItem: (key: string) => { 
        delete store[key]; 
        delete (mock as any)[key];
      },
      clear: () => { 
        for (const k in store) {
          delete (mock as any)[k];
          delete store[k];
        }
      },
      get length() { return Object.keys(store).length; },
      key: (i: number) => Object.keys(store)[i] || null,
    };
    vi.stubGlobal('localStorage', mock);
  });

  it('should set and get items', async () => {
    await adapter.set('foo', { bar: 123 });
    const result = await adapter.get<{ bar: number }>('foo');
    expect(result?.bar).toBe(123);
  });

  it('should return null for missing items', async () => {
    const result = await adapter.get('missing');
    expect(result).toBeNull();
  });

  it('should remove items', async () => {
    await adapter.set('foo', 'bar');
    await adapter.remove('foo');
    expect(await adapter.get('foo')).toBeNull();
  });

  it('should clear items with prefix', async () => {
    await adapter.set('a', 1);
    localStorage.setItem('other', 'val');
    await adapter.clear();
    expect(await adapter.get('a')).toBeNull();
    expect(localStorage.getItem('other')).toBe('val');
  });

  it('should list only keys that match the prefix', async () => {
    await adapter.set('first', 1);
    await adapter.set('second', 2);
    localStorage.setItem('other:key', 'noop');

    await expect(adapter.keys()).resolves.toEqual(['first', 'second']);
  });

  it('should return null when stored JSON is invalid', async () => {
    store['test:broken'] = '{invalid';

    await expect(adapter.get('broken')).resolves.toBeNull();
  });
});

describe('StorageManager', () => {
  let manager: StorageManager;
  let store: Record<string, string>;

  const createProgress = (courseId: string, overrides: Partial<CourseProgress> = {}): CourseProgress => ({
    courseId,
    lessons: {},
    completedLessons: [],
    totalPoints: 0,
    badges: [],
    startedAt: 1,
    lastAccessedAt: 1,
    ...overrides,
  });

  beforeEach(() => {
    store = {};
    const localStorageMock = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
      get length() {
        return Object.keys(store).length;
      },
      key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    };
    vi.stubGlobal('localStorage', localStorageMock);
    manager = new StorageManager();
  });

  it('should save and get user profile', async () => {
    const profile: UserProfile = {
      id: 'user-1',
      globalScore: 0,
      totalPoints: 0,
      badges: [],
      achievements: [],
      coursesProgress: {},
      streak: { current: 0, longest: 0, lastActiveDate: '' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(profile));
    
    await manager.saveUserProfile(profile);
    expect(localStorage.setItem).toHaveBeenCalledWith(expect.stringContaining('userProfile'), JSON.stringify(profile));
    
    const result = await manager.getUserProfile();
    expect(result).toEqual(profile);
  });

  it('should normalize global score from legacy total points', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify({
        id: 'legacy-user',
        totalPoints: 55,
        badges: [],
        achievements: [],
        coursesProgress: {},
        streak: { current: 0, longest: 0, lastActiveDate: '' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );

    const result = await manager.getUserProfile();
    expect(result?.globalScore).toBe(55);
    expect(result?.totalPoints).toBe(55);
  });

  it('should update lesson progress and total points', async () => {
    const courseId = 'course-1';
    const lessonSlug = 'lesson-1';

    await manager.updateLessonProgress(courseId, lessonSlug, { completed: true, points: 10 });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      expect.stringContaining(`progress:${courseId}`),
      expect.stringContaining('"totalPoints":10')
    );
  });

  it('tracks time spent and exposes lesson progress', async () => {
    await manager.updateLessonProgress('course-1', 'lesson-1', { timeSpent: 15 });
    await manager.trackTimeSpent('course-1', 'lesson-1', 30);

    const lessonProgress = await manager.getLessonProgress('course-1', 'lesson-1');
    expect(lessonProgress?.timeSpent).toBe(45);
    expect(lessonProgress?.completed).toBe(false);
  });

  it('completes lessons and avoids duplicating completed entries', async () => {
    await manager.completeLesson('course-1', 'lesson-1', 90, true, 25);
    await manager.updateLessonProgress('course-1', 'lesson-1', { completed: true });

    const courseProgress = await manager.getCourseProgress('course-1');
    expect(courseProgress?.completedLessons).toEqual(['lesson-1']);
    expect(courseProgress?.lessons['lesson-1']?.quizPassed).toBe(true);
    expect(courseProgress?.totalPoints).toBe(25);
  });

  it('lists, resets, clears, exports, and imports course progress', async () => {
    await manager.saveUserProfile(createDefaultUserProfile({ id: 'user-2', globalScore: 77 }));
    await manager.saveCourseProgress(
      createProgress('course-a', {
        lessons: {
          intro: {
            lessonSlug: 'intro',
            completed: true,
            completedAt: 10,
            timeSpent: 20,
            lastAccessedAt: 10,
          },
        },
        completedLessons: ['intro'],
        totalPoints: 20,
      })
    );
    await manager.saveCourseProgress(createProgress('course-b', { totalPoints: 12 }));

    const allProgress = await manager.getAllCourseProgress();
    expect(Object.keys(allProgress)).toEqual(['course-a', 'course-b']);

    const exported = await manager.exportData();
    expect(exported).toEqual(
      expect.objectContaining({
        userProfile: expect.objectContaining({ id: 'user-2', globalScore: 77 }),
        courseProgress: expect.objectContaining({
          'course-a': expect.objectContaining({ totalPoints: 20 }),
          'course-b': expect.objectContaining({ totalPoints: 12 }),
        }),
      })
    );

    await manager.resetCourseProgress('course-b');
    expect(await manager.getCourseProgress('course-b')).toBeNull();

    await manager.clearAllProgress();
    expect(await manager.getAllCourseProgress()).toEqual({});

    await manager.importData({
      userProfile: createDefaultUserProfile({ id: 'user-imported', totalPoints: 99 }),
      courseProgress: {
        imported: createProgress('ignored', { totalPoints: 33 }),
      },
    });

    expect((await manager.getUserProfile())?.id).toBe('user-imported');
    expect((await manager.getCourseProgress('imported'))?.courseId).toBe('imported');
    expect((await manager.getCourseProgress('imported'))?.totalPoints).toBe(33);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalStorageAdapter, StorageManager } from './index';
import type { UserProfile } from '../types';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    adapter = new LocalStorageAdapter('test');
    
    const store: Record<string, string> = {};
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
});

describe('StorageManager', () => {
  let manager: StorageManager;

  beforeEach(() => {
    manager = new StorageManager();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    });
  });

  it('should save and get user profile', async () => {
    const profile: UserProfile = {
      id: 'user-1',
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

  it('should update lesson progress and total points', async () => {
    const courseId = 'course-1';
    const lessonSlug = 'lesson-1';
    
    // Initial state: no progress
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    
    await manager.updateLessonProgress(courseId, lessonSlug, { completed: true, points: 10 });
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining(`progress:${courseId}`),
        expect.stringContaining('"totalPoints":10')
    );
  });
});

import { openDB, type IDBPDatabase } from 'idb';
import type { StorageAdapter, CourseProgress, UserProfile, LessonProgress } from '../types';

/**
 * LocalStorage adapter for simple key-value storage
 */
export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix = 'learnmd') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(`${this.prefix}:`));
      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  async keys(): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.prefix}:`)) {
        keys.push(key.replace(`${this.prefix}:`, ''));
      }
    }
    return keys;
  }
}

/**
 * IndexedDB adapter for larger data storage (offline content)
 */
export class IndexedDBAdapter implements StorageAdapter {
  private dbName: string;
  private dbVersion: number;
  private db: IDBPDatabase | null = null;

  constructor(dbName = 'learnmd-db', dbVersion = 1) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  private async getDB(): Promise<IDBPDatabase> {
    if (this.db) return this.db;

    this.db = await openDB(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Course content store
        if (!db.objectStoreNames.contains('courses')) {
          db.createObjectStore('courses', { keyPath: 'id' });
        }

        // Cached content store
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }

        // User data store
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'key' });
        }
      },
    });

    return this.db;
  }

  async get<T>(key: string, storeName = 'userData'): Promise<T | null> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const result = await store.get(key);
      return (result as T) || null;
    } catch (error) {
      console.error('Error reading from IndexedDB:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, storeName = 'userData'): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.put({ key, value, updatedAt: Date.now() });
    } catch (error) {
      console.error('Error writing to IndexedDB:', error);
      throw error;
    }
  }

  async remove(key: string, storeName = 'userData'): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.delete(key);
    } catch (error) {
      console.error('Error removing from IndexedDB:', error);
    }
  }

  async clear(storeName = 'userData'): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
  }

  async keys(storeName = 'userData'): Promise<string[]> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const allKeys = await store.getAllKeys();
      return allKeys as string[];
    } catch (error) {
      console.error('Error getting keys from IndexedDB:', error);
      return [];
    }
  }

  /**
   * Cache course content for offline use
   */
  async cacheCourse(courseId: string, content: unknown): Promise<void> {
    await this.set(`course:${courseId}`, content, 'cache');
  }

  /**
   * Get cached course content
   */
  async getCachedCourse(courseId: string): Promise<unknown | null> {
    interface CacheEntry {
      key: string;
      value: unknown;
      updatedAt?: number;
    }
    const cached = await this.get<CacheEntry>(`course:${courseId}`, 'cache');
    return cached?.value ?? null;
  }

  /**
   * Clear cache older than specified milliseconds
   */
  async clearOldCache(maxAge: number): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction('cache', 'readwrite');
      const store = tx.objectStore('cache');
      const allItems = await store.getAll();
      const now = Date.now();

      for (const item of allItems) {
        if (item.updatedAt && now - item.updatedAt > maxAge) {
          await store.delete(item.key);
        }
      }
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
  }
}

/**
 * Combined storage manager using both LocalStorage and IndexedDB
 */
export class StorageManager {
  private readonly localStorage: LocalStorageAdapter;
  private readonly _indexedDB: IndexedDBAdapter;

  constructor() {
    this.localStorage = new LocalStorageAdapter();
    this._indexedDB = new IndexedDBAdapter();
  }

  /**
   * Get the IndexedDB adapter for advanced operations
   */
  get indexedDB(): IndexedDBAdapter {
    return this._indexedDB;
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<UserProfile | null> {
    return this.localStorage.get<UserProfile>('userProfile');
  }

  /**
   * Save user profile
   */
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.localStorage.set('userProfile', profile);
  }

  /**
   * Get course progress
   */
  async getCourseProgress(courseId: string): Promise<CourseProgress | null> {
    return this.localStorage.get<CourseProgress>(`progress:${courseId}`);
  }

  /**
   * Save course progress
   */
  async saveCourseProgress(progress: CourseProgress): Promise<void> {
    await this.localStorage.set(`progress:${progress.courseId}`, progress);
  }

  /**
   * Get lesson progress
   */
  async getLessonProgress(courseId: string, lessonSlug: string): Promise<LessonProgress | null> {
    const courseProgress = await this.getCourseProgress(courseId);
    if (!courseProgress) return null;
    return courseProgress.lessons[lessonSlug] || null;
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(
    courseId: string,
    lessonSlug: string,
    progress: Partial<LessonProgress>
  ): Promise<void> {
    let courseProgress = await this.getCourseProgress(courseId);

    if (!courseProgress) {
      courseProgress = {
        courseId,
        lessons: {},
        completedLessons: [],
        totalPoints: 0,
        badges: [],
        startedAt: Date.now(),
        lastAccessedAt: Date.now(),
      };
    }

    const existingProgress = courseProgress.lessons[lessonSlug] || {
      lessonSlug,
      completed: false,
      timeSpent: 0,
      lastAccessedAt: Date.now(),
    };

    courseProgress.lessons[lessonSlug] = {
      ...existingProgress,
      ...progress,
      lastAccessedAt: Date.now(),
    };

    // Update completed lessons list
    if (progress.completed && !courseProgress.completedLessons.includes(lessonSlug)) {
      courseProgress.completedLessons.push(lessonSlug);
    }

    // Update total points
    if (progress.points) {
      courseProgress.totalPoints += progress.points;
    }

    courseProgress.lastAccessedAt = Date.now();

    await this.saveCourseProgress(courseProgress);
  }

  /**
   * Mark lesson as completed
   */
  async completeLesson(
    courseId: string,
    lessonSlug: string,
    quizScore?: number,
    quizPassed?: boolean,
    points?: number
  ): Promise<void> {
    await this.updateLessonProgress(courseId, lessonSlug, {
      completed: true,
      completedAt: Date.now(),
      quizScore,
      quizPassed,
      points,
    });
  }

  /**
   * Track time spent on lesson
   */
  async trackTimeSpent(courseId: string, lessonSlug: string, seconds: number): Promise<void> {
    const progress = await this.getLessonProgress(courseId, lessonSlug);
    const currentTimeSpent = progress?.timeSpent || 0;

    await this.updateLessonProgress(courseId, lessonSlug, {
      timeSpent: currentTimeSpent + seconds,
    });
  }

  /**
   * Get all course progress
   */
  async getAllCourseProgress(): Promise<Record<string, CourseProgress>> {
    const keys = await this.localStorage.keys();
    const progressKeys = keys.filter((key) => key.startsWith('progress:'));
    const result: Record<string, CourseProgress> = {};

    for (const key of progressKeys) {
      const progress = await this.localStorage.get<CourseProgress>(key);
      if (progress) {
        result[key.replace('progress:', '')] = progress;
      }
    }

    return result;
  }

  /**
   * Reset course progress
   */
  async resetCourseProgress(courseId: string): Promise<void> {
    await this.localStorage.remove(`progress:${courseId}`);
  }

  /**
   * Clear all progress data
   */
  async clearAllProgress(): Promise<void> {
    const keys = await this.localStorage.keys();
    const progressKeys = keys.filter((key) => key.startsWith('progress:'));

    for (const key of progressKeys) {
      await this.localStorage.remove(key);
    }
  }

  /**
   * Export all data
   */
  async exportData(): Promise<Record<string, unknown>> {
    const userProfile = await this.getUserProfile();
    const courseProgress = await this.getAllCourseProgress();

    return {
      userProfile,
      courseProgress,
      exportedAt: Date.now(),
    };
  }

  /**
   * Import data
   */
  async importData(data: Record<string, unknown>): Promise<void> {
    if (data.userProfile) {
      await this.saveUserProfile(data.userProfile as UserProfile);
    }

    if (data.courseProgress) {
      for (const [courseId, progress] of Object.entries(
        data.courseProgress as Record<string, CourseProgress>
      )) {
        progress.courseId = courseId;
        await this.saveCourseProgress(progress);
      }
    }
  }
}

/**
 * Create storage manager instance
 */
export function createStorageManager(): StorageManager {
  return new StorageManager();
}

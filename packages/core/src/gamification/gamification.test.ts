import { describe, it, expect, beforeEach } from 'vitest';
import { GamificationManager } from './index';
import type { UserProfile, CourseProgress } from '../types';

describe('GamificationManager', () => {
  let manager: GamificationManager;
  let mockProfile: UserProfile;

  beforeEach(() => {
    manager = new GamificationManager();
    mockProfile = {
      id: 'user-1',
      totalPoints: 0,
      badges: [],
      achievements: [],
      coursesProgress: {},
      streak: { current: 0, longest: 0, lastActiveDate: '' },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  });

  it('should calculate points correctly', () => {
    expect(manager.calculateLessonPoints()).toBe(10); // Base
    expect(manager.calculateLessonPoints(100, true)).toBe(10 + 20 + 30); // Base + Quiz + Perfect
  });

  it('should award "First Steps" badge', () => {
    const progress: CourseProgress = {
      courseId: 'c1',
      completedLessons: ['l1'],
      lessons: { l1: { lessonSlug: 'l1', completed: true, completedAt: Date.now(), timeSpent: 100, lastAccessedAt: Date.now() } },
      totalPoints: 10,
      badges: [],
      startedAt: Date.now(),
      lastAccessedAt: Date.now()
    };

    const earned = manager.checkBadges(progress, progress.lessons['l1'], mockProfile);
    expect(earned.some(b => b.id === 'first-lesson')).toBe(true);
  });

  it('should update and increment streaks', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    mockProfile.streak.lastActiveDate = yesterday.toISOString().split('T')[0];
    mockProfile.streak.current = 5;

    const updated = manager.updateStreak(mockProfile);
    expect(updated.streak.current).toBe(6);
  });

  it('should check achievements based on total points', () => {
    mockProfile.totalPoints = 1000;
    const earned = manager.checkAchievements(mockProfile);
    expect(earned.some(a => a.id === 'points-1000')).toBe(true);
  });
});

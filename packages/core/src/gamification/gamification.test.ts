import { describe, it, expect, beforeEach } from 'vitest';
import { GamificationManager, resolveGamificationConfig } from './index';
import type { UserProfile } from '../types';

describe('GamificationManager', () => {
  let manager: GamificationManager;
  let mockProfile: UserProfile;

  beforeEach(() => {
    manager = new GamificationManager();
    mockProfile = {
      id: 'user-1',
      globalScore: 0,
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

  it('should update and increment streaks', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    mockProfile.streak.lastActiveDate = yesterday.toISOString().split('T')[0];
    mockProfile.streak.current = 5;

    const updated = manager.updateStreak(mockProfile);
    expect(updated.streak.current).toBe(6);
  });

  it('should check achievements based on total points', () => {
    mockProfile.globalScore = 1000;
    mockProfile.totalPoints = 1000;
    const earned = manager.checkAchievements(mockProfile);
    expect(earned.some(a => a.id === 'points-1000')).toBe(true);
  });

  it('should resolve config overrides', () => {
    const resolved = resolveGamificationConfig({
      points: {
        lessonCompletion: 100,
        quizPassed: 10,
      },
    });

    expect(resolved.points.lessonCompletion).toBe(100);
    expect(resolved.points.quizPassed).toBe(10);
    expect(resolved.points.quizPerfectScore).toBe(30);
  });
});

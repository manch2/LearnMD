import type { Badge, Achievement, UserProfile, CourseProgress, LessonProgress, PluginContext } from '../types';
import { BasePlugin, HOOKS } from '../plugins/index.js';

/**
 * Default badges configuration
 */
export const DEFAULT_BADGES: Omit<Badge, 'earnedAt' | 'courseId'>[] = [
  {
    id: 'first-lesson',
    name: { en: 'First Steps', es: 'Primeros Pasos' },
    description: {
      en: 'Complete your first lesson',
      es: 'Completa tu primera lección',
    },
    icon: '🎯',
  },
  {
    id: 'quick-learner',
    name: { en: 'Quick Learner', es: 'Aprendiz Rápido' },
    description: {
      en: 'Complete 5 lessons in one day',
      es: 'Completa 5 lecciones en un día',
    },
    icon: '⚡',
  },
  {
    id: ' perfectionist',
    name: { en: 'Perfectionist', es: 'Perfeccionista' },
    description: {
      en: 'Get 100% on a quiz',
      es: 'Obtén 100% en un quiz',
    },
    icon: '💯',
  },
  {
    id: 'course-complete',
    name: { en: 'Course Complete', es: 'Curso Completado' },
    description: {
      en: 'Complete an entire course',
      es: 'Completa un curso entero',
    },
    icon: '🎓',
  },
  {
    id: 'week-streak',
    name: { en: 'Week Warrior', es: 'Guerrero Semanal' },
    description: {
      en: 'Maintain a 7-day streak',
      es: 'Mantén una racha de 7 días',
    },
    icon: '🔥',
  },
  {
    id: 'month-streak',
    name: { en: 'Monthly Master', es: 'Maestro Mensual' },
    description: {
      en: 'Maintain a 30-day streak',
      es: 'Mantén una racha de 30 días',
    },
    icon: '👑',
  },
  {
    id: 'knowledge-seeker',
    name: { en: 'Knowledge Seeker', es: 'Buscador de Conocimiento' },
    description: {
      en: 'Complete 10 lessons',
      es: 'Completa 10 lecciones',
    },
    icon: '📚',
  },
  {
    id: 'scholar',
    name: { en: 'Scholar', es: 'Erudito' },
    description: {
      en: 'Complete 50 lessons',
      es: 'Completa 50 lecciones',
    },
    icon: '🏆',
  },
];

/**
 * Default achievements configuration
 */
export const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'unlockedAt'>[] = [
  {
    id: 'lessons-10',
    name: { en: 'Dedicated Learner', es: 'Aprendiz Dedicado' },
    description: {
      en: 'Complete 10 lessons',
      es: 'Completa 10 lecciones',
    },
    criteria: {
      type: 'lessons_completed',
      value: 10,
    },
  },
  {
    id: 'lessons-50',
    name: { en: 'Knowledge Master', es: 'Maestro del Conocimiento' },
    description: {
      en: 'Complete 50 lessons',
      es: 'Completa 50 lecciones',
    },
    criteria: {
      type: 'lessons_completed',
      value: 50,
    },
  },
  {
    id: 'points-1000',
    name: { en: 'Point Collector', es: 'Coleccionista de Puntos' },
    description: {
      en: 'Earn 1000 points',
      es: 'Gana 1000 puntos',
    },
    criteria: {
      type: 'points_earned',
      value: 1000,
    },
  },
  {
    id: 'streak-7',
    name: { en: 'Consistent Learner', es: 'Aprendiz Consistente' },
    description: {
      en: 'Maintain a 7-day streak',
      es: 'Mantén una racha de 7 días',
    },
    criteria: {
      type: 'streak_days',
      value: 7,
    },
  },
  {
    id: 'streak-30',
    name: { en: 'Unstoppable', es: 'Imparable' },
    description: {
      en: 'Maintain a 30-day streak',
      es: 'Mantén una racha de 30 días',
    },
    criteria: {
      type: 'streak_days',
      value: 30,
    },
  },
  {
    id: 'quizzes-10',
    name: { en: 'Quiz Master', es: 'Maestro de Quizzes' },
    description: {
      en: 'Pass 10 quizzes',
      es: 'Aprueba 10 quizzes',
    },
    criteria: {
      type: 'quizzes_passed',
      value: 10,
    },
  },
];

/**
 * Points configuration
 */
export const POINTS_CONFIG = {
  lessonCompleted: 10,
  quizPassed: 20,
  quizPerfectScore: 30,
  dailyBonus: 5,
  streakBonus: {
    7: 50,
    30: 200,
    100: 500,
  },
};

/**
 * Gamification manager
 */
export class GamificationManager {
  private readonly badges: Map<string, Omit<Badge, 'earnedAt' | 'courseId'>>;
  private readonly achievements: Map<string, Omit<Achievement, 'unlockedAt'>>;
  private readonly pointsConfig: typeof POINTS_CONFIG;

  constructor() {
    this.badges = new Map(DEFAULT_BADGES.map((b) => [b.id, b]));
    this.achievements = new Map(DEFAULT_ACHIEVEMENTS.map((a) => [a.id, a]));
    this.pointsConfig = POINTS_CONFIG;
  }

  /**
   * Register a custom badge
   */
  registerBadge(badge: Omit<Badge, 'earnedAt' | 'courseId'>): void {
    this.badges.set(badge.id, badge);
  }

  /**
   * Register a custom achievement
   */
  registerAchievement(achievement: Omit<Achievement, 'unlockedAt'>): void {
    this.achievements.set(achievement.id, achievement);
  }

  /**
   * Calculate points for lesson completion
   */
  calculateLessonPoints(quizScore?: number, quizPassed?: boolean): number {
    let points = this.pointsConfig.lessonCompleted;

    if (quizPassed) {
      points += this.pointsConfig.quizPassed;
    }

    if (quizScore === 100) {
      points += this.pointsConfig.quizPerfectScore;
    }

    return points;
  }

  /**
   * Check and award badges for lesson completion
   */
  checkBadges(
    progress: CourseProgress,
    lessonProgress: LessonProgress,
    userProfile: UserProfile
  ): Badge[] {
    const earnedBadges: Badge[] = [];
    const now = Date.now();

    // First lesson badge
    if (
      progress.completedLessons.length === 1 &&
      !userProfile.badges.some((b) => b.id === 'first-lesson')
    ) {
      const badge = this.badges.get('first-lesson');
      if (badge) {
        earnedBadges.push({ ...badge, earnedAt: now });
      }
    }

    // Quick learner badge (5 lessons in one day)
    const today = new Date().toDateString();
    const lessonsToday = progress.completedLessons.filter((slug) => {
      const lp = progress.lessons[slug];
      return lp?.completedAt && new Date(lp.completedAt).toDateString() === today;
    }).length;

    if (lessonsToday >= 5 && !userProfile.badges.some((b) => b.id === 'quick-learner')) {
      const badge = this.badges.get('quick-learner');
      if (badge) {
        earnedBadges.push({ ...badge, earnedAt: now });
      }
    }

    // Perfectionist badge
    if (
      lessonProgress.quizScore === 100 &&
      !userProfile.badges.some((b) => b.id === 'perfectionist')
    ) {
      const badge = this.badges.get('perfectionist');
      if (badge) {
        earnedBadges.push({ ...badge, earnedAt: now, courseId: progress.courseId });
      }
    }

    // Course complete badge
    if (
      progress.completedLessons.length > 0 &&
      !userProfile.badges.some((b) => b.id === 'course-complete')
    ) {
      // Check if all lessons are completed (this would need total lessons count)
      // For now, we'll award it when 10 lessons are completed
      if (progress.completedLessons.length >= 10) {
        const badge = this.badges.get('course-complete');
        if (badge) {
          earnedBadges.push({ ...badge, earnedAt: now, courseId: progress.courseId });
        }
      }
    }

    // Knowledge seeker badge (10 lessons)
    if (
      progress.completedLessons.length >= 10 &&
      !userProfile.badges.some((b) => b.id === 'knowledge-seeker')
    ) {
      const badge = this.badges.get('knowledge-seeker');
      if (badge) {
        earnedBadges.push({ ...badge, earnedAt: now });
      }
    }

    // Scholar badge (50 lessons)
    if (
      progress.completedLessons.length >= 50 &&
      !userProfile.badges.some((b) => b.id === 'scholar')
    ) {
      const badge = this.badges.get('scholar');
      if (badge) {
        earnedBadges.push({ ...badge, earnedAt: now });
      }
    }

    return earnedBadges;
  }

  /**
   * Check and award achievements
   */
  checkAchievements(userProfile: UserProfile): Achievement[] {
    const earnedAchievements: Achievement[] = [];
    const now = Date.now();

    // Count total lessons completed
    const totalLessons = Object.values(userProfile.coursesProgress).reduce(
      (sum, progress) => sum + progress.completedLessons.length,
      0
    );

    // Lessons achievements
    for (const achievement of this.achievements.values()) {
      if (achievement.criteria.type === 'lessons_completed') {
        if (
          totalLessons >= achievement.criteria.value &&
          !userProfile.achievements.some((a) => a.id === achievement.id)
        ) {
          earnedAchievements.push({ ...achievement, unlockedAt: now });
        }
      }
    }

    // Points achievements
    for (const achievement of this.achievements.values()) {
      if (achievement.criteria.type === 'points_earned') {
        if (
          userProfile.totalPoints >= achievement.criteria.value &&
          !userProfile.achievements.some((a) => a.id === achievement.id)
        ) {
          earnedAchievements.push({ ...achievement, unlockedAt: now });
        }
      }
    }

    // Streak achievements
    for (const achievement of this.achievements.values()) {
      if (achievement.criteria.type === 'streak_days') {
        if (
          userProfile.streak.current >= achievement.criteria.value &&
          !userProfile.achievements.some((a) => a.id === achievement.id)
        ) {
          earnedAchievements.push({ ...achievement, unlockedAt: now });
        }
      }
    }

    // Quiz achievements
    const totalQuizzesPassed = Object.values(userProfile.coursesProgress).reduce(
      (sum, progress) => sum + Object.values(progress.lessons).filter((l) => l.quizPassed).length,
      0
    );

    for (const achievement of this.achievements.values()) {
      if (achievement.criteria.type === 'quizzes_passed') {
        if (
          totalQuizzesPassed >= achievement.criteria.value &&
          !userProfile.achievements.some((a) => a.id === achievement.id)
        ) {
          earnedAchievements.push({ ...achievement, unlockedAt: now });
        }
      }
    }

    return earnedAchievements;
  }

  /**
   * Update user streak
   */
  updateStreak(userProfile: UserProfile): UserProfile {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = userProfile.streak.lastActiveDate;

    if (lastActive === today) {
      // Already active today
      return userProfile;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActive === yesterdayStr) {
      // Continue streak
      userProfile.streak.current += 1;
      userProfile.streak.longest = Math.max(userProfile.streak.current, userProfile.streak.longest);

      // Award streak badges
      const streakBadges = [
        { days: 7, badgeId: 'week-streak' },
        { days: 30, badgeId: 'month-streak' },
      ];

      for (const { days, badgeId } of streakBadges) {
        if (userProfile.streak.current === days) {
          const badge = this.badges.get(badgeId);
          if (badge && !userProfile.badges.some((b) => b.id === badgeId)) {
            userProfile.badges.push({ ...badge, earnedAt: Date.now() });
          }
        }
      }
    } else {
      // Reset streak
      userProfile.streak.current = 1;
    }

    userProfile.streak.lastActiveDate = today;
    userProfile.updatedAt = Date.now();

    return userProfile;
  }

  /**
   * Get all available badges
   */
  getAllBadges(): Omit<Badge, 'earnedAt' | 'courseId'>[] {
    return Array.from(this.badges.values());
  }

  /**
   * Get all available achievements
   */
  getAllAchievements(): Omit<Achievement, 'unlockedAt'>[] {
    return Array.from(this.achievements.values());
  }

  /**
   * Get badge by ID
   */
  getBadge(id: string): Omit<Badge, 'earnedAt' | 'courseId'> | undefined {
    return this.badges.get(id);
  }

  /**
   * Get achievement by ID
   */
  getAchievement(id: string): Omit<Achievement, 'unlockedAt'> | undefined {
    return this.achievements.get(id);
  }
}

/**
 * Gamification Plugin
 * Bridges the physical GamificationManager to the internal LearnMD hooks architecture.
 */
export class GamificationPlugin extends BasePlugin {
  public manager: GamificationManager;

  constructor(config?: any) {
    super('gamification', '1.0.0', config);
    this.manager = new GamificationManager();
  }

  onLoad(ctx: PluginContext): void {
    ctx.registerHook(HOOKS.LESSON_COMPLETE, async (data: any) => {
      const { courseId, lessonSlug, score, passed } = data;
      const points = this.manager.calculateLessonPoints(score, passed);
      
      // Update points directly into the lesson progress which increments the total points automatically
      await (ctx.storage as any).updateLessonProgress(courseId, lessonSlug, { points });
      
      const progress = await (ctx.storage as any).getCourseProgress(courseId);
      const profile = await (ctx.storage as any).getUserProfile();
      
      if (progress && profile) {
        const lp = progress.lessons[lessonSlug];
        if (lp) {
           let profileUpdated = false;

           const earnedBadges = this.manager.checkBadges(progress, lp, profile);
           if (earnedBadges.length > 0) {
             profile.badges.push(...earnedBadges);
             profileUpdated = true;
           }

           const earnedAchievements = this.manager.checkAchievements(profile);
           if (earnedAchievements.length > 0) {
             profile.achievements.push(...earnedAchievements);
             profileUpdated = true;
           }

           if (profileUpdated) {
             await (ctx.storage as any).saveUserProfile(profile);
             // Fire a gamification update hook if necessary
             (ctx as any).registerHook?.('gamification:update', profile); 
           }
        }
      }
    });

    ctx.registerHook('app:init', async () => {
      const profile = await (ctx.storage as any).getUserProfile();
      if (profile) {
        const updatedProfile = this.manager.updateStreak(profile);
        await (ctx.storage as any).saveUserProfile(updatedProfile);
      }
    });
  }
}

/**
 * Create gamification manager instance
 */
export function createGamificationManager(): GamificationManager {
  return new GamificationManager();
}

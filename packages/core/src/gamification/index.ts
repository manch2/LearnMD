import type { Achievement, GamificationConfig, UserProfile, PluginContext } from '../types';
import { BasePlugin, HOOKS } from '../plugins/index.js';
import { createDefaultUserProfile } from '../storage/index.js';

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

export const DEFAULT_GAMIFICATION_CONFIG = {
  points: {
    lessonCompletion: 10,
    quizPassed: 20,
    quizPerfectScore: 30,
  },
  streak: {
    enabled: true,
    bonusByDays: {
      7: 50,
      30: 200,
      100: 500,
    } as Record<number, number>,
  },
  achievements: DEFAULT_ACHIEVEMENTS,
};

export interface ResolvedGamificationConfig {
  points: {
    lessonCompletion: number;
    quizPassed: number;
    quizPerfectScore: number;
  };
  streak: {
    enabled: boolean;
    bonusByDays: Record<number, number>;
  };
  achievements: Array<Omit<Achievement, 'unlockedAt'>>;
}

export function resolveGamificationConfig(
  config?: false | GamificationConfig
): ResolvedGamificationConfig {
  const gamificationConfig = config || undefined;

  return {
    points: {
      lessonCompletion:
        gamificationConfig?.points?.lessonCompletion ??
        DEFAULT_GAMIFICATION_CONFIG.points.lessonCompletion,
      quizPassed:
        gamificationConfig?.points?.quizPassed ?? DEFAULT_GAMIFICATION_CONFIG.points.quizPassed,
      quizPerfectScore:
        gamificationConfig?.points?.quizPerfectScore ??
        DEFAULT_GAMIFICATION_CONFIG.points.quizPerfectScore,
    },
    streak: {
      enabled: gamificationConfig?.streak?.enabled ?? DEFAULT_GAMIFICATION_CONFIG.streak.enabled,
      bonusByDays: {
        ...DEFAULT_GAMIFICATION_CONFIG.streak.bonusByDays,
        ...(gamificationConfig?.streak?.bonusByDays || {}),
      },
    },
    achievements: gamificationConfig?.achievements?.length
      ? gamificationConfig.achievements
      : DEFAULT_ACHIEVEMENTS,
  };
}

export class GamificationManager {
  private readonly achievements: Map<string, Omit<Achievement, 'unlockedAt'>>;
  private readonly config: ResolvedGamificationConfig;

  constructor(config?: false | GamificationConfig) {
    this.config = resolveGamificationConfig(config);
    this.achievements = new Map(this.config.achievements.map((achievement) => [achievement.id, achievement]));
  }

  getConfig(): ResolvedGamificationConfig {
    return this.config;
  }

  calculateLessonPoints(quizScore?: number, quizPassed?: boolean): number {
    let points = this.config.points.lessonCompletion;

    if (quizPassed) {
      points += this.config.points.quizPassed;
    }

    if (quizScore === 100) {
      points += this.config.points.quizPerfectScore;
    }

    return points;
  }

  checkAchievements(userProfile: UserProfile): Achievement[] {
    const earnedAchievements: Achievement[] = [];
    const now = Date.now();

    const totalLessons = Object.values(userProfile.coursesProgress).reduce(
      (sum, progress) => sum + progress.completedLessons.length,
      0
    );

    const totalQuizzesPassed = Object.values(userProfile.coursesProgress).reduce(
      (sum, progress) => sum + Object.values(progress.lessons).filter((lesson) => lesson.quizPassed).length,
      0
    );

    for (const achievement of this.achievements.values()) {
      if (userProfile.achievements.some((existing) => existing.id === achievement.id)) {
        continue;
      }

      if (
        (achievement.criteria.type === 'lessons_completed' &&
          totalLessons >= achievement.criteria.value) ||
        (achievement.criteria.type === 'points_earned' &&
          userProfile.globalScore >= achievement.criteria.value) ||
        (achievement.criteria.type === 'streak_days' &&
          userProfile.streak.current >= achievement.criteria.value) ||
        (achievement.criteria.type === 'quizzes_passed' &&
          totalQuizzesPassed >= achievement.criteria.value)
      ) {
        earnedAchievements.push({ ...achievement, unlockedAt: now });
      }
    }

    return earnedAchievements;
  }

  updateStreak(userProfile: UserProfile): UserProfile {
    if (!this.config.streak.enabled) {
      return userProfile;
    }

    const today = new Date().toISOString().split('T')[0];
    const lastActive = userProfile.streak.lastActiveDate;

    if (lastActive === today) {
      return userProfile;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActive === yesterdayStr) {
      userProfile.streak.current += 1;
    } else {
      userProfile.streak.current = 1;
    }

    userProfile.streak.longest = Math.max(userProfile.streak.current, userProfile.streak.longest);

    const streakBonus = this.config.streak.bonusByDays[userProfile.streak.current];
    if (streakBonus) {
      userProfile.globalScore += streakBonus;
      userProfile.totalPoints = userProfile.globalScore;
    }

    userProfile.streak.lastActiveDate = today;
    userProfile.updatedAt = Date.now();

    return userProfile;
  }

  getAllAchievements(): Omit<Achievement, 'unlockedAt'>[] {
    return Array.from(this.achievements.values());
  }
}

export class GamificationPlugin extends BasePlugin {
  public manager: GamificationManager;

  constructor(config?: false | GamificationConfig) {
    super('gamification', '1.1.0', (config || {}) as Record<string, unknown>);
    this.manager = new GamificationManager(config);
  }

  onLoad(ctx: PluginContext): void {
    ctx.registerHook(HOOKS.LESSON_COMPLETE, async (data) => {
      const { courseId, lessonSlug, score, passed } = data as {
        courseId: string;
        lessonSlug: string;
        score?: number;
        passed?: boolean;
      };

      const existingLesson = await ctx.storage.getLessonProgress(courseId, lessonSlug);
      const pointsAlreadyAwarded = (existingLesson?.points || 0) > 0;
      const awardedPoints = pointsAlreadyAwarded
        ? 0
        : this.manager.calculateLessonPoints(score, passed);

      if (awardedPoints > 0) {
        await ctx.storage.updateLessonProgress(courseId, lessonSlug, { points: awardedPoints });
      }

      const progress = await ctx.storage.getCourseProgress(courseId);
      if (!progress) {
        return;
      }

      const profile = (await ctx.storage.getUserProfile()) || createDefaultUserProfile();
      profile.coursesProgress[courseId] = progress;

      if (awardedPoints > 0) {
        profile.globalScore += awardedPoints;
        profile.totalPoints = profile.globalScore;
      }

      this.manager.updateStreak(profile);

      const earnedAchievements = this.manager.checkAchievements(profile);
      if (earnedAchievements.length > 0) {
        profile.achievements.push(...earnedAchievements);
      }

      profile.updatedAt = Date.now();
      await ctx.storage.saveUserProfile(profile);
    });

    ctx.registerHook('app:init', async () => {
      const existingProfile = await ctx.storage.getUserProfile();
      if (!existingProfile) {
        await ctx.storage.saveUserProfile(createDefaultUserProfile());
        return;
      }

      const normalizedProfile = createDefaultUserProfile(existingProfile);
      await ctx.storage.saveUserProfile(normalizedProfile);
    });
  }
}

export function createGamificationManager(
  config?: false | GamificationConfig
): GamificationManager {
  return new GamificationManager(config);
}

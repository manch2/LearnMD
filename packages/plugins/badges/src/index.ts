import {
  BasePlugin,
  PluginContext,
  HOOKS,
  UserProfile,
  CourseProgress,
  type TranslatedString,
} from '@learnmd/core';

export interface BadgeConfig {
  id: string;
  name: string | TranslatedString;
  description: string | TranslatedString;
  icon: string;
  criteria: {
    type: 'courses_completed' | 'course_progress' | 'global_score';
    count?: number;
    courseId?: string;
    percentage?: number;
    score?: number;
  };
}

export class BadgesPlugin extends BasePlugin {
  private badges: BadgeConfig[];

  constructor(badges: BadgeConfig[] = []) {
    super('badges', '1.0.0');
    this.badges = badges;
  }

  onLoad(ctx: PluginContext): void {
    ctx.registerHook(HOOKS.PROGRESS_UPDATE, async () => {
      await this.evaluateBadges(ctx);
    });
  }

  private async evaluateBadges(ctx: PluginContext) {
    const profile = await ctx.storage.get<UserProfile>('userProfile');
    if (!profile) return;

    const awardedBadges = profile.badges || [];
    let updated = false;

    // We need all courses progress to evaluate correctly.
    const keys = await ctx.storage.keys();
    const progressKeys = keys.filter(k => k.startsWith('progress:'));
    const allProgress: Record<string, CourseProgress> = {};
    for (const k of progressKeys) {
      const prog = await ctx.storage.get<CourseProgress>(k);
      if (prog) allProgress[k.replace('progress:', '')] = prog;
    }

    for (const badge of this.badges) {
      if (awardedBadges.find((b: { id: string }) => b.id === badge.id)) continue;

      let shouldAward = false;

      if (badge.criteria.type === 'courses_completed') {
        const completedCourses = Object.values(allProgress).filter((p: CourseProgress) => !!p.completedAt).length;
        if (badge.criteria.count && completedCourses >= badge.criteria.count) {
          shouldAward = true;
        }
      } else if (badge.criteria.type === 'course_progress') {
        const { courseId, percentage } = badge.criteria;
        if (courseId && percentage !== undefined) {
          const courseProg = allProgress[courseId];
          // Determine percentage (CourseViewer saves progressPercentage in points check, but we can compute rough fallback if missing)
          const courseProgressValue = courseProg?.completedAt ? 100 : (courseProg?.completedLessons?.length ? (courseProg as any).progressPercentage || Math.min(99, courseProg.completedLessons.length * 20) : 0);
          if (courseProgressValue >= percentage) {
            shouldAward = true;
          }
        }
      } else if (badge.criteria.type === 'global_score') {
        const scoreThreshold = badge.criteria.score;
        const currentScore = (profile as any).globalScore ?? profile.totalPoints ?? 0;
        if (scoreThreshold !== undefined && currentScore >= scoreThreshold) {
          shouldAward = true;
        }
      }

      if (shouldAward) {
        awardedBadges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          earnedAt: Date.now()
        });
        updated = true;
      }
    }

    if (updated) {
      profile.badges = awardedBadges;
      await ctx.storage.set('userProfile', profile);
    }
  }

  getAvailableBadges() {
    return this.badges;
  }
}


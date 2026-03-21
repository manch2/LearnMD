import { BasePlugin, PluginContext, HOOKS, UserProfile, CourseProgress } from '@learnmd/core';

export interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: 'courses_completed' | 'course_progress';
    count?: number;
    courseId?: string;
    percentage?: number;
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
    const profile = await ctx.storage.get<UserProfile>('profile');
    if (!profile) return;

    const awardedBadges = profile.badges || [];
    let updated = false;

    for (const badge of this.badges) {
      if (awardedBadges.find((b: { id: string }) => b.id === badge.id)) continue;

      let shouldAward = false;

      if (badge.criteria.type === 'courses_completed') {
        const completedCourses = Object.values(profile.coursesProgress || {}).filter((p: CourseProgress) => !!p.completedAt).length;
        if (badge.criteria.count && completedCourses >= badge.criteria.count) {
          shouldAward = true;
        }
      } else if (badge.criteria.type === 'course_progress') {
        const { courseId, percentage } = badge.criteria;
        if (courseId && percentage !== undefined) {
          const courseProg = profile.coursesProgress?.[courseId];
          const progress = courseProg?.completedAt ? 100 : (courseProg?.completedLessons?.length ? 50 : 0); // basic fallback, you may want to fetch total lessons
          if (progress >= percentage) {
            shouldAward = true;
          }
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
      await ctx.storage.set('profile', profile);
    }
  }

  getAvailableBadges() {
    return this.badges;
  }
}


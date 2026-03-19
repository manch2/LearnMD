import React from 'react';

export interface BadgeProps {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  earnedAt?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function Badge({ name, description, icon, size = 'md', showTooltip = true }: BadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const badge = (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-600))] flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}
      title={showTooltip ? description : undefined}
    >
      {icon || '🏆'}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {badge}
      <span className="text-sm font-medium text-center">{name}</span>
    </div>
  );
}

export function BadgeCard({
  badge,
  earnedAt,
}: {
  badge: Omit<BadgeProps, 'size' | 'showTooltip'>;
  earnedAt?: number;
}) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="card flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-600))] flex items-center justify-center text-2xl shadow-md flex-shrink-0">
        {badge.icon || '🏆'}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[rgb(var(--text-primary))]">{badge.name}</h4>
        {badge.description && (
          <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">{badge.description}</p>
        )}
        {earnedAt && (
          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
            Earned on {formatDate(earnedAt)}
          </p>
        )}
      </div>
    </div>
  );
}

export function PointsDisplay({
  points,
  label,
  showAnimation = false,
}: {
  points: number;
  label?: string;
  showAnimation?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg
          className="w-8 h-8 text-[rgb(var(--color-primary-500))]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {showAnimation && (
          <span className="absolute inset-0 animate-ping opacity-50">
            <svg
              className="w-8 h-8 text-[rgb(var(--color-primary-500))]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
        )}
      </div>
      <div>
        <span className="text-xl font-bold">{points.toLocaleString()}</span>
        {label && <p className="text-xs text-[rgb(var(--text-muted))]">{label}</p>}
      </div>
    </div>
  );
}

export function StreakDisplay({ current, longest }: { current: number; longest: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <div>
          <span className="text-2xl font-bold">{current}</span>
          <p className="text-xs text-[rgb(var(--text-muted))]">Current Streak</p>
        </div>
      </div>
      <div className="h-8 w-px bg-[rgb(var(--border-color))]" />
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        <div>
          <span className="text-xl font-bold">{longest}</span>
          <p className="text-xs text-[rgb(var(--text-muted))]">Best Streak</p>
        </div>
      </div>
    </div>
  );
}

export function GamificationSummary({
  totalPoints,
  badgesEarned,
  totalBadges,
  currentStreak,
  longestStreak,
}: {
  totalPoints: number;
  badgesEarned: number;
  totalBadges: number;
  currentStreak: number;
  longestStreak: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card flex items-center gap-4">
        <PointsDisplay points={totalPoints} label="Total Points" />
      </div>
      <div className="card">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏅</span>
          <div>
            <span className="text-xl font-bold">
              {badgesEarned}/{totalBadges}
            </span>
            <p className="text-xs text-[rgb(var(--text-muted))]">Badges Earned</p>
          </div>
        </div>
      </div>
      <div className="card">
        <StreakDisplay current={currentStreak} longest={longestStreak} />
      </div>
    </div>
  );
}

export default Badge;

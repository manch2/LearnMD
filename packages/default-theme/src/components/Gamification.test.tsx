import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge, BadgeCard, GamificationSummary, PointsDisplay, StreakDisplay } from './Gamification';

describe('Gamification components', () => {
  it('renders badge variants, summaries, and point displays', () => {
    const earnedAt = Date.UTC(2025, 0, 15);

    render(
      <div>
        <Badge id="badge-1" name="Explorer" description="Completed the first module" icon="X" size="lg" />
        <BadgeCard
          badge={{ id: 'badge-2', name: 'Architect', description: 'Built the full stack', icon: 'Y' }}
          earnedAt={earnedAt}
        />
        <PointsDisplay points={1200} label="XP" showAnimation />
        <StreakDisplay current={7} longest={14} />
        <GamificationSummary
          totalPoints={3200}
          badgesEarned={4}
          totalBadges={8}
          currentStreak={5}
          longestStreak={9}
        />
      </div>
    );

    expect(screen.getByText('Explorer')).toBeInTheDocument();
    expect(screen.getByText('Architect')).toBeInTheDocument();
    expect(screen.getByTitle('Completed the first module')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('XP')).toBeInTheDocument();
    expect(screen.getAllByText('Current Streak').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Best Streak').length).toBeGreaterThan(0);
    expect(screen.getByText('4/8')).toBeInTheDocument();
    expect(screen.getByText('Total Points')).toBeInTheDocument();
    expect(screen.getByText(/Earned on/i)).toBeInTheDocument();
  });
});

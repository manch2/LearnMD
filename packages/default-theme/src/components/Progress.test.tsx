import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress, ProgressRing, ProgressSteps } from './Progress';

describe('Progress', () => {
  it('renders a bounded progress bar with percentage text', () => {
    const { container } = render(
      <Progress value={150} max={100} label="Course progress" showPercentage size="lg" variant="success" />
    );

    expect(screen.getByText('Course progress')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    const fill = container.querySelector('.progress-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
    expect(fill.className).toContain('bg-[rgb(var(--success))]');
  });

  it('renders the progress ring and stepper states', () => {
    const { container } = render(
      <div>
        <ProgressRing value={25} max={50} label="Halfway" variant="warning" />
        <ProgressSteps
          currentStep={1}
          steps={[
            { label: 'Start', completed: true },
            { label: 'Build' },
            { label: 'Ship' },
          ]}
        />
      </div>
    );

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Halfway')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(container.querySelector('circle[stroke="rgb(var(--warning))"]')).toBeInTheDocument();
  });
});

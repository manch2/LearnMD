import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Callout from './Callout';

describe('Callout', () => {
  it('should render children content', () => {
    render(<Callout>Test Content</Callout>);
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('should render with correct title', () => {
    render(<Callout title="Custom Title">Content</Callout>);
    expect(screen.getByText('Custom Title')).toBeDefined();
  });

  it('should apply correct classes based on type', () => {
    const { container } = render(<Callout type="danger">Danger Content</Callout>);
    // Check for rose classes (danger)
    expect(container.firstChild).toHaveClass('bg-rose-50');
  });

  it('should render default title if none provided', () => {
    render(<Callout type="warning">Warning Content</Callout>);
    expect(screen.getByText('Warning')).toBeDefined();
  });
});

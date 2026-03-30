import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContentPage } from './ContentPage';

describe('ContentPage', () => {
  it('renders a centered content wrapper with prose by default', () => {
    const { container } = render(
      <ContentPage>
        <p>Centered content</p>
      </ContentPage>
    );

    expect(screen.getByText('Centered content')).toBeInTheDocument();
    const centeredWrapper = container.querySelector('.mx-auto.max-w-\\[var\\(--content-max-width\\)\\]');
    expect(centeredWrapper).not.toBeNull();
    expect(container.querySelector('.prose')).not.toBeNull();
  });

  it('can render without prose classes', () => {
    const { container } = render(
      <ContentPage prose={false}>
        <div>No prose wrapper</div>
      </ContentPage>
    );

    expect(screen.getByText('No prose wrapper')).toBeInTheDocument();
    expect(container.querySelector('.prose')).toBeNull();
  });
});

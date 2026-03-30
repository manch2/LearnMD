import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TableOfContents } from './TableOfContents';

class IntersectionObserverMock {
  observe = vi.fn((element: Element) => {
    this.callback([{ isIntersecting: true, target: element }]);
  });
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor(private callback: (entries: Array<{ isIntersecting: boolean; target: Element }>) => void) {}
}

describe('TableOfContents', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock as unknown as typeof IntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('collects headings from the main content and highlights the active section', async () => {
    render(
      <div>
        <main>
          <h2>First Section</h2>
          <h3 id="deep-dive">Deep Dive</h3>
        </main>
        <TableOfContents />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByText('On this page')).toBeInTheDocument();
    });

    const generatedLink = screen.getByRole('link', { name: 'First Section' });
    const nestedLink = screen.getByRole('link', { name: 'Deep Dive' });

    expect(generatedLink).toHaveAttribute('href', '#first-section');
    expect(nestedLink).toHaveAttribute('href', '#deep-dive');
    expect(nestedLink.className).toContain('border-[rgb(var(--color-primary-500))]');
  }, 10000);
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Search from './Search';

describe('Search', () => {
  it('opens results on query and clears them again', () => {
    const onSearch = vi.fn();
    render(
      <Search
        results={[
          {
            lessonSlug: 'intro',
            lessonTitle: 'Introduction',
            moduleTitle: 'Architecture',
            excerpt: 'Overview text',
            score: 10,
          },
        ]}
        onSearch={onSearch}
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'intro' } });

    expect(onSearch).toHaveBeenCalledWith('intro');
    expect(screen.getByText('Introduction')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('shows the empty state when there are no results', () => {
    render(<Search results={[]} onSearch={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'missing' } });
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});

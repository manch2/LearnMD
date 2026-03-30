import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Title } from './Title';

vi.mock('../hooks', () => ({
  useI18n: () => ({
    currentLanguage: 'es',
  }),
}));

describe('Title', () => {
  it('renders the content for the current language', () => {
    render(
      <Title level={2}>
        <en>Welcome</en>
        <es>Bienvenido</es>
      </Title>
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Bienvenido' });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain('text-3xl');
  });

  it('falls back to the provided children when no language tags exist', () => {
    render(<Title>Plain title</Title>);

    expect(screen.getByRole('heading', { level: 1, name: 'Plain title' })).toBeInTheDocument();
  });
});

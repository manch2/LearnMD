import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Paragraph } from './Paragraph';

vi.mock('../hooks', () => ({
  useI18n: () => ({
    currentLanguage: 'en',
  }),
}));

describe('Paragraph', () => {
  it('renders the child that matches the active language', () => {
    render(
      <Paragraph>
        <en>Hello world</en>
        <es>Hola mundo</es>
      </Paragraph>
    );

    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.queryByText('Hola mundo')).not.toBeInTheDocument();
  });

  it('falls back to raw content when translations are not tagged', () => {
    render(<Paragraph>Ungrouped paragraph</Paragraph>);

    expect(screen.getByText('Ungrouped paragraph')).toBeInTheDocument();
  });
});

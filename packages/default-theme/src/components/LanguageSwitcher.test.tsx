import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';

const setLanguage = vi.fn();

vi.mock('../hooks', () => ({
  useI18n: () => ({
    currentLanguage: 'en',
    availableLanguages: ['en', 'es'],
    setLanguage,
  }),
}));

describe('LanguageSwitcher', () => {
  it('renders button variant and changes the language on click', () => {
    render(<LanguageSwitcher variant="buttons" />);

    fireEvent.click(screen.getByRole('button', { name: /Espa/i }));
    expect(setLanguage).toHaveBeenCalledWith('es');
  });

  it('renders flag variant with titles and dropdown variant with menu toggling', () => {
    const { rerender } = render(<LanguageSwitcher variant="flags" />);

    expect(screen.getByTitle(/Espa/i)).toBeInTheDocument();

    rerender(<LanguageSwitcher variant="dropdown" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByText(/English|Espa/i).length).toBeGreaterThan(1);

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText(/^Espa/i)).not.toBeInTheDocument();
  });
});

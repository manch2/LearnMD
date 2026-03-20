import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LearnMDProvider, useLearnMD } from './LearnMDProvider';
import { LearnMDConfig } from '../index.js';

const TestComponent = () => {
  const { config } = useLearnMD();
  return <div data-testid="lang">{config.defaultLanguage}</div>;
};

describe('LearnMDProvider', () => {
  it('should provide the learnmd instance to children', () => {
    const config: LearnMDConfig = {
      defaultLanguage: 'es',
      courses: []
    } as any;

    render(
      <LearnMDProvider config={config}>
        <TestComponent />
      </LearnMDProvider>
    );

    expect(screen.getByTestId('lang').textContent).toBe('es');
  });

  it('should throw error when used outside of provider', () => {
    // Suppress console.error for this test as we expect an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow('useLearnMD must be used within a LearnMDProvider');
    
    consoleSpy.mockRestore();
  });
});

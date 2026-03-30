// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LearnMDProvider, useLearnMD } from './LearnMDProvider';

function Probe() {
  const learnmd = useLearnMD();
  return <div>{learnmd.config.defaultLanguage}</div>;
}

describe('LearnMDProvider', () => {
  it('provides the LearnMD context to descendants', () => {
    render(
      <LearnMDProvider config={{ defaultLanguage: 'es', availableLanguages: ['en', 'es'] }}>
        <Probe />
      </LearnMDProvider>
    );

    expect(screen.getByText('es')).toBeTruthy();
  });

  it('throws when useLearnMD is called outside the provider', () => {
    expect(() => render(<Probe />)).toThrow('useLearnMD must be used within a LearnMDProvider');
  });
});

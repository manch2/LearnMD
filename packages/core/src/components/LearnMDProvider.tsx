import React, { createContext, useContext, useMemo } from 'react';
import { createLearnMD, LearnMDConfig } from '../index.js';

export const LearnMDContext = createContext<ReturnType<typeof createLearnMD> | null>(null);

export function useLearnMD() {
  const context = useContext(LearnMDContext);
  if (!context) {
    throw new Error('useLearnMD must be used within a LearnMDProvider');
  }
  return context;
}

export function LearnMDProvider({ config, children }: { config: LearnMDConfig; children: React.ReactNode }) {
  const learnmd = useMemo(() => createLearnMD(config), [config]);

  return <LearnMDContext.Provider value={learnmd}>{children}</LearnMDContext.Provider>;
}

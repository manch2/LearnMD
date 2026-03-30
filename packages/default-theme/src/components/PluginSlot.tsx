import React from 'react';
import { type PluginSlotName, useLearnMD } from '@learnmd/core';

export interface PluginSlotProps {
  slot: PluginSlotName;
  slotProps?: Record<string, unknown>;
  className?: string;
}

export function PluginSlot({ slot, slotProps = {}, className = '' }: PluginSlotProps) {
  const { plugins } = useLearnMD() as any;
  const registrations = typeof plugins?.getSlotComponents === 'function' ? plugins.getSlotComponents(slot) : [];

  if (!registrations || registrations.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {registrations.map((registration: any) => {
        const Component = registration.component as React.ComponentType<Record<string, unknown>>;
        if (!Component) {
          return null;
        }

        return <Component key={`${slot}-${registration.name}`} {...slotProps} />;
      })}
    </div>
  );
}

export default PluginSlot;

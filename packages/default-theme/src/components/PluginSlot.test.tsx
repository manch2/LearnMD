import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PluginSlot } from './PluginSlot';

const getSlotComponents = vi.fn();

vi.mock('@learnmd/core', () => ({
  useLearnMD: () => ({
    plugins: {
      getSlotComponents,
    },
  }),
}));

describe('PluginSlot', () => {
  it('renders nothing when no slot registrations exist', () => {
    getSlotComponents.mockReturnValueOnce([]);
    const { container } = render(<PluginSlot slot="profile:summary" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders registered slot components with slot props', () => {
    getSlotComponents.mockReturnValueOnce([
      {
        name: 'summary-card',
        component: ({ label }: { label: string }) => <div>{label}</div>,
      },
    ]);

    render(<PluginSlot slot="profile:summary" slotProps={{ label: 'From plugin' }} />);
    expect(screen.getByText('From plugin')).toBeInTheDocument();
  });
});

import React from 'react';

export type CalloutType = 'info' | 'warning' | 'tip' | 'danger' | 'success';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  { bg: string; border: string; text: string; icon: string; title: string }
> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/50 border-l-4 border-l-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Info',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800/50 border-l-4 border-l-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    title: 'Warning',
  },
  tip: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800/50 border-l-4 border-l-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    title: 'Tip',
  },
  danger: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800/50 border-l-4 border-l-rose-500',
    text: 'text-rose-700 dark:text-rose-400',
    icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Danger',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800/50 border-l-4 border-l-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Success',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type];

  return (
    <div className={`${config.bg} border-y border-r ${config.border} rounded-r-lg p-5 my-6 shadow-sm`}>
      <div className="flex gap-4">
        <svg
          className={`w-6 h-6 flex-shrink-0 ${config.text} mt-0.5`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
        </svg>
        <div className="flex-1">
          <h5 className={`font-bold mb-2 ${config.text} text-lg tracking-tight`}>{title || config.title}</h5>
          <div className="text-[15px] leading-relaxed text-slate-700 dark:text-gray-300 [&>p]:mb-3 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Callout;

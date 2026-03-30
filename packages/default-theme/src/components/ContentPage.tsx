import React, { type ReactNode } from 'react';

export interface ContentPageProps {
  children: ReactNode;
  className?: string;
  prose?: boolean;
}

export function ContentPage({ children, className = '', prose = true }: ContentPageProps) {
  const proseClass = prose ? 'prose dark:prose-invert' : '';

  return (
    <div className={`w-full px-4 py-8 md:py-10 ${className}`.trim()}>
      <div
        className={`mx-auto w-full max-w-[var(--content-max-width)] ${proseClass}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}

export default ContentPage;

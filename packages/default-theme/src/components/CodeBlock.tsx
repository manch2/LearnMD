import React, { useRef, useState, useEffect } from 'react';
import { useCodeTheme } from '../hooks/useCodeTheme';

export const CodeBlock = (props: any) => {
  const { codeTheme, toggleCodeTheme } = useCodeTheme();
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-typescript")
  let language = '';
  const className = props.className || '';
  const match = className.match(/language-(\w+)/);
  if (match) {
    language = match[1];
  } else if (props['data-language']) {
    // Fallback for rehype-pretty-code
    language = props['data-language'];
  }

  const handleCopy = async () => {
    if (preRef.current) {
      try {
        await navigator.clipboard.writeText(preRef.current.textContent || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  // The outer wrapper styling based on the active theme
  // We use inline styles for the border/bg of the header to perfectly match the code block bg if needed,
  // or just use generic tailwind classes that adapt to our CSS variables.
  const isLight = codeTheme === 'light';

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-[rgb(var(--border-color))] shadow-sm" style={{ backgroundColor: 'var(--code-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: isLight ? '#e5e7eb' : '#3f3f46', backgroundColor: isLight ? '#f3f4f6' : '#1f2937' }}>
        <div className="text-xs font-mono font-medium uppercase tracking-wider" style={{ color: isLight ? '#4b5563' : '#9ca3af' }}>
          {language || 'Code'}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleCodeTheme}
            className="p-1.5 rounded-md transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Code Theme`}
            style={{ color: isLight ? '#4b5563' : '#9ca3af' }}
          >
            {isLight ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md transition-colors hover:bg-black/10 dark:hover:bg-white/10 flex items-center gap-1.5"
            title="Copy Code"
            style={{ color: isLight ? '#4b5563' : '#9ca3af' }}
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-xs font-medium text-green-500">Copied!</span>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <pre ref={preRef} {...props} className={`!m-0 !p-4 !rounded-none !border-0 ${props.className || ''}`} />
    </div>
  );
};

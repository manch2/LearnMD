import React, { useEffect, useState } from 'react';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Wait a brief moment for MDX to render
    const timeout = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('main h2, main h3'));
      const items: TOCItem[] = elements.map((elem) => {
        // Ensure element has an ID
        if (!elem.id) {
          elem.id = elem.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
        }
        return {
          id: elem.id,
          text: elem.textContent || '',
          level: Number(elem.tagName.charAt(1)),
        };
      }).filter(item => item.id); // Only keep items with valid IDs

      setHeadings(items);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '0px 0px -80% 0px' }
      );

      elements.forEach((elem) => observer.observe(elem));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, []); // Run once on mount (which happens per page navigation if key changes)

  if (headings.length === 0) return null;

  return (
    <nav className="text-sm">
      <h4 className="font-semibold text-[rgb(var(--text-primary))] uppercase tracking-wider text-xs mb-3">
        On this page
      </h4>
      <ul className="space-y-2 border-l border-[rgb(var(--border-color))]">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${heading.level === 3 ? 'ml-4' : 'ml-0'}`}
          >
            <a
              href={`#${heading.id}`}
              className={`block pl-3 -ml-[1px] border-l-2 py-1 transition-colors ${
                activeId === heading.id
                  ? 'border-[rgb(var(--color-primary-500))] text-[rgb(var(--color-primary-600))] dark:text-[rgb(var(--color-primary-400))] font-medium'
                  : 'border-transparent text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:border-[rgb(var(--border-color))]'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

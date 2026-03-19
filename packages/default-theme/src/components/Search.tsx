import { useState, useCallback } from 'react';

export interface SearchResult {
  lessonSlug: string;
  lessonTitle: string;
  moduleId?: string;
  moduleTitle?: string;
  excerpt: string;
  score: number;
}

export interface SearchProps {
  results: SearchResult[];
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function Search({
  results,
  onSearch,
  placeholder = 'Search...',
  className = '',
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
      setIsOpen(value.length > 0);
    },
    [onSearch]
  );

  const handleFocus = () => {
    if (query.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-muted))]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="input pl-10 pr-4"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              onSearch('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-secondary))]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-color))] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <SearchResultItem key={result.lessonSlug} result={result} />
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-color))] rounded-lg shadow-lg p-4 text-center text-[rgb(var(--text-secondary))]">
          No results found
        </div>
      )}
    </div>
  );
}

function SearchResultItem({ result }: { result: SearchResult }) {
  return (
    <a
      href={`#${result.lessonSlug}`}
      className="block px-4 py-3 hover:bg-[rgb(var(--bg-tertiary))] transition-colors border-b border-[rgb(var(--border-color))] last:border-b-0"
    >
      <div className="flex items-center gap-2 mb-1">
        {result.moduleTitle && (
          <span className="text-xs text-[rgb(var(--text-muted))]">{result.moduleTitle}</span>
        )}
        <span className="text-xs text-[rgb(var(--text-muted))]">/</span>
        <span className="text-sm font-medium text-[rgb(var(--text-primary))]">
          {result.lessonTitle}
        </span>
      </div>
      <p className="text-sm text-[rgb(var(--text-secondary))] line-clamp-2">{result.excerpt}</p>
    </a>
  );
}

export default Search;

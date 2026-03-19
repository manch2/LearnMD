import React, { type ReactNode, useState } from 'react';
import { Progress } from '../components';
import { useTheme } from '../hooks';

export interface NavigationItem {
  type: 'module' | 'lesson';
  id: string;
  title: string;
  slug?: string;
  moduleId?: string;
  completed?: boolean;
  active?: boolean;
  children?: NavigationItem[];
}

export interface CourseLayoutProps {
  children: ReactNode;
  courseTitle: string;
  navigation: NavigationItem[];
  currentLessonSlug?: string;
  completedLessons: string[];
  progress: number;
  onNavigate: (lessonSlug: string) => void;
  sidebarCollapsible?: boolean;
  showProgress?: boolean;
  showNavigation?: boolean;
  footer?: ReactNode;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        // Sun Icon
        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Moon Icon
        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export function CourseLayout({
  children,
  courseTitle,
  navigation,
  currentLessonSlug,
  completedLessons,
  progress,
  onNavigate,
  sidebarCollapsible = true,
  showProgress = true,
  showNavigation = true,
  footer,
}: CourseLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(navigation.map((m) => m.id))
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-[#1b1b1d] text-slate-900 dark:text-gray-200 transition-colors duration-200">
      {/* Navbar Docusaurus Style */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#242526] shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            {sidebarCollapsible && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="xl:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <a href="/" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {courseTitle}
              </h1>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              Search... <span className="ml-8 border border-gray-300 dark:border-gray-600 rounded px-1 text-xs">Ctrl+K</span>
            </div>
            {showProgress && (
              <div className="hidden lg:flex items-center gap-3 w-48 border-l border-gray-200 dark:border-gray-700 pl-4">
                <Progress value={progress} size="sm" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {showNavigation && (
          <aside
            className={`${
              isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full'
            } fixed inset-y-0 left-0 z-30 mt-16 xl:static xl:mt-0 flex-shrink-0 overflow-y-auto bg-[#f5f6f7] dark:bg-[#1c1e21] border-r border-gray-200 dark:border-gray-800 transition-all duration-300`}
          >
            <nav className="p-4 space-y-1">
              {navigation.map((module) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  isExpanded={expandedModules.has(module.id)}
                  currentLessonSlug={currentLessonSlug}
                  completedLessons={completedLessons}
                  onToggle={() => toggleModule(module.id)}
                  onNavigate={onNavigate}
                />
              ))}
            </nav>
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-[800px] mx-auto px-6 py-10 lg:px-12 lg:py-16">
            {children}
            {footer && (
              <div className="mt-16">{footer}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function ModuleItem({
  module,
  isExpanded,
  currentLessonSlug,
  completedLessons,
  onToggle,
  onNavigate,
}: {
  module: NavigationItem;
  isExpanded: boolean;
  currentLessonSlug?: string;
  completedLessons: string[];
  onToggle: () => void;
  onNavigate: (slug: string) => void;
}) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-900 dark:text-gray-100 uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
      >
        <span className="truncate">{module.title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {isExpanded && module.children && module.children.length > 0 && (
        <ul className="mt-2 space-y-1 border-l border-gray-200 dark:border-gray-700 ml-4 pl-1">
          {module.children.map((lesson) => (
            <li key={lesson.id}>
              <button
                onClick={() => lesson.slug && onNavigate(lesson.slug)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  currentLessonSlug === lesson.id
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100'
                }`}
              >
                {completedLessons.includes(lesson.id) ? (
                  <svg className="w-4 h-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ml-1.5 ${currentLessonSlug === lesson.id ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                )}
                <span className="truncate text-left">{lesson.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export interface LessonNavigationProps {
  previousLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
  onPrevious?: () => void;
  onNext?: () => void;
}

export function LessonNavigation({
  previousLesson,
  nextLesson,
  onPrevious,
  onNext,
}: LessonNavigationProps) {
  return (
    <nav className="grid grid-cols-2 gap-4 py-8 mt-12 mb-8 border-t border-gray-200 dark:border-gray-800">
      {previousLesson ? (
        <button
          onClick={onPrevious}
          className="flex flex-col items-start px-6 py-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all group text-left"
        >
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-emerald-500 transition-colors uppercase tracking-wider mb-1">
            &laquo; Previous
          </span>
          <span className="text-lg font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 transition-colors">
            {previousLesson.title}
          </span>
        </button>
      ) : (
        <div />
      )}

      {nextLesson ? (
        <button
          onClick={onNext}
          className="flex flex-col items-end px-6 py-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all group text-right"
        >
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-emerald-500 transition-colors uppercase tracking-wider mb-1">
            Next &raquo;
          </span>
          <span className="text-lg font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 transition-colors">
            {nextLesson.title}
          </span>
        </button>
      ) : (
        <div />
      )}
    </nav>
  );
}

export default CourseLayout;

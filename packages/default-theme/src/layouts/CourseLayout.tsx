import { type ReactNode, useState } from 'react';
import { Progress } from '../components';

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
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 bg-[rgb(var(--bg-primary))]/95 backdrop-blur border-b border-[rgb(var(--border-color))]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            {sidebarCollapsible && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-[rgb(var(--bg-tertiary))]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <h1 className="font-semibold truncate">{courseTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            {showProgress && (
              <div className="hidden md:flex items-center gap-2 w-48">
                <Progress value={progress} size="sm" />
                <span className="text-sm text-[rgb(var(--text-muted))]">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
        </div>
        {showProgress && (
          <div className="md:hidden px-4 pb-2">
            <Progress value={progress} size="sm" showPercentage />
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {showNavigation && (
          <aside
            className={`${
              isSidebarOpen ? 'w-64' : 'w-0'
            } flex-shrink-0 overflow-y-auto border-r border-[rgb(var(--border-color))] transition-all duration-300 hidden md:block`}
          >
            <nav className="p-4 space-y-2">
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

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>
          {footer && (
            <div className="border-t border-[rgb(var(--border-color))] mt-12">{footer}</div>
          )}
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
  const completedCount =
    module.children?.filter((c) => completedLessons.includes(c.id)).length || 0;
  const totalCount = module.children?.length || 0;

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-[rgb(var(--bg-tertiary))] rounded-lg transition-colors"
      >
        <span className="truncate">{module.title}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[rgb(var(--text-muted))]">
            {completedCount}/{totalCount}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && module.children && module.children.length > 0 && (
        <div className="ml-4 mt-1 space-y-1">
          {module.children.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => lesson.slug && onNavigate(lesson.slug)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                currentLessonSlug === lesson.id
                  ? 'bg-[rgb(var(--color-primary-500))] text-white'
                  : 'hover:bg-[rgb(var(--bg-tertiary))]'
              }`}
            >
              {completedLessons.includes(lesson.id) ? (
                <svg
                  className={`w-4 h-4 flex-shrink-0 ${
                    currentLessonSlug === lesson.id ? 'text-white' : 'text-[rgb(var(--success))]'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <div
                  className={`w-4 h-4 flex-shrink-0 rounded-full border-2 ${
                    currentLessonSlug === lesson.id
                      ? 'border-white'
                      : 'border-[rgb(var(--text-muted))]'
                  }`}
                />
              )}
              <span className="truncate">{lesson.title}</span>
            </button>
          ))}
        </div>
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
    <nav className="flex items-center justify-between gap-4 py-6 border-t border-[rgb(var(--border-color))]">
      {previousLesson ? (
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--bg-tertiary))] hover:bg-[rgb(var(--border-color))] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <div className="text-left">
            <p className="text-xs text-[rgb(var(--text-muted))]">Previous</p>
            <p className="text-sm font-medium">{previousLesson.title}</p>
          </div>
        </button>
      ) : (
        <div />
      )}

      {nextLesson ? (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--color-primary-500))] text-white hover:bg-[rgb(var(--color-primary-600))] transition-colors"
        >
          <div className="text-right">
            <p className="text-xs text-white/80">Next</p>
            <p className="text-sm font-medium">{nextLesson.title}</p>
          </div>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <div />
      )}
    </nav>
  );
}

export default CourseLayout;

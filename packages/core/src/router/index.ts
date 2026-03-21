import type { Course, Lesson, CourseModule } from '../types';

/**
 * Router state
 */
export interface RouterState {
  currentCourse: string | null;
  currentLesson: string | null;
  currentModule: string | null;
  history: string[];
}

/**
 * Navigation item for sidebar
 */
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

/**
 * Router manager for course navigation
 */
export class RouterManager {
  private course: (Course & { lessons: Lesson[]; modules: CourseModule[] }) | null = null;
  private state: RouterState = {
    currentCourse: null,
    currentLesson: null,
    currentModule: null,
    history: [],
  };
  private listeners: Array<(state: RouterState) => void> = [];

  /**
   * Set the current course
   */
  setCourse(course: Course): void {
    this.course = course as Course & { lessons: Lesson[]; modules: CourseModule[] };
    this.state.currentCourse = course.id;
    this.notifyListeners();
  }

  /**
   * Navigate to a lesson
   */
  navigateToLesson(lessonSlug: string, addToHistory = true): boolean {
    if (!this.course) return false;

    const lesson = this.course.lessons.find((l) => l.slug === lessonSlug);
    if (!lesson) return false;

    if (addToHistory && this.state.currentLesson) {
      this.state.history.push(this.state.currentLesson);
    }

    this.state.currentLesson = lessonSlug;
    this.state.currentModule = lesson.moduleId || null;
    this.notifyListeners();

    return true;
  }

  /**
   * Navigate to the next lesson
   */
  nextLesson(): boolean {
    if (!this.course || !this.state.currentLesson) return false;

    const currentIndex = this.course.lessons.findIndex((l) => l.slug === this.state.currentLesson);

    if (currentIndex === -1 || currentIndex >= this.course.lessons.length - 1) {
      return false;
    }

    const nextLesson = this.course.lessons[currentIndex + 1];
    return this.navigateToLesson(nextLesson.slug);
  }

  /**
   * Navigate to the previous lesson
   */
  previousLesson(): boolean {
    if (!this.course || !this.state.currentLesson) return false;

    const currentIndex = this.course.lessons.findIndex((l) => l.slug === this.state.currentLesson);

    if (currentIndex <= 0) {
      return false;
    }

    const prevLesson = this.course.lessons[currentIndex - 1];
    return this.navigateToLesson(prevLesson.slug);
  }

  /**
   * Go back in history
   */
  goBack(): boolean {
    if (this.state.history.length === 0) return false;

    const previousLesson = this.state.history.pop();
    if (previousLesson) {
      this.state.currentLesson = previousLesson;
      this.notifyListeners();
      return true;
    }

    return false;
  }

  /**
   * Get the current lesson
   */
  getCurrentLesson(): Lesson | null {
    if (!this.course || !this.state.currentLesson) return null;
    return this.course.lessons.find((l) => l.slug === this.state.currentLesson) || null;
  }

  /**
   * Get the current module
   */
  getCurrentModule(): CourseModule | null {
    if (!this.course || !this.state.currentModule) return null;
    return this.course.modules.find((m) => m.id === this.state.currentModule) || null;
  }

  /**
   * Get navigation structure for sidebar
   */
  getNavigation(completedLessons: string[] = []): NavigationItem[] {
    if (!this.course) return [];

    const items: NavigationItem[] = [];

    for (const module of this.course.modules) {
      const moduleItem: NavigationItem = {
        type: 'module',
        id: module.id,
        title: typeof module.title === 'string' ? module.title : Object.values(module.title)[0],
        children: [],
      };

      for (const lessonSlug of module.lessons) {
        const lesson = this.course.lessons.find((l) => l.slug === lessonSlug);
        if (lesson) {
          const title =
            typeof lesson.frontmatter.title === 'string'
              ? lesson.frontmatter.title
              : Object.values(lesson.frontmatter.title)[0];

          moduleItem.children!.push({
            type: 'lesson',
            id: lesson.slug,
            title,
            slug: lesson.slug,
            moduleId: module.id,
            completed: completedLessons.includes(lessonSlug),
            active: this.state.currentLesson === lessonSlug,
          });
        }
      }

      items.push(moduleItem);
    }

    // Add lessons without modules
    const lessonsWithoutModule = this.course.lessons.filter(
      (l) => !l.moduleId || !this.course?.modules.some((m) => m.id === l.moduleId)
    );

    if (lessonsWithoutModule.length > 0) {
      const otherItem: NavigationItem = {
        type: 'module',
        id: 'other',
        title: 'Other Lessons',
        children: lessonsWithoutModule.map((lesson) => ({
          type: 'lesson',
          id: lesson.slug,
          title:
            typeof lesson.frontmatter.title === 'string'
              ? lesson.frontmatter.title
              : Object.values(lesson.frontmatter.title)[0],
          slug: lesson.slug,
          completed: completedLessons.includes(lesson.slug),
          active: this.state.currentLesson === lesson.slug,
        })),
      };
      items.push(otherItem);
    }

    return items;
  }

  /**
   * Get lesson progress percentage
   */
  getProgress(completedLessons: string[]): number {
    if (!this.course || this.course.lessons.length === 0) return 0;
    return (completedLessons.length / this.course.lessons.length) * 100;
  }

  /**
   * Check if a lesson is available (prerequisites met)
   */
  isLessonAvailable(lessonSlug: string, completedLessons: string[]): boolean {
    if (!this.course) return false;

    const lesson = this.course.lessons.find((l) => l.slug === lessonSlug);
    if (!lesson) return false;

    // First lesson is always available
    const lessonIndex = this.course.lessons.findIndex((l) => l.slug === lessonSlug);
    if (lessonIndex === 0) return true;

    // Check if previous lesson is completed
    const previousLesson = this.course.lessons[lessonIndex - 1];
    if (previousLesson) {
      return completedLessons.includes(previousLesson.slug);
    }

    return true;
  }

  /**
   * Subscribe to router state changes
   */
  subscribe(listener: (state: RouterState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get current state
   */
  getState(): RouterState {
    return { ...this.state };
  }

  /**
   * Reset router state
   */
  reset(): void {
    this.state = {
      currentCourse: null,
      currentLesson: null,
      currentModule: null,
      history: [],
    };
    this.notifyListeners();
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }
}

/**
 * Create router manager instance
 */
export function createRouterManager(): RouterManager {
  return new RouterManager();
}

/**
 * Generate URL for a lesson
 */
export function generateLessonUrl(
  basePath: string,
  courseSlug: string,
  lessonSlug: string
): string {
  return `${basePath}/courses/${courseSlug}/${lessonSlug}`;
}

/**
 * Parse URL to extract course and lesson slugs
 */
export function parseUrl(path: string): { courseSlug?: string; lessonSlug?: string } {
  const match = path.match(/\/courses\/([^/]+)\/([^/]+)/);
  if (match) {
    return {
      courseSlug: match[1],
      lessonSlug: match[2],
    };
  }
  return {};
}

/**
 * Get lesson order number
 */
export function getLessonOrder(course: Course, lessonSlug: string): number {
  const index = (course.lessons as Lesson[]).findIndex((l) => l.slug === lessonSlug);
  return index + 1;
}

/**
 * Get total lessons count
 */
export function getTotalLessons(course: Course): number {
  return course.lessons.length;
}

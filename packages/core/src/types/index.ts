/**
 * Course metadata from frontmatter
 */
export interface CourseFrontmatter {
  title: string | TranslatedString;
  description?: string | TranslatedString;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  badge?: string;
  points?: number;
  cover?: string;
  authors?: string[];
  version?: string;
  lastUpdated?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  i18n?: I18nConfig;
  [key: string]: unknown;
}

/**
 * Translated string with language codes as keys
 */
export interface TranslatedString {
  [lang: string]: string;
}

/**
 * i18n configuration for a course/lesson
 */
export interface I18nConfig {
  defaultLanguage: string;
  availableLanguages: string[];
  translations?: Record<string, Record<string, string>>;
}

/**
 * Parsed lesson content
 */
export interface Lesson {
  slug: string;
  frontmatter: CourseFrontmatter;
  content: string;
  html?: string;
  sections?: LessonSection[];
  quiz?: Quiz;
  order?: number;
  moduleId?: string;
}

/**
 * Lesson section for navigation
 */
export interface LessonSection {
  id: string;
  title: string;
  level: number;
}

/**
 * Quiz configuration
 */
export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore?: number;
  allowRetry?: boolean;
  showCorrectAnswers?: boolean;
}

/**
 * Quiz question
 */
export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'input';
  question: string | TranslatedString;
  options?: Array<{ id: string; label: string | TranslatedString }>;
  correctAnswer: string | string[];
  explanation?: string | TranslatedString;
  points?: number;
  i18n?: QuizI18n;
}

/**
 * Quiz option for multiple choice questions
 */
export interface QuizOption {
  id: string;
  label: string | TranslatedString;
  isCorrect?: boolean;
}

/**
 * i18n for quiz questions
 */
export interface QuizI18n {
  [lang: string]: {
    question?: string;
    options?: { id: string; label: string }[];
    explanation?: string;
  };
}

/**
 * Course structure
 */
export interface Course {
  id: string;
  title: string | TranslatedString;
  description?: string | TranslatedString;
  modules: CourseModule[] | string[];
  lessons: Lesson[] | string[];
  frontmatter: CourseFrontmatter;
  basePath: string;
  difficulty?: string;
  estimatedTime?: string;
  prerequisites?: string[];
  expectedSkills?: string[];
  author?: string | string[];
  lastUpdated?: string;
}

/**
 * Course module (group of lessons)
 */
export interface CourseModule {
  id: string;
  title: string | TranslatedString;
  description?: string | TranslatedString;
  lessons: string[]; // lesson slugs
  order?: number;
}

/**
 * User progress for a lesson
 */
export interface LessonProgress {
  lessonSlug: string;
  completed: boolean;
  completedAt?: number;
  quizScore?: number;
  quizPassed?: boolean;
  timeSpent: number; // in seconds
  lastAccessedAt: number;
  points?: number;
}

/**
 * User progress for a course
 */
export interface CourseProgress {
  courseId: string;
  lessons: Record<string, LessonProgress>;
  completedLessons: string[];
  totalPoints: number;
  badges: string[];
  startedAt: number;
  completedAt?: number;
  lastAccessedAt: number;
  progressPercentage?: number;
  totalLessons?: number;
}

/**
 * User profile with gamification
 */
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  globalScore: number;
  totalPoints: number;
  badges: Badge[];
  coursesProgress: Record<string, CourseProgress>;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  achievements: Achievement[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Badge earned by user
 */
export interface Badge {
  id: string;
  name: string | TranslatedString;
  description: string | TranslatedString;
  icon?: string;
  earnedAt: number;
  courseId?: string;
}

/**
 * Achievement unlocked
 */
export interface Achievement {
  id: string;
  name: string | TranslatedString;
  description: string | TranslatedString;
  unlockedAt: number;
  criteria: AchievementCriteria;
}

/**
 * Achievement criteria
 */
export interface AchievementCriteria {
  type: 'lessons_completed' | 'points_earned' | 'streak_days' | 'quizzes_passed';
  value: number;
}

/**
 * Plugin interface
 */
export interface Plugin {
  name: string;
  version: string;
  onLoad: (ctx: PluginContext) => void | Promise<void>;
  onUnload?: (ctx: PluginContext) => void | Promise<void>;
  config?: PluginConfig;
}

export type PluginSlotName = 'profile:summary' | 'profile:courseActions' | 'profile:sections';

export interface PluginSlotComponentRegistration {
  slot: PluginSlotName;
  name: string;
  component: unknown;
  order?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Plugin context provided to plugins
 */
export interface PluginContext {
  course: Course;
  storage: LearnMDStorage;
  i18n: I18nAdapter;
  registerComponent: (
    nameOrRegistration: string | PluginSlotComponentRegistration,
    component?: unknown
  ) => void;
  registerHook: (hook: string, fn: (...args: unknown[]) => unknown) => void;
  config: Record<string, unknown>;
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  [key: string]: unknown;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

/**
 * Storage interface used by LearnMD runtime and plugins
 */
export interface LearnMDStorage extends StorageAdapter {
  getUserProfile(): Promise<UserProfile | null>;
  saveUserProfile(profile: UserProfile): Promise<void>;
  getCourseProgress(courseId: string): Promise<CourseProgress | null>;
  saveCourseProgress(progress: CourseProgress): Promise<void>;
  getAllCourseProgress(): Promise<Record<string, CourseProgress>>;
  getLessonProgress(courseId: string, lessonSlug: string): Promise<LessonProgress | null>;
  updateLessonProgress(
    courseId: string,
    lessonSlug: string,
    progress: Partial<LessonProgress>
  ): Promise<void>;
  completeLesson(
    courseId: string,
    lessonSlug: string,
    quizScore?: number,
    quizPassed?: boolean,
    points?: number
  ): Promise<void>;
}

/**
 * i18n adapter interface
 */
export interface I18nAdapter {
  currentLanguage: string;
  availableLanguages: string[];
  setLanguage(lang: string): void;
  translate(key: string, lang?: string): string;
  translateObject<T extends Record<string, unknown>>(obj: T, lang?: string): T;
}

/**
 * Search result
 */
export interface SearchResult {
  lessonSlug: string;
  lessonTitle: string;
  moduleId?: string;
  moduleTitle?: string;
  excerpt: string;
  score: number;
}

/**
 * Video embed configuration
 */
export interface VideoEmbedConfig {
  provider: 'youtube' | 'vimeo' | 'onedrive' | 'googledrive' | 'custom';
  id?: string;
  url?: string;
  title?: string;
  startTime?: number;
  endTime?: number;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  borderColor?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  borderRadius?: number | string;
  contentMaxWidth?: number | string;
  logoText?: string;
  darkMode?:
    | boolean
    | {
        enabled?: boolean;
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
        surfaceColor?: string;
        textColor?: string;
        mutedTextColor?: string;
        borderColor?: string;
      };
  navigation?: { label: string | TranslatedString; path: string }[];
  customPages?: { path: string; componentPath: string }[];
}

export interface GamificationPointsConfig {
  lessonCompletion?: number;
  quizPassed?: number;
  quizPerfectScore?: number;
}

export interface GamificationStreakConfig {
  enabled?: boolean;
  bonusByDays?: Record<number, number>;
}

export interface GamificationConfig {
  points?: GamificationPointsConfig;
  achievements?: Array<Omit<Achievement, 'unlockedAt'>>;
  streak?: GamificationStreakConfig;
}

/**
 * Root configuration
 */
export interface Config {
  title?: string;
  description?: string;
  defaultLanguage?: string;
  availableLanguages?: string[];
  basePath?: string;
  storagePrefix?: string;
  enableAnalytics?: boolean;
  theme?: ThemeConfig;
  gamification?: false | GamificationConfig;
  navigation?: { label: string | TranslatedString; path: string }[];
  customPages?: { path: string; componentPath: string }[];
  plugins?: Array<Plugin | (() => Plugin)>;
}

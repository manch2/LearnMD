// Types
export type * from './types/index.js';

// Parser
export * from './parser/index.js';

// i18n
export * from './i18n/index.js';

// Router
export * from './router/index.js';

// Storage
export * from './storage/index.js';

// Gamification
export * from './gamification/index.js';

// Plugins
export * from './plugins/index.js';

// LearnMD Context
export * from './components/LearnMDProvider.js';

// Import class implementations for createLearnMD
import { initializeI18n } from './i18n/index.js';
import { StorageManager } from './storage/index.js';
import { GamificationManager, GamificationPlugin } from './gamification/index.js';
import { RouterManager } from './router/index.js';
import { PluginRegistry, createDefaultPluginContext, HOOKS } from './plugins/index.js';

/**
 * LearnMD Core - Main entry point
 *
 * @example
 * ```typescript
 * import {
 *   parseLesson,
 *   createI18n,
 *   createStorageManager,
 *   createGamificationManager,
 *   createRouterManager
 * } from '@learnmd/core';
 * ```
 */

/**
 * Core version
 */
export const VERSION = '0.0.2-beta.0';

/**
 * Initialize LearnMD core with default configuration
 */
export interface LearnMDConfig {
  title?: string;
  description?: string;
  defaultLanguage?: string;
  availableLanguages?: string[];
  basePath?: string;
  storagePrefix?: string;
  enableGamification?: boolean;
  enableAnalytics?: boolean;
  theme?: {
    primaryColor?: string;
    darkMode?: boolean;
  };
  gamification?: {
    pointsPerLesson?: number;
    pointsPerQuiz?: number;
    badges?: Array<{ id: string; name: string; icon: string }>;
  };
  navigation?: Array<{ label: string | Record<string, string>; path: string }>;
  customPages?: Array<{ path: string; componentPath: string }>;
  plugins?: any[];
}

export function defineConfig(config: LearnMDConfig): LearnMDConfig {
  return config;
}

export function createLearnMD(config: LearnMDConfig = {}) {
  const {
    defaultLanguage = 'en',
    basePath = '',
    storagePrefix = 'learnmd',
    enableGamification = true,
    enableAnalytics = false,
    navigation = [],
    customPages = [],
    plugins = [],
  } = config;

  // Initialize i18n
  const i18n = initializeI18n(defaultLanguage, config.availableLanguages);

  // Initialize storage
  const storage = new StorageManager();

  // Initialize gamification
  const gamification = enableGamification ? new GamificationManager() : null;

  // Initialize router
  const router = new RouterManager();

  // Initialize plugins
  const pluginsRegistry = new PluginRegistry();
  
  const activePlugins = [...plugins];
  
  if (enableGamification) {
     activePlugins.unshift(new GamificationPlugin(config.gamification));
  }

  if (activePlugins.length > 0) {
    const ctx = createDefaultPluginContext({} as any, storage as any, i18n);
    // Bind context hooks to the actual registry so plugins can fire local hooks natively
    ctx.registerHook = (hook, fn) => pluginsRegistry.registerHook(hook, fn);
    (ctx as any).executeHook = (hook: string, ...args: any[]) => pluginsRegistry.executeHook(hook, ...args);

    activePlugins.forEach(p => {
       const plugin = typeof p === 'function' ? p() : p;
       pluginsRegistry.register(plugin, ctx).catch(console.error);
    });
    
    // Trigger init
    pluginsRegistry.executeHook('app:init').catch(console.error);
  }

  // Unified orchestration method
  const completeLesson = async (courseId: string, lessonSlug: string, options?: { totalLessons?: number, score?: number, passed?: boolean }) => {
     await storage.completeLesson(courseId, lessonSlug, options?.score, options?.passed);
     
     // 1. Notify listeners so GamificationPlugin can award points and badges
     await pluginsRegistry.executeHook(HOOKS.LESSON_COMPLETE, { courseId, lessonSlug, score: options?.score, passed: options?.passed });

     // 2. Refresh progress (which now has points)
     const progress = await storage.getCourseProgress(courseId);
     if (progress) {
       if (options?.totalLessons) {
          (progress as any).progressPercentage = Math.min(100, Math.round((Math.max(1, progress.completedLessons.length) / options.totalLessons) * 100));
          (progress as any).totalLessons = options.totalLessons;
       }
       if (options?.totalLessons && progress.completedLessons.length >= options.totalLessons && !progress.completedAt) {
          progress.completedAt = Date.now();
       }
       await storage.saveCourseProgress(progress);
       
       // 3. Notify that the unified progress block has updated
       await pluginsRegistry.executeHook(HOOKS.PROGRESS_UPDATE, progress);
     }
  };

  return {
    i18n,
    storage,
    gamification,
    router,
    plugins: pluginsRegistry,
    completeLesson,
    config: {
      defaultLanguage,
      basePath,
      storagePrefix,
      enableGamification,
      enableAnalytics,
      navigation,
      customPages,
      plugins,
    },
  };
}

export { LearnMDProvider, useLearnMD } from './components/LearnMDProvider.js';

/**
 * Default export
 */
export default {
  createLearnMD,
  VERSION,
};


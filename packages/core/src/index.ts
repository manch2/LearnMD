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

// MDX
export * from './mdx/index.js';

// LearnMD Context
export * from './components/LearnMDProvider.js';

import type { Config as LearnMDConfig } from './types/index.js';
export type { LearnMDConfig };
export type {
  PluginSlotName,
  PluginSlotComponentRegistration,
  ThemeConfig,
  GamificationConfig,
} from './types/index.js';

// Import class implementations for createLearnMD
import { initializeI18n } from './i18n/index.js';
import { StorageManager } from './storage/index.js';
import { GamificationPlugin } from './gamification/index.js';
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
export const VERSION = '0.0.4-beta.1';

export function defineConfig(config: LearnMDConfig): LearnMDConfig {
  return config;
}

export function createLearnMD(config: LearnMDConfig = {}) {
  const {
    defaultLanguage = 'en',
    basePath = '',
    storagePrefix = 'learnmd',
    enableAnalytics = false,
    navigation = [],
    customPages = [],
    plugins = [],
  } = config;

  // Initialize i18n
  const i18n = initializeI18n(defaultLanguage, config.availableLanguages);

  // Initialize storage
  const storage = new StorageManager(storagePrefix);

  // Initialize gamification
  const gamificationPlugin =
    config.gamification === false ? null : new GamificationPlugin(config.gamification);
  const gamification = gamificationPlugin?.manager || null;

  // Initialize router
  const router = new RouterManager();

  // Initialize plugins
  const pluginsRegistry = new PluginRegistry();

  const activePlugins = [...plugins];

  if (gamificationPlugin) {
    activePlugins.unshift(gamificationPlugin);
  }

  if (activePlugins.length > 0) {
    const ctx = createDefaultPluginContext({} as any, storage, i18n, config as Record<string, unknown>);
    // Bind context hooks to the actual registry so plugins can fire local hooks natively
    ctx.registerHook = (hook, fn) => pluginsRegistry.registerHook(hook, fn);
    ctx.registerComponent = (name, comp) => pluginsRegistry.registerComponent(name, comp);
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
      enableAnalytics,
      gamification: config.gamification ?? {},
      navigation,
      customPages,
      plugins,
      theme: config.theme,
      title: config.title,
      description: config.description,
      availableLanguages: config.availableLanguages,
    },
  };
}

/**
 * Default export
 */
export default {
  createLearnMD,
  VERSION,
};


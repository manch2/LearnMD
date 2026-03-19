// Types
export type * from './types/index.js';

// Parser
export * from './parser/index.js';

// i18n
export * from './i18n/index.js';

// Storage
export * from './storage/index.js';

// Gamification
export * from './gamification/index.js';

// Plugins
export * from './plugins/index.js';

// Router
export * from './router/index.js';

// Import class implementations for createLearnMD
import { I18nManager } from './i18n/index.js';
import { StorageManager } from './storage/index.js';
import { GamificationManager } from './gamification/index.js';
import { RouterManager } from './router/index.js';

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
export const VERSION = '0.0.1';

/**
 * Initialize LearnMD core with default configuration
 */
export interface LearnMDConfig {
  defaultLanguage?: string;
  basePath?: string;
  storagePrefix?: string;
  enableGamification?: boolean;
  enableAnalytics?: boolean;
}

export function createLearnMD(config: LearnMDConfig = {}) {
  const {
    defaultLanguage = 'en',
    basePath = '',
    storagePrefix = 'learnmd',
    enableGamification = true,
    enableAnalytics = false,
  } = config;

  // Initialize i18n
  const i18n = new I18nManager({
    defaultLanguage,
    availableLanguages: [defaultLanguage],
  });

  // Initialize storage
  const storage = new StorageManager();

  // Initialize gamification
  const gamification = enableGamification ? new GamificationManager() : null;

  // Initialize router
  const router = new RouterManager();

  return {
    i18n,
    storage,
    gamification,
    router,
    config: {
      defaultLanguage,
      basePath,
      storagePrefix,
      enableGamification,
      enableAnalytics,
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

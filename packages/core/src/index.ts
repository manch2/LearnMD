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
export const VERSION = '0.0.1-beta.1';

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
      navigation,
      customPages,
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


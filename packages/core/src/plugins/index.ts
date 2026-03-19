import type {
  Plugin,
  PluginContext,
  PluginConfig,
  Course,
  StorageAdapter,
  I18nAdapter,
} from '../types';

/**
 * Plugin registry
 */
export class PluginRegistry {
  private readonly plugins: Map<string, Plugin> = new Map();
  private readonly components: Map<string, unknown> = new Map();
  private readonly hooks: Map<string, Array<(...args: unknown[]) => unknown>> = new Map();

  /**
   * Register a plugin
   */
  async register(plugin: Plugin, context: PluginContext): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered`);
      return;
    }

    try {
      await plugin.onLoad(context);
      this.plugins.set(plugin.name, plugin);
      console.log(`Plugin "${plugin.name}" loaded successfully`);
    } catch (error) {
      console.error(`Failed to load plugin "${plugin.name}":`, error);
      throw error;
    }
  }

  /**
   * Unregister a plugin
   */
  async unregister(pluginName: string, context: PluginContext): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      console.warn(`Plugin "${pluginName}" is not registered`);
      return;
    }

    try {
      if (plugin.onUnload) {
        await plugin.onUnload(context);
      }
      this.plugins.delete(pluginName);
      console.log(`Plugin "${pluginName}" unloaded successfully`);
    } catch (error) {
      console.error(`Failed to unload plugin "${pluginName}":`, error);
      throw error;
    }
  }

  /**
   * Get a registered plugin
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Register a component from a plugin
   */
  registerComponent(name: string, component: unknown): void {
    this.components.set(name, component);
  }

  /**
   * Get a registered component
   */
  getComponent(name: string): unknown {
    return this.components.get(name);
  }

  /**
   * Get all registered components
   */
  getAllComponents(): Map<string, unknown> {
    return this.components;
  }

  /**
   * Register a hook
   */
  registerHook(hook: string, fn: (...args: unknown[]) => unknown): void {
    if (!this.hooks.has(hook)) {
      this.hooks.set(hook, []);
    }
    this.hooks.get(hook)!.push(fn);
  }

  /**
   * Execute all hooks for a given event
   */
  async executeHook<T>(hook: string, ...args: unknown[]): Promise<T[]> {
    const hookFunctions = this.hooks.get(hook) || [];
    const results: T[] = [];

    for (const fn of hookFunctions) {
      try {
        const result = await fn(...args);
        if (result !== undefined) {
          results.push(result as T);
        }
      } catch (error) {
        console.error(`Hook "${hook}" failed:`, error);
      }
    }

    return results;
  }

  /**
   * Check if a hook exists
   */
  hasHook(hook: string): boolean {
    return this.hooks.has(hook) && this.hooks.get(hook)!.length > 0;
  }

  /**
   * Clear all plugins and hooks
   */
  clear(): void {
    this.plugins.clear();
    this.components.clear();
    this.hooks.clear();
  }
}

/**
 * Create plugin context
 */
export function createPluginContext(
  course: Course,
  storage: StorageAdapter,
  i18n: I18nAdapter,
  registry: PluginRegistry,
  config: PluginConfig = {}
): PluginContext {
  return {
    course,
    storage,
    i18n,
    registerComponent: (name, component) => registry.registerComponent(name, component),
    registerHook: (hook, fn) => registry.registerHook(hook, fn),
    config,
  };
}

/**
 * Base plugin class for extending
 */
export abstract class BasePlugin implements Plugin {
  name: string;
  version: string;
  config?: PluginConfig;

  constructor(name: string, version: string, config?: PluginConfig) {
    this.name = name;
    this.version = version;
    this.config = config;
  }

  abstract onLoad(ctx: PluginContext): void | Promise<void>;
  onUnload?(ctx: PluginContext): void | Promise<void>;
}

/**
 * Analytics plugin interface
 */
export interface AnalyticsPlugin extends Plugin {
  trackEvent(event: string, properties?: Record<string, unknown>): void;
  trackPageView(page: string): void;
}

/**
 * Auth plugin interface
 */
export interface AuthPlugin extends Plugin {
  isAuthenticated(): boolean;
  getUser(): unknown | null;
  login(): Promise<void>;
  logout(): Promise<void>;
}

/**
 * Available hooks for plugins
 */
export const HOOKS = {
  /**
   * Called before a lesson is rendered
   */
  BEFORE_LESSON_RENDER: 'before:lesson:render',

  /**
   * Called after a lesson is rendered
   */
  AFTER_LESSON_RENDER: 'after:lesson:render',

  /**
   * Called before a quiz is submitted
   */
  BEFORE_QUIZ_SUBMIT: 'before:quiz:submit',

  /**
   * Called after a quiz is submitted
   */
  AFTER_QUIZ_SUBMIT: 'after:quiz:submit',

  /**
   * Called when a lesson is completed
   */
  LESSON_COMPLETE: 'lesson:complete',

  /**
   * Called when course progress is updated
   */
  PROGRESS_UPDATE: 'progress:update',

  /**
   * Called when language is changed
   */
  LANGUAGE_CHANGE: 'language:change',

  /**
   * Called before build starts
   */
  BEFORE_BUILD: 'before:build',

  /**
   * Called after build completes
   */
  AFTER_BUILD: 'after:build',
};

/**
 * Example: Analytics plugin implementation
 */
export class AnalyticsPluginImpl extends BasePlugin implements AnalyticsPlugin {
  constructor(config?: PluginConfig) {
    super('analytics', '1.0.0', config);
  }

  onLoad(ctx: PluginContext): void {
    ctx.registerHook(HOOKS.LESSON_COMPLETE, async (data) => {
      this.trackEvent('lesson_completed', data as Record<string, unknown>);
    });

    ctx.registerHook(HOOKS.AFTER_QUIZ_SUBMIT, async (data) => {
      this.trackEvent('quiz_submitted', data as Record<string, unknown>);
    });
  }

  trackEvent(event: string, properties?: Record<string, unknown>): void {
    const analyticsConfig = this.config as { trackingId?: string } | undefined;

    // Google Analytics example
    if (typeof window !== 'undefined' && analyticsConfig?.trackingId) {
      const win = window as unknown as Record<string, unknown>;
      win[`ga-${analyticsConfig.trackingId}`] = win[`ga-${analyticsConfig.trackingId}`] || [];
      (win[`ga-${analyticsConfig.trackingId}`] as unknown[]).push(['event', event, properties]);
    }

    console.log(`[Analytics] ${event}:`, properties);
  }

  trackPageView(page: string): void {
    this.trackEvent('page_view', { page });
  }
}

/**
 * Example: Search plugin implementation
 */
export class SearchPluginImpl extends BasePlugin {
  constructor(config?: PluginConfig) {
    super('search', '1.0.0', config);
  }

  onLoad(ctx: PluginContext): void {
    // Register search component
    ctx.registerComponent('SearchBar', SearchBarComponent);
  }
}

/**
 * Placeholder search bar component
 */
function SearchBarComponent(): unknown {
  return { type: 'component', name: 'SearchBar' };
}

/**
 * Load plugins from configuration
 */
export async function loadPlugins(
  plugins: Array<Plugin | (() => Plugin)>,
  context: PluginContext
): Promise<PluginRegistry> {
  const registry = new PluginRegistry();

  for (const plugin of plugins) {
    const p = typeof plugin === 'function' ? plugin() : plugin;
    await registry.register(p, context);
  }

  return registry;
}

/**
 * Create default plugin context with common utilities
 */
export function createDefaultPluginContext(
  course: Course,
  storage: StorageAdapter,
  i18n: I18nAdapter
): PluginContext {
  const registry = new PluginRegistry();

  return {
    course,
    storage,
    i18n,
    registerComponent: (name, component) => registry.registerComponent(name, component),
    registerHook: (hook, fn) => registry.registerHook(hook, fn),
    config: {},
  };
}

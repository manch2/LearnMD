import { describe, it, expect, vi } from 'vitest';
import {
  BasePlugin,
  PluginRegistry,
  createPluginContext,
  HOOKS,
  type PluginContext,
} from './index';
import type { Course, LearnMDStorage, I18nAdapter } from '../types';

class TestPlugin extends BasePlugin {
  constructor() {
    super('test-plugin', '1.0.0');
  }

  onLoad(ctx: PluginContext): void {
    ctx.registerComponent({
      slot: 'profile:summary',
      name: 'summary-card',
      order: 20,
      component: () => null,
      metadata: { source: 'test' },
    });

    ctx.registerHook(HOOKS.PROGRESS_UPDATE, () => 'updated');
  }
}

function createMocks() {
  const course: Course = {
    id: 'demo-course',
    title: { en: 'Demo Course', es: 'Curso Demo' },
    lessons: [],
    modules: [],
    frontmatter: { title: 'Demo Course' },
    basePath: '/courses/demo-course',
  };

  const storage: LearnMDStorage = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn().mockResolvedValue([]),
    getUserProfile: vi.fn(),
    saveUserProfile: vi.fn(),
    getCourseProgress: vi.fn(),
    saveCourseProgress: vi.fn(),
    getAllCourseProgress: vi.fn(),
    getLessonProgress: vi.fn(),
    updateLessonProgress: vi.fn(),
    completeLesson: vi.fn(),
  } as unknown as LearnMDStorage;

  const i18n: I18nAdapter = {
    currentLanguage: 'en',
    availableLanguages: ['en', 'es'],
    setLanguage: vi.fn(),
    translate: vi.fn((key: string) => key),
    translateObject: vi.fn((obj) => obj),
  };

  return { course, storage, i18n };
}

describe('PluginRegistry', () => {
  it('registers slot components and executes hooks through the plugin context', async () => {
    const registry = new PluginRegistry();
    const { course, storage, i18n } = createMocks();
    const context = createPluginContext(course, storage, i18n, registry, { enabled: true });

    await registry.register(new TestPlugin(), context);

    const slotComponents = registry.getSlotComponents('profile:summary');
    expect(slotComponents).toHaveLength(1);
    expect(slotComponents[0]?.name).toBe('summary-card');
    expect(slotComponents[0]?.metadata).toEqual({ source: 'test' });

    const results = await registry.executeHook<string>(HOOKS.PROGRESS_UPDATE);
    expect(results).toEqual(['updated']);
  });

  it('sorts slot components by order and clears state', () => {
    const registry = new PluginRegistry();

    registry.registerComponent({
      slot: 'profile:sections',
      name: 'late',
      order: 50,
      component: () => null,
    });
    registry.registerComponent({
      slot: 'profile:sections',
      name: 'early',
      order: 10,
      component: () => null,
    });

    expect(registry.getSlotComponents('profile:sections').map((item) => item.name)).toEqual([
      'early',
      'late',
    ]);

    registry.clear();
    expect(registry.getSlotComponents('profile:sections')).toEqual([]);
    expect(registry.getAllPlugins()).toEqual([]);
  });
});

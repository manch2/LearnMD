import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createLearnMD, defineConfig } from './index';

describe('defineConfig', () => {
  it('returns the same config object back', () => {
    const config = defineConfig({ title: 'LearnMD Docs', defaultLanguage: 'es' });
    expect(config.title).toBe('LearnMD Docs');
    expect(config.defaultLanguage).toBe('es');
  });
});

describe('createLearnMD', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    });
  });

  it('registers configured plugins and built-in gamification by default', async () => {
    const onLoad = vi.fn();
    const app = createLearnMD({
      defaultLanguage: 'es',
      availableLanguages: ['en', 'es'],
      theme: { contentMaxWidth: '72rem' },
      plugins: [
        {
          name: 'test-plugin',
          version: '1.0.0',
          onLoad,
        },
      ],
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(app.config.defaultLanguage).toBe('es');
    expect(app.config.theme?.contentMaxWidth).toBe('72rem');
    expect(app.gamification).not.toBeNull();
    expect(onLoad).toHaveBeenCalled();
    expect(app.plugins.getPlugin('test-plugin')).toBeDefined();
    expect(app.plugins.getPlugin('gamification')).toBeDefined();
  });

  it('can disable built-in gamification explicitly', () => {
    const app = createLearnMD({
      gamification: false,
    });

    expect(app.gamification).toBeNull();
    expect(app.plugins.getPlugin('gamification')).toBeUndefined();
  });
});

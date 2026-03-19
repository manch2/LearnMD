import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nManager } from './index';

describe('I18nManager', () => {
  let i18n: I18nManager;

  beforeEach(() => {
    i18n = new I18nManager({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'es'],
      translations: {
        en: { 'test.key': 'Test' },
        es: { 'test.key': 'Prueba' }
      }
    });

    // Mock window for event emitting
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
  });

  it('should initialize with correct default language', () => {
    expect(i18n.currentLanguage).toBe('en');
    expect(i18n.availableLanguages).toEqual(['en', 'es']);
  });

  it('should switch language', () => {
    i18n.setLanguage('es');
    expect(i18n.currentLanguage).toBe('es');
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  it('should not switch to unavailable language', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    i18n.setLanguage('fr');
    expect(i18n.currentLanguage).toBe('en');
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should translate keys correctly', () => {
    expect(i18n.translate('test.key')).toBe('Test');
    expect(i18n.translate('test.key', 'es')).toBe('Prueba');
  });

  it('should fallback to default language if translation missing', () => {
    i18n.addTranslations('es', {});
    expect(i18n.translate('test.key', 'es')).toBe('Prueba'); // Existing
    expect(i18n.translate('missing.key', 'es')).toBe('missing.key');
  });

  it('should translate objects recursively', () => {
    const obj = {
      title: { en: 'Title', es: 'Título' },
      info: {
        desc: { en: 'Desc', es: 'Desc-es' },
        count: 10
      }
    };

    const translated = i18n.translateObject(obj, 'es');
    expect(translated.title).toBe('Título');
    expect(translated.info.desc).toBe('Desc-es');
    expect(translated.info.count).toBe(10);
  });

  it('should extract and process translatable paragraphs', () => {
    const content = `<Paragraph i18n="p1"><en>English</en><es>Español</es></Paragraph>`;
    const processed = i18n.processContent(content);
    
    expect(processed).toContain('data-i18n="p1"');
    expect(processed).toContain('English');
    
    i18n.setLanguage('es');
    const processedEs = i18n.processContent(content);
    expect(processedEs).toContain('Español');
  });

  it('should extract translatable paragraphs', () => {
    const content = `<Paragraph i18n="p1"><en>Hello</en><es>Hola</es></Paragraph>`;
    const extracted = i18n.extractTranslatableParagraphs(content);
    
    expect(extracted).toHaveLength(1);
    expect(extracted[0].key).toBe('p1');
    expect(extracted[0].translations.en).toBe('Hello');
    expect(extracted[0].translations.es).toBe('Hola');
  });
});

import { describe, it, expect } from 'vitest';
import { I18nManager, createI18n, initializeI18n } from '../i18n';

describe('I18nManager', () => {
  it('should create instance with default language', () => {
    const i18n = createI18n();
    expect(i18n.currentLanguage).toBe('en');
    expect(i18n.availableLanguages).toEqual(['en']);
  });

  it('should create instance with custom config', () => {
    const i18n = createI18n({
      defaultLanguage: 'es',
      availableLanguages: ['en', 'es', 'fr'],
    });
    expect(i18n.currentLanguage).toBe('es');
    expect(i18n.availableLanguages).toContain('es');
  });

  it('should set language', () => {
    const i18n = createI18n({
      availableLanguages: ['en', 'es'],
    });
    i18n.setLanguage('es');
    expect(i18n.currentLanguage).toBe('es');
  });

  it('should add translations', () => {
    const i18n = createI18n();
    i18n.addTranslations('es', {
      greeting: 'Hola',
      farewell: 'Adiós',
    });

    expect(i18n.translate('greeting', 'es')).toBe('Hola');
    expect(i18n.translate('farewell', 'es')).toBe('Adiós');
  });

  it('should translate keys', () => {
    const i18n = createI18n();
    i18n.addTranslations('en', {
      hello: 'Hello World',
    });

    expect(i18n.translate('hello')).toBe('Hello World');
    expect(i18n.translate('unknown')).toBe('unknown');
  });

  it('should translate objects', () => {
    const i18n = createI18n({
      defaultLanguage: 'en',
    });
    i18n.addTranslations('en', {
      greeting: 'Hello',
    });
    i18n.addTranslations('es', {
      greeting: 'Hola',
    });

    i18n.setLanguage('es');

    const obj = {
      title: 'Test',
      greeting: { en: 'Hello', es: 'Hola' },
    };

    const translated = i18n.translateObject(obj);
    expect(translated.greeting).toBe('Hola');
  });
});

describe('initializeI18n', () => {
  it('should initialize with common translations', () => {
    const i18n = initializeI18n();

    expect(i18n.translate('nav.home', 'en')).toBe('Home');
    expect(i18n.translate('nav.home', 'es')).toBe('Inicio');
  });
});

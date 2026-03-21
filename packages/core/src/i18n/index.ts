import type { I18nAdapter, TranslatedString, I18nConfig } from '../types';

/**
 * Default translations store
 */
interface TranslationStore {
  [lang: string]: {
    [key: string]: string;
  };
}

/**
 * i18n Manager class
 */
export class I18nManager implements I18nAdapter {
  private _currentLanguage: string;
  private readonly _availableLanguages: string[];
  private readonly _translations: TranslationStore;
  private readonly _config: I18nConfig | null = null;

  constructor(config?: I18nConfig) {
    this._currentLanguage = config?.defaultLanguage || 'en';
    this._availableLanguages = config?.availableLanguages || ['en'];
    this._translations = {};

    if (config?.translations) {
      this._translations = config.translations;
    }

    this._config = config || null;
  }

  get currentLanguage(): string {
    return this._currentLanguage;
  }

  get availableLanguages(): string[] {
    return this._availableLanguages;
  }

  /**
   * Set the current language
   */
  setLanguage(lang: string): void {
    if (this._availableLanguages.includes(lang)) {
      this._currentLanguage = lang;
      this.emitLanguageChange(lang);
    } else {
      console.warn(
        `Language "${lang}" is not available. Available: ${this._availableLanguages.join(', ')}`
      );
    }
  }

  /**
   * Add translations for a language
   */
  addTranslations(lang: string, translations: Record<string, string>): void {
    if (!this._translations[lang]) {
      this._translations[lang] = {};
    }
    this._translations[lang] = { ...this._translations[lang], ...translations };

    if (!this._availableLanguages.includes(lang)) {
      this._availableLanguages.push(lang);
    }
  }

  /**
   * Translate a key to current language
   */
  translate(key: string, lang?: string): string {
    const targetLang = lang || this._currentLanguage;
    const translation = this._translations[targetLang]?.[key];

    if (translation) {
      return translation;
    }

    // Fallback to default language
    const defaultLang = this._config?.defaultLanguage || 'en';
    const fallback = this._translations[defaultLang]?.[key];

    if (fallback) {
      return fallback;
    }

    // Return key if no translation found
    return key;
  }

  /**
   * Translate an object with translatable strings
   */
  translateObject<T extends Record<string, unknown>>(obj: T, lang?: string): T {
    const targetLang = lang || this._currentLanguage;
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (this.isTranslatedString(value)) {
        result[key] = value[targetLang] || value[Object.keys(value)[0]];
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.translateObject(value as Record<string, unknown>, lang);
      } else {
        result[key] = value;
      }
    }

    return result as T;
  }

  /**
   * Check if a value is a translated string
   */
  private isTranslatedString(value: unknown): value is TranslatedString {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const keys = Object.keys(value);
    return keys.length > 0 && keys.every((k) => k.length === 2); // Language codes are typically 2 chars
  }

  /**
   * Get paragraph-level translation
   * Format: <Paragraph i18n="key"><en>Text</en><es>Texto</es></Paragraph>
   */
  getParagraphTranslation(paragraphContent: string): string {
    const tagContents = `[^<]*(?:<(?!<\\/${this._currentLanguage}>)[^<]*)*`;
    const langRegex = new RegExp(`<${this._currentLanguage}>(${tagContents})<\\/${this._currentLanguage}>`, "g");
    const match = langRegex.exec(paragraphContent);

    if (match) {
      return match[1].trim();
    }

    // Fallback to first available language
    const fallbackRegex = /<(\w{2})>([^<]*(?:<(?!<\/\1>)[^<]*)*)<\/\1>/;
    const fallbackMatch = fallbackRegex.exec(paragraphContent);

    if (fallbackMatch) {
      return fallbackMatch[2].trim();
    }

    return paragraphContent;
  }

  /**
   * Extract all translatable paragraphs from content
   */
  extractTranslatableParagraphs(
    content: string
  ): Array<{ key: string; translations: Record<string, string> }> {
    const paragraphs: Array<{ key: string; translations: Record<string, string> }> = [];
    const paragraphRegex = /<Paragraph\s+i18n=["']([^"']*)["']\s*>([^<]*(?:<(?!<\/Paragraph>)[^<]*)*)<\/Paragraph>/g;
    let match;

    while ((match = paragraphRegex.exec(content)) !== null) {
      const key = match[1];
      const content_ = match[2];
      const translations: Record<string, string> = {};

      const langRegex = /<(\w{2})>([\s\S]*?)<\/\1>/g;
      let langMatch;

      while ((langMatch = langRegex.exec(content_)) !== null) {
        translations[langMatch[1]] = langMatch[2].trim();
      }

      paragraphs.push({ key, translations });
    }

    return paragraphs;
  }

  /**
   * Process content and replace translatable paragraphs
   */
  processContent(content: string): string {
    return content.replace(
      /<Paragraph\s+i18n=["']([^"']*)["']\s*>([^<]*(?:<(?!<\/Paragraph>)[^<]*)*)<\/Paragraph>/g,
      (_match, key, content_) => {
        const translated = this.getParagraphTranslation(content_);
        return `<p data-i18n="${key}">${translated}</p>`;
      }
    );
  }

  /**
   * Event listener for language changes
   */
  private emitLanguageChange(lang: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('learnmd:languageChange', { detail: { language: lang } })
      );
    }
  }

  /**
   * Subscribe to language changes
   */
  onLanguageChange(callback: (lang: string) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail.language);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('learnmd:languageChange', handler as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('learnmd:languageChange', handler as EventListener);
      }
    };
  }
}

/**
 * Create i18n instance with configuration
 */
export function createI18n(config?: I18nConfig): I18nManager {
  return new I18nManager(config);
}

/**
 * Common translation keys
 */
export const COMMON_TRANSLATIONS = {
  en: {
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.progress': 'Progress',
    'nav.settings': 'Settings',
    'course.start': 'Start Course',
    'course.continue': 'Continue',
    'course.completed': 'Completed',
    'lesson.next': 'Next Lesson',
    'lesson.previous': 'Previous Lesson',
    'quiz.submit': 'Submit Answer',
    'quiz.correct': 'Correct!',
    'quiz.incorrect': 'Incorrect',
    'quiz.retry': 'Try Again',
    'progress.completed': 'Completed',
    'progress.of': 'of',
    'search.placeholder': 'Search courses...',
    'search.noResults': 'No results found',
    'badge.earned': 'Badge Earned!',
    'points.earned': 'Points Earned',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'catalog.title': 'Course Catalog',
    'catalog.available': 'Available Courses',
    'catalog.empty': 'No courses available yet. Add some courses in the \'courses/\' folder!',
    'catalog.lessons_inside': 'lessons inside',
    'profile.back': '« Back to Catalog',
    'profile.account': 'Your Account',
    'profile.update_info': 'Update your basic information',
    'profile.full_name': 'Full Name',
    'profile.email': 'Email Address',
    'profile.saved': '✅ Profile saved successfully!',
    'profile.saving': 'Saving...',
    'profile.save': 'Save Changes',
    'profile.history': 'Metrics & History',
    'profile.in_progress': 'In Progress / Completed',
    'profile.points': 'Points',
    'profile.download': 'Download Certificate',
    'profile.no_progress': 'No course progress yet.',
    'profile.badges': 'Badges Earned',
    'profile.no_badges': 'No badges earned yet. Keep learning!',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.courses': 'Cursos',
    'nav.progress': 'Progreso',
    'nav.settings': 'Configuración',
    'course.start': 'Iniciar Curso',
    'course.continue': 'Continuar',
    'course.completed': 'Completado',
    'lesson.next': 'Siguiente Lección',
    'lesson.previous': 'Lección Anterior',
    'quiz.submit': 'Enviar Respuesta',
    'quiz.correct': '¡Correcto!',
    'quiz.incorrect': 'Incorrecto',
    'quiz.retry': 'Intentar de Nuevo',
    'progress.completed': 'Completado',
    'progress.of': 'de',
    'search.placeholder': 'Buscar cursos...',
    'search.noResults': 'No se encontraron resultados',
    'badge.earned': '¡Insignia Obtenida!',
    'points.earned': 'Puntos Obtenidos',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.system': 'Sistema',
    'catalog.title': 'Catálogo de Cursos',
    'catalog.available': 'Cursos Disponibles',
    'catalog.empty': 'Aún no hay cursos. ¡Añade algunos en la carpeta \'courses/\'!',
    'catalog.lessons_inside': 'lecciones dentro',
    'profile.back': '« Volver al Catálogo',
    'profile.account': 'Tu Cuenta',
    'profile.update_info': 'Actualiza tu información básica',
    'profile.full_name': 'Nombre Completo',
    'profile.email': 'Correo Electrónico',
    'profile.saved': '✅ ¡Perfil guardado con éxito!',
    'profile.saving': 'Guardando...',
    'profile.save': 'Guardar Cambios',
    'profile.history': 'Métricas e Historial',
    'profile.in_progress': 'En Progreso / Completado',
    'profile.points': 'Puntos',
    'profile.download': 'Descargar Certificado',
    'profile.no_progress': 'Sin progreso en cursos aún.',
    'profile.badges': 'Insignias Obtenidas',
    'profile.no_badges': 'Aún no has obtenido insignias. ¡Sigue aprendiendo!',
  },
};

/**
 * Initialize i18n with common translations
 */
export function initializeI18n(defaultLanguage = 'en', availableLanguages?: string[]): I18nManager {
  const i18n = createI18n({
    defaultLanguage,
    availableLanguages: availableLanguages || ['en', 'es'],
  });

  // Add common translations
  Object.entries(COMMON_TRANSLATIONS).forEach(([lang, translations]) => {
    i18n.addTranslations(lang, translations);
  });

  return i18n;
}

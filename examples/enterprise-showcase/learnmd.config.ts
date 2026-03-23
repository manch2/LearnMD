import { defineConfig } from '@learnmd/core';
import { BadgesPlugin } from '@learnmd/plugin-badges';
import { PDFPlugin } from '@learnmd/plugin-pdf';

export default defineConfig({
  title: 'LearnMD Enterprise Showcase',
  description: 'Un ejemplo oficial que demuestra todas las capacidades de LearnMD.',
  defaultLanguage: 'es',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#10b981', // Emerald
    darkMode: true,
  },
  navigation: [
    { label: { en: 'Catalog', es: 'Catálogo' }, path: '/' },
    { label: { en: 'About Us', es: 'Nosotros' }, path: '/about' },
    { label: { en: 'Support', es: 'Soporte' }, path: '/support' },
    { label: { en: 'Account', es: 'Mi Cuenta' }, path: '/profile' }
  ],
  customPages: [
    { path: '/about', componentPath: 'pages/about.mdx' },
    { path: '/support', componentPath: 'pages/support.mdx' }
  ],
  plugins: [
    new PDFPlugin(),
    new BadgesPlugin([
      {
        id: 'new-star',
        name: 'Nueva Estrella',
        description: 'Has iniciado tu proceso de onboarding.',
        icon: '🌟',
        criteria: { type: 'course_progress', courseId: 'micro-onboarding', percentage: 1 }
      },
      {
        id: 'rising-expert',
        name: 'Experto en Crecimiento',
        description: 'Has alcanzado el 50% de la maestría total.',
        icon: '📈',
        criteria: { type: 'course_progress', courseId: 'full-mastery', percentage: 50 }
      },
      {
        id: 'master-architect',
        name: 'Arquitecto Maestro',
        description: 'Has completado todos los requisitos del showcase.',
        icon: '🏰',
        criteria: { type: 'courses_completed', count: 2 }
      }
    ])
  ]
});

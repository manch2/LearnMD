import { defineConfig } from '@learnmd/core';
import { BadgesPlugin } from '@learnmd/plugin-badges';
import { PDFPlugin } from '@learnmd/plugin-pdf';

export default defineConfig({
  title: 'LearnMD Ultimate Showcase',
  description: 'Demostración completa con todas las capacidades del CLI, plugins y traducciones.',
  defaultLanguage: 'es',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#0ea5e9', // Teal/Cyan
    darkMode: true,
  },
  navigation: [
    { label: { en: 'Catalog', es: 'Catálogo' }, path: '/' },
    { label: { en: 'About Us', es: 'Nosotros' }, path: '/about' },
    { label: { en: 'Support', es: 'Soporte' }, path: '/support' }
  ],
  customPages: [
    { path: '/about', componentPath: 'pages/about.mdx' },
    { path: '/support', componentPath: 'pages/support.mdx' }
  ],
  plugins: [
    new PDFPlugin(),
    new BadgesPlugin([
      {
        id: 'start-badge',
        name: { en: 'Quick Starter', es: 'Iniciador Veloz' },
        description: { en: 'You started the Express course.', es: 'Has iniciado el curso Express.' },
        icon: '🚀',
        criteria: { type: 'course_progress', courseId: 'express-onboarding', percentage: 1 }
      },
      {
        id: 'halfway-badge',
        name: { en: 'Architect in Training', es: 'Arquitecto en Formación' },
        description: { en: 'Reached 50% of Deep Architecture.', es: 'Alcanzaste el 50% de Arquitectura Profunda.' },
        icon: '🏗️',
        criteria: { type: 'course_progress', courseId: 'deep-architecture', percentage: 50 }
      },
      {
        id: 'master-badge',
        name: { en: 'LearnMD Legend', es: 'Leyenda de LearnMD' },
        description: { en: 'Completed all courses in this showcase.', es: 'Completaste todos los cursos de la demostración.' },
        icon: '🌟',
        criteria: { type: 'courses_completed', count: 2 }
      }
    ])
  ]
});

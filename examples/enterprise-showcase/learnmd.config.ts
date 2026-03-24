import { defineConfig } from '@learnmd/core';
import { BadgesPlugin } from '@learnmd/plugin-badges';
import { PDFPlugin } from '@learnmd/plugin-pdf';

export default defineConfig({
  title: 'LearnMD Ultimate Showcase',
  description: 'Demostración completa con todas las capacidades del CLI, plugins y traducciones.',
  defaultLanguage: 'en',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#8b5cf6', // Violet
    darkMode: true,
  },
  navigation: [
    { label: 'Catalog', path: '/' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Support', path: '/support' }
  ],
  customPages: [
    { path: '/about-us', componentPath: 'pages/about-us.mdx' },
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

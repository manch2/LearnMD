import { defineConfig } from '@learnmd/core';
import { BadgesPlugin } from '@learnmd/plugin-badges';
import { PDFPlugin } from '@learnmd/plugin-pdf';
import { CustomBrandCertificate } from './src/components/certificates/CustomBrandCertificate';

export default defineConfig({
  title: 'LearnMD Enterprise Full Showcase',
  description: 'A CLI-generated enterprise showcase for plugins, bilingual content, and shared layouts.',
  defaultLanguage: 'en',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#0f766e',
    secondaryColor: '#2563eb',
    headingFontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
    contentMaxWidth: '72rem',
    logoText: 'LearnMD Enterprise',
    darkMode: {
      enabled: true,
      backgroundColor: '#0f172a',
      surfaceColor: '#111827',
      textColor: '#e5e7eb',
      mutedTextColor: '#94a3b8',
    },
  },
  gamification: {
    points: {
      lessonCompletion: 100,
      quizPassed: 10,
      quizPerfectScore: 25,
    },
  },
  navigation: [
    { label: { en: 'Catalog', es: 'Catálogo' }, path: '/' },
    { label: { en: 'About Us', es: 'Sobre nosotros' }, path: '/about-us' },
    { label: { en: 'Support', es: 'Soporte' }, path: '/support' },
  ],
  customPages: [
    { path: '/about-us', componentPath: 'pages/about-us.mdx' },
    { path: '/support', componentPath: 'pages/support.mdx' },
  ],
  plugins: [
    new PDFPlugin({
      signature: 'LearnMD Enterprise Team',
      defaultTemplate: 'classic',
      courseTemplates: {
        'express-onboarding': 'classic',
        'deep-architecture': CustomBrandCertificate
      }
    }),
    new BadgesPlugin([
      {
        id: 'fast-start',
        name: { en: 'Fast Start', es: 'Inicio rápido' },
        description: { en: 'Start the onboarding course.', es: 'Inicia el curso de onboarding.' },
        icon: '🚀',
        criteria: { type: 'course_progress', courseId: 'express-onboarding', percentage: 1 },
      },
      {
        id: 'architect-track',
        name: { en: 'Architect Track', es: 'Ruta de arquitectura' },
        description: { en: 'Reach 300 global points.', es: 'Alcanza 300 puntos globales.' },
        icon: '🏗️',
        criteria: { type: 'global_score', score: 300 },
      },
      {
        id: 'showcase-complete',
        name: { en: 'Showcase Complete', es: 'Showcase completado' },
        description: { en: 'Complete both example courses.', es: 'Completa ambos cursos del ejemplo.' },
        icon: '🌟',
        criteria: { type: 'courses_completed', count: 2 },
      },
    ]),
  ],
});

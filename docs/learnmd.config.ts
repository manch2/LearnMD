import { defineConfig } from '@learnmd/core';

export default defineConfig({
  title: 'LearnMD Documentation',
  description: 'The official documentation for the LearnMD framework.',
  defaultLanguage: 'en',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#3b82f6',
    darkMode: true,
  },
  gamification: {
    pointsPerLesson: 100,
    pointsPerQuiz: 10,
    badges: [
      { id: 'first-lesson', name: 'First Steps', icon: '🚀' },
      { id: 'quiz-master', name: 'Quiz Master', icon: '🏆' },
      { id: 'course-complete', name: 'Course Graduate', icon: '🎓' },
    ],
  },
  navigation: [
    { label: { en: 'Getting Started', es: 'Primeros Pasos' }, path: '/getting-started' },
    { label: { en: 'CLI Reference', es: 'Referencia CLI' }, path: '/cli-reference' },
    { label: { en: 'Configuration', es: 'Configuración' }, path: '/configuration' },
    { label: { en: 'Components', es: 'Componentes' }, path: '/components' },
    { label: { en: 'Plugins', es: 'Plugins' }, path: '/plugins' },
    { label: { en: 'AI Integration', es: 'Integración IA' }, path: '/ai-integration' },
    { label: { en: 'Architecture', es: 'Arquitectura' }, path: '/architecture' },
    { label: { en: 'License', es: 'Licencia' }, path: '/license' },
  ],
  customPages: [
    { path: '/getting-started', componentPath: 'pages/getting-started.mdx' },
    { path: '/cli-reference', componentPath: 'pages/cli-reference.mdx' },
    { path: '/configuration', componentPath: 'pages/configuration.mdx' },
    { path: '/components', componentPath: 'pages/components.mdx' },
    { path: '/plugins', componentPath: 'pages/plugins.mdx' },
    { path: '/ai-integration', componentPath: 'pages/ai-integration.mdx' },
    { path: '/architecture', componentPath: 'pages/architecture-overview.mdx' },
    { path: '/license', componentPath: 'pages/license.mdx' },
  ],
});

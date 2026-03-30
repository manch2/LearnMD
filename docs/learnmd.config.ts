import { defineConfig } from '@learnmd/core';

export default defineConfig({
  title: 'LearnMD Documentation',
  description: 'The official documentation for the LearnMD framework.',
  defaultLanguage: 'en',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#14b8a6',
    fontFamily: '"Inter", system-ui, sans-serif',
    headingFontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
    contentMaxWidth: '72rem',
    logoText: 'LearnMD Docs',
    darkMode: {
      enabled: true,
      backgroundColor: '#0f172a',
      surfaceColor: '#1e293b',
      textColor: '#e2e8f0',
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

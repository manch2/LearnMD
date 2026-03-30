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
    { label: 'Getting Started', path: '/getting-started' },
    { label: 'Architecture', path: '/architecture' },
    { label: 'License', path: '/license' },
  ],
  customPages: [
    { path: '/getting-started', componentPath: 'pages/getting-started.mdx' },
    { path: '/architecture', componentPath: 'pages/architecture-overview.mdx' },
    { path: '/license', componentPath: 'pages/license.mdx' },
  ],
});

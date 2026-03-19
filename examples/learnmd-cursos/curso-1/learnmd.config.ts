import { defineConfig } from '@learnmd/core';

export default defineConfig({
  title: 'LearnMD Course',
  description: 'An interactive course built with LearnMD',
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
});

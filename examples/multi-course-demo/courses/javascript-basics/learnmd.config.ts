import { defineConfig } from '@learnmd/core';

export default defineConfig({
  title: 'JavaScript Basics',
  description: 'Learn the fundamentals of JavaScript programming',
  defaultLanguage: 'en',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#f7df1e',
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

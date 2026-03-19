/// <reference types="vite/client" />
import { LearnMDProvider } from '@learnmd/core';
import { CatalogViewer, CourseViewer, ProfileViewer } from '@learnmd/default-theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import config from '../learnmd.config';

// Glob all markdown files dynamically across all courses
const lessonModules = import.meta.glob('../courses/*/lessons/*.mdx', { eager: true });
const allLessons = Object.entries(lessonModules).map(([path, mod]) => {
  const parts = path.split('/');
  const courseSlug = parts[2];
  const lessonSlug = parts[4].replace('.mdx', '');
  return {
    courseSlug,
    slug: lessonSlug,
    Component: (mod as any).default as React.ComponentType,
    frontmatter: (mod as any).frontmatter || {}
  };
});

function App() {
  return (
    <LearnMDProvider config={config}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CatalogViewer courses={allLessons} />} />
          <Route path="/profile" element={<ProfileViewer />} />
          <Route path="/courses/:courseId/*" element={<CourseViewer allLessons={allLessons} />} />
        </Routes>
      </BrowserRouter>
    </LearnMDProvider>
  );
}

export default App;

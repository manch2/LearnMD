/// <reference types="vite/client" />
import { LearnMDProvider } from '@learnmd/core';
import { CourseViewer } from '@learnmd/default-theme';
import config from '../learnmd.config';

// Glob all markdown files dynamically as MDX components
const lessonModules = import.meta.glob('../lessons/*.mdx', { eager: true });
const lessons = Object.entries(lessonModules).map(([path, mod]) => ({
  slug: path.replace('../lessons/', '').replace('.mdx', ''),
  Component: (mod as any).default as React.ComponentType,
  frontmatter: (mod as any).frontmatter || {}
}));

function App() {
  return (
    <LearnMDProvider config={config}>
      <CourseViewer lessons={lessons} />
    </LearnMDProvider>
  );
}

export default App;

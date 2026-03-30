/// <reference types="vite/client" />
import { LearnMDProvider } from '@learnmd/core';
import { CatalogViewer, CourseViewer, ProfileViewer, MainLayout, Header, Callout, Quiz, VideoEmbed, Progress, LanguageSwitcher, Paragraph, Title } from '@learnmd/default-theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import config from '../learnmd.config';

const components = {
  Callout,
  Quiz,
  VideoEmbed,
  Progress,
  LanguageSwitcher,
  Paragraph,
  Title,
};

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

// Load Course Configurations (learnmd.json)
const courseConfigsRaw = import.meta.glob('../courses/*/learnmd.json', { eager: true });
const coursesConfig = Object.entries(courseConfigsRaw).reduce((acc, [path, mod]) => {
  const courseSlug = path.split('/')[2];
  acc[courseSlug] = { id: courseSlug, ...(mod as any).default || mod };
  return acc;
}, {} as Record<string, any>);

// Optional: Load Home Page MDX
const homeModule = import.meta.glob('../home.mdx', { eager: true });
const HomeComponent = Object.values(homeModule)[0] ? (Object.values(homeModule)[0] as any).default : undefined;

// Load Custom Pages dynamically
const pageModules = import.meta.glob('../pages/*.mdx', { eager: true });

function App() {
  return (
    <LearnMDProvider config={config}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<CatalogViewer courses={allLessons} HomeComponent={HomeComponent} />} />
          <Route path="/profile" element={
            <MainLayout title="Profile">
              <Header title="User Profile" />
              <ProfileViewer />
            </MainLayout>
          } />
          <Route path="/courses/:courseId/*" element={<CourseViewer allLessons={allLessons} coursesConfig={coursesConfig} />} />

          {config.customPages?.map((page, idx) => {
            // Map standard pages path to dynamic import
            const modKey = `../${page.componentPath}`;
            const mod = pageModules[modKey];
            const Component = mod ? (mod as any).default : () => <div>Page not found</div>;
            return (
              <Route key={idx} path={page.path} element={
                <MainLayout>
                  <Header />
                  <div className="prose dark:prose-invert container mx-auto px-4 py-8 max-w-4xl">
                    <MDXProvider components={components}>
                      <Component />
                    </MDXProvider>
                  </div>
                </MainLayout>
              } />
            );
          })}
        </Routes>
      </BrowserRouter>
    </LearnMDProvider>
  );
}

export default App;

# LearnMD Theme Architecture Guide

## Is the current architecture adequate?

Yes! The architectural split between `@learnmd/core` and `@learnmd/default-theme` is highly optimal. 
By isolating the Markdown parser, gamification logic, storage engines, i18n, and router mechanics inside `@learnmd/core`, you ensure that the complex background mechanics are untouched when building UI.

A theme is effectively just a set of React Components using the \`useLearnMD()\` hook to pull state and call functions, injected into Vite.

## How to create a new Theme

Creating a new theme in LearnMD is straightforward. You do not need to rewrite the gamification logic or parse MDX. 

### 1. Scaffold a React Library
Initialize a new package inside your workspace (or externally if distributing it).

### 2. Wrap your layout in Provider Context
Any component that renders course content must either sit inside \`<LearnMDProvider>\` or you can instantiate the core engine yourself using \`createLearnMD()\`.

\`\`\`tsx
import { useLearnMD } from '@learnmd/core';

export function MyCustomCourseLayout({ children }) {
  const { config, storage, gamification, router } = useLearnMD();

  return (
    <div className="my-cool-theme">
      <nav>{/* Build your custom navigation */}</nav>
      <main>
        {children} {/* This will be your compiled MDX content! */}
      </main>
    </div>
  )
}
\`\`\`

### 3. Provide Essential Components
You should export standard UI blocks that your MDX files use, for instance:
- \`<Callout />\`
- \`<Quiz />\`
- \`<GamificationSummary />\`
- \`<Progress />\`
- \`<VideoEmbed />\`

Because these are just React components, you can style them using TailwindCSS, Styled Components, or simple CSS.

### 4. Wire up React-Router
If you use multi-course architecture, just export a \`<CatalogViewer />\` and a \`<CourseViewer />\` component that wraps \`react-router-dom\` navigation points.

\`\`\`tsx
import { useParams, Outlet, Routes, Route, useNavigate } from 'react-router-dom';

export function CourseViewer({ allLessons }) {
  const { courseId, '*': slug } = useParams();
  
  // Custom theme logic...
}
\`\`\`

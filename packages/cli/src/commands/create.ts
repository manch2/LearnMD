import chalk from 'chalk';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';

interface CreateOptions {
  template: string;
  language: string;
}

export async function createCommand(name?: string, _options?: CreateOptions) {
  const projectName = name || (await askForProjectName());
  const isInWorkspace = await checkIfInLearnMDWorkspace();

  console.log(chalk.blue(`\n📚 Creating LearnMD project: ${projectName}\n`));

  try {
    await mkdir(projectName, { recursive: true });
    await createBasicStructure(projectName);
    await updatePackageJson(projectName, projectName, isInWorkspace);
    await createEssentialFiles(projectName, isInWorkspace);

    console.log(chalk.green('\n✅ LearnMD project created successfully!\n'));
    console.log(chalk.blue('Next steps:'));
    console.log(`  cd ${projectName}`);
    console.log('  pnpm install');
    console.log('  pnpm dev\n');
  } catch (error) {
    console.error(chalk.red('\n❌ Error creating project:'), error);
    process.exit(1);
  }
}

async function checkIfInLearnMDWorkspace(): Promise<boolean> {
  try {
    const cwd = process.cwd();
    const rootPackageJson = await readFile(join(cwd, 'package.json'), 'utf-8');
    const pkg = JSON.parse(rootPackageJson);
    return pkg.name === 'learnmd' || pkg.workspaces?.length > 0;
  } catch {
    return false;
  }
}

async function askForProjectName(): Promise<string> {
  const inquirer = await import('inquirer');
  const { projectName } = await inquirer.default.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-course',
      validate: (input: string) => {
        if (/^[a-z0-9-]+$/.test(input)) return true;
        return 'Project name must contain only lowercase letters, numbers, and hyphens';
      },
    },
  ]);
  return projectName;
}

async function createBasicStructure(projectPath: string) {
  const dirs = ['courses/demo-course/lessons', 'public', 'src'];

  for (const dir of dirs) {
    await mkdir(join(projectPath, dir), { recursive: true });
  }

  await writeFile(join(projectPath, 'index.html'), getIndexHtml());
  await writeFile(join(projectPath, 'src/main.tsx'), getMainTsx());
  await writeFile(join(projectPath, 'src/App.tsx'), getAppTsx());
  await writeFile(join(projectPath, 'src/index.css'), getIndexCss());
  await writeFile(join(projectPath, 'vite.config.ts'), getViteConfig());
  await writeFile(join(projectPath, 'tsconfig.json'), getTsConfig());
  await writeFile(join(projectPath, 'tsconfig.node.json'), getTsNodeConfig());
  await writeFile(join(projectPath, 'learnmd.config.ts'), getLearnMdConfig());
  await writeFile(join(projectPath, '.gitignore'), getGitIgnore());

  await writeFile(join(projectPath, 'courses/demo-course/lessons/.gitkeep'), '');
}

async function createEssentialFiles(projectPath: string, _isInWorkspace: boolean) {
  await writeFile(join(projectPath, '.npmrc'), 'auto-install-peers=true\n');
}

function getIndexHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LearnMD Course</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function getMainTsx(): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@learnmd/default-theme/styles';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
}

function getAppTsx(): string {
  return `/// <reference types="vite/client" />
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
`;
}

function getIndexCss(): string {
  return `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  width: 100%;
  min-height: 100vh;
}
`;
}

function getViteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
        providerImportSource: '@mdx-js/react'
      })
    },
    react()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
`;
}

function getTsConfig(): string {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;
}

function getTsNodeConfig(): string {
  return `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
`;
}

function getGitIgnore(): string {
  return `node_modules/
dist/
.env
.env.local
*.log
.DS_Store
.vite/
.cache/
`;
}

async function updatePackageJson(projectPath: string, name: string, isInWorkspace: boolean) {
  const dependencies: Record<string, string> = {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    'react-router-dom': '^6.22.3',
    '@mdx-js/react': '^3.0.1'
  };

  const devDependencies: Record<string, string> = {
    '@types/react': '^18.2.0',
    '@types/react-dom': '^18.2.0',
    '@vitejs/plugin-react': '^4.2.0',
    '@mdx-js/rollup': '^3.0.1',
    'remark-gfm': '^4.0.0',
    'remark-frontmatter': '^5.0.0',
    'remark-mdx-frontmatter': '^4.0.0',
    typescript: '^5.4.0',
    vite: '^5.1.0',
    '@learnmd/core': isInWorkspace ? 'file:../packages/core' : '^0.0.1',
    '@learnmd/default-theme': isInWorkspace
      ? 'file:../packages/default-theme'
      : '^0.0.1',
  };

  const packageJson = {
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: '0.0.1',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies,
    devDependencies,
  };

  await writeFile(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
}

function getLearnMdConfig(): string {
  return `import { defineConfig } from '@learnmd/core';

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
`;
}

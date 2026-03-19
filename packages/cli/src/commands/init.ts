import chalk from 'chalk';
import { writeFile, mkdir } from 'fs-extra';
import { join } from 'path';

export async function initCommand() {
  console.log(chalk.blue('\n✨ Initializing LearnMD...\n'));

  try {
    const projectFiles = await getProjectFiles();

    for (const file of projectFiles) {
      const filePath = join(process.cwd(), file.path);
      await mkdir(join(process.cwd(), file.dir), { recursive: true });
      await writeFile(filePath, file.content);
      console.log(chalk.gray(`  Created: ${file.path}`));
    }

    console.log(chalk.green('\n✅ LearnMD initialized successfully!\n'));
    console.log(chalk.blue('Next steps:'));
    console.log('  1. Create your course content in the courses/ directory');
    console.log('  2. Customize your theme in learnmd.config.ts');
    console.log('  3. Run "npm run dev" to start development\n');
  } catch (error) {
    console.error(chalk.red('\n❌ Initialization failed:'), error);
    process.exit(1);
  }
}

interface ProjectFile {
  path: string;
  dir: string;
  content: string;
}

async function getProjectFiles(): Promise<ProjectFile[]> {
  return [
    {
      path: 'learnmd.config.ts',
      dir: '.',
      content: `import { defineConfig } from '@learnmd/core';

export default defineConfig({
  title: 'My Course',
  description: 'A course built with LearnMD',
  defaultLanguage: 'en',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#3b82f6',
    darkMode: true,
  },
  plugins: [],
});
`,
    },
    {
      path: 'courses/.gitkeep',
      dir: 'courses',
      content: '',
    },
    {
      path: 'public/.gitkeep',
      dir: 'public',
      content: '',
    },
    {
      path: '.gitignore',
      dir: '.',
      content: `node_modules/
dist/
.env
*.log
.DS_Store
`,
    },
  ];
}

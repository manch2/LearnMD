import chalk from 'chalk';
import { copy, mkdir, writeFile } from 'fs-extra';
import { join } from 'path';

interface CreateOptions {
  template: string;
  language: string;
}

export async function createCommand(name?: string, options?: CreateOptions) {
  const projectName = name || (await askForProjectName());

  console.log(chalk.blue(`\n📚 Creating LearnMD project: ${projectName}\n`));

  try {
    await mkdir(projectName, { recursive: true });
    await copyTemplate(projectName, options?.template || 'default');
    await updatePackageJson(projectName, projectName);

    console.log(chalk.green('\n✅ LearnMD project created successfully!\n'));
    console.log(chalk.blue('Next steps:'));
    console.log(`  cd ${projectName}`);
    console.log('  pnpm install');
    console.log('  pnpm run dev\n');
  } catch (error) {
    console.error(chalk.red('\n❌ Error creating project:'), error);
    process.exit(1);
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

async function copyTemplate(projectPath: string, template: string) {
  const { fileURLToPath } = await import('url');
  const { dirname } = await import('path');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const templatesDir = join(__dirname, `../templates/${template}`);

  try {
    await copy(templatesDir, projectPath, { overwrite: false });
  } catch {
    console.warn(chalk.yellow(`Template "${template}" not found, using default...`));
    const defaultDir = join(__dirname, '../templates/default');
    await copy(defaultDir, projectPath, { overwrite: false });
  }
}

async function updatePackageJson(projectPath: string, name: string) {
  const packageJson = {
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: '0.0.1',
    private: true,
    type: 'module',
    scripts: {
      dev: 'learnmd dev',
      build: 'learnmd build',
      preview: 'vite preview',
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
    devDependencies: {
      '@learnmd/core': 'workspace:*',
      '@learnmd/default-theme': 'workspace:*',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@vitejs/plugin-react': '^4.2.0',
      typescript: '^5.4.0',
      vite: '^5.1.0',
    },
  };

  await writeFile(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
}

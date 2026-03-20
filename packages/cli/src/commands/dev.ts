import chalk from 'chalk';
import { createServer } from 'vite';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

interface DevOptions {
  port: string;
  host: string;
}

async function checkIfInLearnMDWorkspace(): Promise<boolean> {
  try {
    const cwd = process.cwd();
    const packageJsonPath = resolve(cwd, 'package.json');
    const content = await readFile(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(content);
    return pkg.name === 'learnmd' || pkg.workspaces !== undefined;
  } catch {
    return false;
  }
}

export async function devCommand(options?: DevOptions) {
  const port = parseInt(options?.port || '3000', 10);
  const host = options?.host || 'localhost';

  console.log(chalk.blue('\n🚀 Starting LearnMD development server...\n'));

  const isInWorkspace = await checkIfInLearnMDWorkspace();

  try {
    const server = await createServer({
      root: process.cwd(),
      configFile: resolve(process.cwd(), 'vite.config.ts'),
      server: {
        port,
        host,
        open: true,
      },
      plugins: [
        {
          name: 'learnmd-dev',
          configureServer(server) {
            server.httpServer?.on('listening', () => {
              console.log(chalk.green(`\n✅ Server running at:`));
              console.log(chalk.blue(`   http://${host}:${port}\n`));
            });
          },
        },
      ],
      resolve: {
        alias: isInWorkspace ? {
          '@learnmd/core': resolve(process.cwd(), '../core/src'),
          '@learnmd/default-theme': resolve(process.cwd(), '../default-theme/src'),
        } : {},
      },
    });

    await server.listen();
    await server.printUrls();
  } catch (error) {
    console.error(chalk.red('\n❌ Error starting development server:'), error);
    process.exit(1);
  }
}

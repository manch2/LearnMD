import chalk from 'chalk';
import { createServer } from 'vite';
import { resolve } from 'path';

interface DevOptions {
  port: string;
  host: string;
}

export async function devCommand(options?: DevOptions) {
  const port = parseInt(options?.port || '3000', 10);
  const host = options?.host || 'localhost';

  console.log(chalk.blue('\n🚀 Starting LearnMD development server...\n'));

  try {
    const server = await createServer({
      root: process.cwd(),
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
        alias: {
          '@learnmd/core': resolve(process.cwd(), '../packages/core/src'),
          '@learnmd/default-theme': resolve(process.cwd(), '../packages/default-theme/src'),
        },
      },
    });

    await server.listen();
    await server.printUrls();
  } catch (error) {
    console.error(chalk.red('\n❌ Error starting development server:'), error);
    process.exit(1);
  }
}

import chalk from 'chalk';
import { build } from 'vite';
import { resolve } from 'path';
import { readdir, writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync, cpSync } from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import MiniSearch from 'minisearch';

interface BuildOptions {
  out: string;
  base: string;
}

export async function buildCommand(options?: BuildOptions) {
  const outDir = options?.out || 'dist';
  const basePath = options?.base || '/';

  console.log(chalk.blue('\n🔨 Building LearnMD course...\n'));

  try {
    await buildFrontend(outDir, basePath);
    await generateSearchIndex(outDir);
    await copyStaticFiles(outDir);

    console.log(chalk.green(`\n✅ Build complete!\n`));
    console.log(chalk.blue(`Output directory: ${outDir}\n`));
  } catch (error) {
    console.error(chalk.red('\n❌ Build failed:'), error);
    process.exit(1);
  }
}

async function buildFrontend(outDir: string, basePath: string) {
  console.log(chalk.gray('Building frontend...'));

  const root = process.cwd();
  const outPath = resolve(root, outDir);

  await mkdir(outPath, { recursive: true });

  await build({
    root,
    base: basePath,
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(root, 'index.html'),
      },
    },
  });
}

async function generateSearchIndex(outDir: string) {
  console.log(chalk.gray('Generating search index...'));

  const miniSearch = new MiniSearch({
    fields: ['title', 'content'],
    storeFields: ['title', 'lessonSlug', 'moduleSlug'],
  });

  const coursesDir = resolve(process.cwd(), 'courses');

  try {
    const modules = await readdir(coursesDir);

    for (const mod of modules) {
      const modulePath = resolve(coursesDir, mod);
      const lessons = await readdir(modulePath);

      for (const lesson of lessons) {
        if (!lesson.endsWith('.md')) continue;

        const lessonPath = resolve(modulePath, lesson);
        const content = await readFile(lessonPath, 'utf-8');
        const { data, content: markdown } = matter(content);
        const html = await marked.parse(markdown);

        miniSearch.add({
          id: `${mod}/${lesson}`,
          title: data.title || 'Untitled',
          content: html.replace(/<[^>]+>/g, ' '),
          lessonSlug: lesson.replace('.md', ''),
          moduleSlug: mod,
        });
      }
    }

    const indexPath = resolve(process.cwd(), outDir, 'search-index.json');
    await writeFile(indexPath, JSON.stringify(miniSearch.toJSON()));
  } catch (error) {
    console.warn(chalk.yellow('No courses found to index'));
  }
}

async function copyStaticFiles(outDir: string) {
  console.log(chalk.gray('Copying static files...'));

  const root = process.cwd();
  const outPath = resolve(root, outDir);

  const staticDirs = ['public', 'static'];

  for (const dir of staticDirs) {
    const src = resolve(root, dir);
    if (existsSync(src)) {
      cpSync(src, resolve(outPath, dir), { recursive: true });
    }
  }
}

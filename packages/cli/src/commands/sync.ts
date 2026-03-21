import chalk from 'chalk';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export interface SyncOptions {
  course?: string;
  nonInteractive?: boolean;
}

export async function syncCommand(courseSlug: string, options?: SyncOptions) {
  const isNonInteractive = options?.nonInteractive;
  
  if (!isNonInteractive) {
    console.log(chalk.blue(`\n🔄 Syncing lessons for course: ${courseSlug}\n`));
  } else {
    console.log(`Syncing lessons for course: ${courseSlug}`);
  }

  const courseDir = join(process.cwd(), 'courses', courseSlug);
  const lessonsDir = join(courseDir, 'lessons');
  const configPath = join(courseDir, 'learnmd.json');

  try {
    // Read MDX files
    const files = await readdir(lessonsDir);
    const mdxFiles = files.filter(f => f.endsWith('.mdx'));
    const slugs = mdxFiles.map(f => f.replace(/\.mdx$/, ''));

    // Update learnmd.json
    const configContent = await readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    
    config.lessons = slugs;
    
    await writeFile(configPath, JSON.stringify(config, null, 2));

    if (!isNonInteractive) {
      console.log(chalk.green(`✅ Synced ${slugs.length} lessons to ${courseSlug}/learnmd.json`));
      console.log(chalk.gray(`  Lessons: ${slugs.join(', ')}`));
    } else {
      console.log(`✅ Synced ${slugs.length} lessons to ${courseSlug}/learnmd.json`);
    }

  } catch (error) {
    console.error(chalk.red(`❌ Failed to sync course ${courseSlug}. Ensure the course directory exists.`));
    if (!isNonInteractive) {
      console.error(error);
    }
  }
}

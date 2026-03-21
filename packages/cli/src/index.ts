#!/usr/bin/env node

import { program } from 'commander';
import { createCommand } from './commands/create.js';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';
import { initCommand } from './commands/init.js';
import { addCourseCommand, addLessonCommand } from './commands/add.js';
import { syncCommand } from './commands/sync.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const version = pkg.version;

program
  .name('learnmd')
  .description('CLI for creating and building LearnMD courses')
  .version(version);

program
  .command('create')
  .description('Create a new LearnMD project')
  .argument('[name]', 'Project name')
  .option('-t, --template <template>', 'Template to use', 'default')
  .option('-l, --language <language>', 'Default language', 'en')
  .option('-n, --non-interactive', 'Run without interactive prompts')
  .action(createCommand);

program
  .command('init')
  .description('Initialize LearnMD in an existing project')
  .action(initCommand);

program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Port to run on', '3000')
  .option('-h, --host <host>', 'Host to run on', 'localhost')
  .action(devCommand);

program
  .command('build')
  .description('Build for production')
  .option('-o, --out <dir>', 'Output directory', 'dist')
  .option('--base <base>', 'Base path', '/')
  .action(buildCommand);

program
  .command('add')
  .description('Add new resources (course, lesson, or page)')
  .argument('<type>', 'Type of resource (course, lesson, page)')
  .argument('<name>', 'Name/Title of the resource')
  .option('-c, --course <courseName>', 'Course name to add the lesson to (defaults to demo-course)')
  .option('-n, --non-interactive', 'Run without interactive prompts')
  .option('-d, --difficulty <difficulty>', 'Difficulty level for course')
  .option('-t, --time <time>', 'Estimated completion time for course')
  .action(async (type, name, options) => {
    if (type === 'course') {
      await addCourseCommand(name, options);
    } else if (type === 'lesson') {
      await addLessonCommand(name, options);
    } else if (type === 'page') {
      const { addPageCommand } = await import('./commands/add.js');
      await addPageCommand(name, options);
    } else {
      console.error('Invalid resource type. Use "course", "lesson", or "page".');
    }
  });

program
  .command('sync')
  .description('Sync a directory of MDX files to update the learnmd.json lessons array')
  .argument('<course>', 'Course name to sync')
  .option('-n, --non-interactive', 'Run without interactive prompts')
  .action((course, options) => {
    syncCommand(course, options);
  });

program.parse();

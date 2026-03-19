#!/usr/bin/env node

import { program } from 'commander';
import { createCommand } from './commands/create.js';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';
import { initCommand } from './commands/init.js';
import { addCourseCommand, addLessonCommand } from './commands/add.js';

const version = '0.0.1';

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
  .description('Add new resources (course or lesson)')
  .argument('<type>', 'Type of resource (course, lesson)')
  .argument('<name>', 'Name/Title of the resource')
  .option('-c, --course <courseName>', 'Course name to add the lesson to (defaults to demo-course)')
  .action((type, name, options) => {
    if (type === 'course') {
      addCourseCommand(name);
    } else if (type === 'lesson') {
      addLessonCommand(name, options.course || 'demo-course');
    } else {
      console.error('Invalid resource type. Use "course" or "lesson".');
    }
  });

program.parse();

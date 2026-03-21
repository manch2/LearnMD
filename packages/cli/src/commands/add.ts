import chalk from 'chalk';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { intro, text, select, isCancel, cancel, outro } from '@clack/prompts';

async function checkIfInLearnMDWorkspace(): Promise<boolean> {
  try {
    const cwd = process.cwd();
    const rootPackageJson = await readFile(join(cwd, 'package.json'), 'utf-8');
    const pkg = JSON.parse(rootPackageJson);
    return pkg.name === 'learnmd' || pkg.dependencies?.['@learnmd/core'] || pkg.devDependencies?.['@learnmd/core'];
  } catch {
    return false;
  }
}

export interface AddOptions {
  course?: string;
  nonInteractive?: boolean;
  difficulty?: string;
  time?: string;
}

export async function addCourseCommand(initialName?: string, options?: AddOptions) {
  const isNonInteractive = options?.nonInteractive;
  
  if (!isNonInteractive) {
    intro(chalk.bgBlue(' 📚 Add New Course '));
  }
  
  const isLearnMD = await checkIfInLearnMDWorkspace();
  if (!isLearnMD) {
    console.warn(chalk.yellow('⚠️ Warning: This doesn\'t look like a LearnMD project. Ensure you are running this inside a LearnMD workspace.'));
  }

  let name = initialName;
  if (!name && !isNonInteractive) {
    const nameResult = await text({
      message: 'What is the title of the course?',
      placeholder: 'e.g., JavaScript Basics',
      validate(value) {
        if (!value || value.length === 0) return 'Course title is required';
      },
    });

    if (isCancel(nameResult)) {
      cancel('Operation cancelled.');
      return;
    }
    name = nameResult as string;
  } else if (!name && isNonInteractive) {
    name = 'new-course';
  }

  let difficulty = options?.difficulty;
  if (!difficulty && !isNonInteractive) {
    const diffResult = await select({
      message: 'What is the difficulty level?',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ],
    });

    if (isCancel(diffResult)) {
      cancel('Operation cancelled.');
      return;
    }
    difficulty = diffResult as string;
  } else if (!difficulty && isNonInteractive) {
    difficulty = 'beginner';
  }

  let estimatedTime = options?.time;
  if (!estimatedTime && !isNonInteractive) {
    const timeResult = await text({
      message: 'What is the estimated completion time?',
      placeholder: 'e.g., 2 hours',
      defaultValue: '1 hour',
    });

    if (isCancel(timeResult)) {
      cancel('Operation cancelled.');
      return;
    }
    estimatedTime = timeResult as string;
  } else if (!estimatedTime && isNonInteractive) {
    estimatedTime = '1 hour';
  }

  const slug = (name as string).toLowerCase().replace(/\s+/g, '-');
  const coursePath = join(process.cwd(), 'courses', slug, 'lessons');
  
  try {
    await mkdir(coursePath, { recursive: true });
    
    // Generate course configuration
    const courseConfig = {
      title: {
        en: name as string,
        es: `${name as string} (ES)`
      },
      description: {
        en: `An interactive course: ${name as string}`,
        es: `Un curso interactivo: ${name as string}`
      },
      version: '1.0.0',
      difficulty: difficulty as string,
      estimatedTime: estimatedTime as string,
      lessons: ['introduction']
    };

    const courseDir = join(process.cwd(), 'courses', slug);
    await writeFile(join(courseDir, 'learnmd.json'), JSON.stringify(courseConfig, null, 2));
    
    // Add an initial overview.mdx
    const overviewContent = `---
title: Overview
---

# Welcome to ${name as string}!

This is the overview page for your new course. You can add extended descriptions, images, and custom salutations here.
`;
    await writeFile(join(courseDir, 'overview.mdx'), overviewContent);

    // Add an initial lesson
    await addLessonCommand('Introduction', { course: slug, nonInteractive: isNonInteractive });
    
    if (!isNonInteractive) {
      outro(chalk.green(`✅ Course '${name}' created successfully in courses/${slug}/`));
    } else {
      console.log(chalk.green(`✅ Course '${name}' created successfully in courses/${slug}/`));
    }
  } catch (error) {
    console.error(chalk.red('❌ Failed to create course directory.'));
    console.error(error);
  }
}

export async function addLessonCommand(title: string, options?: AddOptions) {
  const courseSlug = options?.course || 'demo-course';
  const isNonInteractive = options?.nonInteractive;
  
  if (!isNonInteractive) {
    console.log(chalk.blue(`\n📝 Adding new lesson: ${title} to ${courseSlug}\n`));
  } else {
    console.log(`Adding new lesson: ${title} to ${courseSlug}`);
  }
  
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const filePath = join(process.cwd(), 'courses', courseSlug, 'lessons', `${slug}.mdx`);

  const content = `---
title:
  en: '${title}'
  es: '${title} (ES)'
description:
  en: 'Description for ${title}'
  es: 'Descripción para ${title}'
duration: '10 minutes'
---

# ${title}

<Callout type="info">
  Welcome to the new lesson: **${title}**!
</Callout>

<Paragraph i18n="intro">
  <en>
    This is an auto-generated lesson content.
  </en>
  <es>
    Este es el contenido autogenerado de la lección.
  </es>
</Paragraph>

<Quiz
  id="${slug}-quiz"
  questions={[
    {
      id: "q1",
      type: "multiple-choice",
      question: "Is this lesson auto-generated?",
      options: [
        { id: "a", label: "Yes" },
        { id: "b", label: "No" }
      ],
      correctAnswer: "a",
      points: 10
    }
  ]}
/>

<Progress value={50} showPercentage label="Lesson Progress" />
`;

  try {
    await mkdir(join(process.cwd(), 'courses', courseSlug, 'lessons'), { recursive: true });
    await writeFile(filePath, content);
    console.log(chalk.gray(`  Created lesson: courses/${courseSlug}/lessons/${slug}.mdx`));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create lesson. Ensure you have permissions.'));
    console.error(error);
  }
}

export async function addPageCommand(title: string, options?: AddOptions) {
  const isNonInteractive = options?.nonInteractive;
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const pathUrl = `/${slug}`;
  
  if (!isNonInteractive) {
    console.log(chalk.blue(`\n📄 Adding new custom page: ${title} at ${pathUrl}\n`));
  }
  
  const filePath = join(process.cwd(), 'pages', `${slug}.mdx`);

  const content = `---
title: '${title}'
---

# ${title}

This is a custom dynamic page. You can add MDX components here.
`;

  try {
    await mkdir(join(process.cwd(), 'pages'), { recursive: true });
    await writeFile(filePath, content);
    console.log(chalk.gray(`  Created page file: pages/${slug}.mdx`));
    console.log(chalk.yellow(`  ⚠️  Remember to add this page to your learnmd.config.ts:`));
    console.log(chalk.cyan(`
      customPages: [
        { path: '${pathUrl}', componentPath: 'pages/${slug}.mdx' }
      ]
    `));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create page. Ensure you have permissions.'));
    console.error(error);
  }
}


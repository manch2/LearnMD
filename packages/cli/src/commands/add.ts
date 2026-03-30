import chalk from 'chalk';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { intro, text, select, isCancel, cancel, outro } from '@clack/prompts';

async function checkIfInLearnMDWorkspace(): Promise<boolean> {
  try {
    const cwd = process.cwd();
    const rootPackageJson = await readFile(join(cwd, 'package.json'), 'utf-8');
    const pkg = JSON.parse(rootPackageJson);
    return (
      pkg.name === 'learnmd' ||
      pkg.dependencies?.['@learnmd/core'] ||
      pkg.devDependencies?.['@learnmd/core']
    );
  } catch {
    return false;
  }
}

export interface AddOptions {
  course?: string;
  nonInteractive?: boolean;
  difficulty?: string;
  time?: string;
  author?: string;
  description?: string;
}

export async function addCourseCommand(initialName?: string, options?: AddOptions) {
  const isNonInteractive = options?.nonInteractive;

  if (!isNonInteractive) {
    intro(chalk.bgBlue(' Create New Course '));
  }

  const isLearnMD = await checkIfInLearnMDWorkspace();
  if (!isLearnMD) {
    console.warn(
      chalk.yellow(
        "Warning: This doesn't look like a LearnMD project. Ensure you are running this inside a LearnMD workspace."
      )
    );
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

  const description = options?.description || `An interactive course: ${name}`;
  const author = options?.author || 'LearnMD Author';

  const slug = (name as string).toLowerCase().replace(/\s+/g, '-');
  const coursePath = join(process.cwd(), 'courses', slug, 'lessons');

  try {
    await mkdir(coursePath, { recursive: true });

    const courseConfig = {
      title: {
        en: name as string,
        es: `${name as string} (ES)`,
      },
      description: {
        en: description,
        es: `${description} (ES)`,
      },
      version: '1.0.0',
      author,
      lastUpdated: new Date().toISOString(),
      difficulty: difficulty as string,
      estimatedTime: estimatedTime as string,
      lessons: ['introduction'],
    };

    const courseDir = join(process.cwd(), 'courses', slug);
    await writeFile(join(courseDir, 'learnmd.json'), JSON.stringify(courseConfig, null, 2));

    const overviewContent = `---
title: Overview
---

<Title i18n="title">
  <en>Welcome to ${name as string}!</en>
  <es>\u00a1Bienvenido a ${name as string}!</es>
</Title>

<Paragraph i18n="intro">
  <en>
    This is the overview page for your new course. You can add extended descriptions, images, and custom salutations here.
  </en>
  <es>
    Esta es la p\u00e1gina de descripci\u00f3n general de tu nuevo curso. Puedes agregar descripciones extendidas, im\u00e1genes y saludos personalizados aqu\u00ed.
  </es>
</Paragraph>
`;
    await writeFile(join(courseDir, 'overview.mdx'), overviewContent);

    await addLessonCommand('Introduction', { course: slug, nonInteractive: isNonInteractive });

    if (!isNonInteractive) {
      outro(chalk.green(`Course '${name}' created successfully in courses/${slug}/`));
    } else {
      console.log(chalk.green(`Course '${name}' created successfully in courses/${slug}/`));
    }
  } catch (error) {
    console.error(chalk.red('Failed to create course directory.'));
    console.error(error);
  }
}

export async function addLessonCommand(title: string, options?: AddOptions) {
  const courseSlug = options?.course || 'demo-course';
  const isNonInteractive = options?.nonInteractive;
  const description = options?.description || `Description for ${title}`;

  if (!isNonInteractive) {
    console.log(chalk.blue(`\nAdding new lesson: ${title} to ${courseSlug}\n`));
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
  en: '${description}'
  es: '${description} (ES)'
duration: '10 minutes'
---

<Title i18n="title">
  <en>${title}</en>
  <es>${title} (ES)</es>
</Title>

<Callout type="info">
  <Paragraph i18n="generated-callout">
    <en>Welcome to the new lesson: **${title}**!</en>
    <es>\u00a1Bienvenido a la nueva lecci\u00f3n: **${title}**!</es>
  </Paragraph>
</Callout>

<Paragraph i18n="intro">
  <en>
    This is an auto-generated lesson content.
  </en>
  <es>
    Este es el contenido autogenerado de la lecci\u00f3n.
  </es>
</Paragraph>

<Quiz
  id="${slug}-quiz"
  questions={[
    {
      id: "q1",
      type: "multiple-choice",
      question: {
        en: "Is this lesson auto-generated?",
        es: "\u00bfEsta lecci\u00f3n fue generada autom\u00e1ticamente?"
      },
      options: [
        {
          id: "a",
          label: {
            en: "Yes",
            es: "S\u00ed"
          }
        },
        {
          id: "b",
          label: {
            en: "No",
            es: "No"
          }
        }
      ],
      correctAnswer: "a",
      explanation: {
        en: "This starter lesson is created by the CLI to help you begin quickly.",
        es: "Esta lecci\u00f3n inicial es creada por el CLI para ayudarte a comenzar r\u00e1pidamente."
      },
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
    console.error(chalk.red('Failed to create lesson. Ensure you have permissions.'));
    console.error(error);
  }
}

export async function addPageCommand(title: string, options?: AddOptions) {
  const isNonInteractive = options?.nonInteractive;
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const pathUrl = `/${slug}`;

  if (!isNonInteractive) {
    console.log(chalk.blue(`\nAdding new custom page: ${title} at ${pathUrl}\n`));
  }

  const filePath = join(process.cwd(), 'pages', `${slug}.mdx`);

  const content = `---
title: '${title}'
---

<Title i18n="title">
  <en>${title}</en>
  <es>${title} (ES)</es>
</Title>

<Paragraph i18n="intro">
  <en>
    This is a custom dynamic page. You can add MDX components here.
  </en>
  <es>
    Esta es una p\u00e1gina din\u00e1mica personalizada. Puedes agregar componentes MDX aqu\u00ed.
  </es>
</Paragraph>
`;

  try {
    await mkdir(join(process.cwd(), 'pages'), { recursive: true });
    await writeFile(filePath, content);
    console.log(chalk.gray(`  Created page file: pages/${slug}.mdx`));

    const configPath = join(process.cwd(), 'learnmd.config.ts');
    try {
      let configContent = await readFile(configPath, 'utf-8');
      const pageEntry = `\n    { path: '${pathUrl}', componentPath: 'pages/${slug}.mdx' }`;

      if (configContent.includes('customPages: [')) {
        configContent = configContent.replace(/customPages:\s*\[/, `customPages: [${pageEntry},`);
      } else {
        configContent = configContent.replace(/}\);?\s*$/, `  customPages: [${pageEntry}\n  ],\n});\n`);
      }

      await writeFile(configPath, configContent);
      console.log(chalk.green(`Injected ${pathUrl} route into learnmd.config.ts`));
    } catch {
      console.log(chalk.yellow('  Remember to add this page to your learnmd.config.ts:'));
      console.log(
        chalk.cyan(`
      customPages: [
        { path: '${pathUrl}', componentPath: 'pages/${slug}.mdx' }
      ]
      `)
      );
    }
  } catch (error) {
    console.error(chalk.red('Failed to create page. Ensure you have permissions.'));
    console.error(error);
  }
}

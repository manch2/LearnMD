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

export async function addCourseCommand(initialName?: string) {
  intro(chalk.bgBlue(' 📚 Add New Course '));
  
  const isLearnMD = await checkIfInLearnMDWorkspace();
  if (!isLearnMD) {
    console.warn(chalk.yellow('⚠️ Warning: This doesn\'t look like a LearnMD project. Ensure you are running this inside a LearnMD workspace.'));
  }

  const name = initialName || await text({
    message: 'What is the title of the course?',
    placeholder: 'e.g., JavaScript Basics',
    validate(value) {
      if (!value || value.length === 0) return 'Course title is required';
    },
  });

  if (isCancel(name)) {
    cancel('Operation cancelled.');
    return;
  }

  const difficulty = await select({
    message: 'What is the difficulty level?',
    options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
  });

  if (isCancel(difficulty)) {
    cancel('Operation cancelled.');
    return;
  }

  const estimatedTime = await text({
    message: 'What is the estimated completion time?',
    placeholder: 'e.g., 2 hours',
    defaultValue: '1 hour',
  });

  if (isCancel(estimatedTime)) {
    cancel('Operation cancelled.');
    return;
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
    await addLessonCommand('Introduction', slug);
    
    outro(chalk.green(`✅ Course '${name}' created successfully in courses/${slug}/`));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create course directory.'));
    console.error(error);
  }
}

export async function addLessonCommand(title: string, courseSlug: string = 'demo-course') {
  console.log(chalk.blue(`\n📝 Adding new lesson: ${title} to ${courseSlug}\n`));
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

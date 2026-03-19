import chalk from 'chalk';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';

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

export async function addCourseCommand(name: string) {
  console.log(chalk.blue(`\n📚 Adding new course: ${name}\n`));
  
  const isLearnMD = await checkIfInLearnMDWorkspace();
  if (!isLearnMD) {
    console.warn(chalk.yellow('⚠️ Warning: This doesn\'t look like a LearnMD project. Ensure you are running this inside a LearnMD workspace.'));
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const coursePath = join(process.cwd(), 'courses', slug, 'lessons');
  
  try {
    await mkdir(coursePath, { recursive: true });
    
    // Add an initial lesson
    await addLessonCommand('Introduction', slug);
    console.log(chalk.green(`✅ Course '${name}' created successfully in courses/${slug}/`));
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
difficulty: 'beginner'
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
    console.log(chalk.green(`✅ Lesson created at: courses/${courseSlug}/lessons/${slug}.mdx`));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create lesson. Ensure you have permissions.'));
    console.error(error);
  }
}

import chalk from 'chalk';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createCommand } from './create.js';

export async function addCourseCommand(name: string) {
  console.log(chalk.blue(`\n📚 Adding new course: ${name}\n`));
  // A course in LearnMD root architecture is essentially a new project
  await createCommand(name);
}

export async function addLessonCommand(title: string) {
  console.log(chalk.blue(`\n📝 Adding new lesson: ${title}\n`));
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const filePath = join(process.cwd(), 'lessons', `${slug}.mdx`);

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
    await mkdir(join(process.cwd(), 'lessons'), { recursive: true });
    await writeFile(filePath, content);
    console.log(chalk.green(`✅ Lesson created at: lessons/${slug}.mdx`));
  } catch (error) {
    console.error(chalk.red('❌ Failed to create lesson. Ensure you are in a LearnMD project directory!'));
    console.error(error);
  }
}

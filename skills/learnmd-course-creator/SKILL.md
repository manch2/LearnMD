---
name: learnmd-course-creator
description: Create interactive courses using the LearnMD framework. Use when users want to create a new course, add lessons, quizzes, videos, or any LearnMD content. This skill handles AI-First course scaffolding (non-interactive CLI), Markdown lesson creation with frontmatter, interactive components (Quiz, VideoEmbed, Progress), internationalization (i18n), and gamification/PDF setup. Perfect for educators, developers building educational platforms, or anyone wanting to create structured learning content with Markdown.
---

# LearnMD Course Creator

A skill for creating interactive courses using the LearnMD open-source framework. LearnMD combines Markdown simplicity with powerful features like quizzes, video embeds, progress tracking, gamification, and PDF certifications.

## When to Use This Skill

- User says "create a course" or "new lesson"
- User wants to add quizzes, videos, or interactive elements
- User needs i18n (multilingual) course support
- User wants to set up progress tracking, gamification badges, or PDF certificates
- User is building educational content with Markdown

## Prerequisites

This skill assumes:
- The project uses LearnMD framework (monorepo at `packages/core`, `packages/default-theme`, `packages/cli`)
- LearnMD CLI is available (`@learnmd/cli`)
- You are acting as an AI Agent, therefore you **MUST ALWAYS use the `--non-interactive` flag** when running LearnMD CLI commands to avoid hanging the terminal.

## Course Structure

A LearnMD course has this hierarchy:

```text
course-slug/
├── lessons/
│   ├── 01-intro.mdx
│   ├── 02-advanced.mdx
│   └── ...
├── learnmd.json
└── overview.mdx
```

## Creating a New Course (AI-First)

When a user asks to create a course, you do not need to create the files manually. Use the CLI in non-interactive mode.

### Step 1: Create Course Scaffold

Use the CLI to scaffold the course and its configuration. The CLI accepts all parameters via flags:

```bash
learnmd add course "Course Title" --non-interactive --difficulty "beginner" --time "2 hours" --author "Author Name" --description "Course description"
```
*Note: This command automatically creates the `learnmd.json`, an initial `overview.mdx`, and a sample lesson.*

### Step 2: Add Additional Lessons

```bash
learnmd add lesson "Lesson Title" --course "course-slug" --non-interactive --description "Lesson description"
```

### Step 3: Sync Lessons

After adding lessons manually or renaming files, you **must** sync the folder so `learnmd.json` reflects the correct order:

```bash
learnmd sync "course-slug" --non-interactive
```

## Creating Lessons Manually

If you need to create a lesson manually instead of using the CLI, ensure it has the proper frontmatter:

```yaml
---
title:
  en: 'Lesson Title'
  es: 'Título de la Lección'
description:
  en: 'Lesson description'
  es: 'Descripción de la lección'
duration: '15 minutes'
---
# Lesson Title

Content here...
```

### Lesson Content Components

#### Callout Component
```markdown
<Callout type="info">Information text here.</Callout>
<Callout type="tip">Helpful tip for learners.</Callout>
<Callout type="warning">Warning message.</Callout>
<Callout type="success">Success message after completion.</Callout>
```

#### Quiz Component
```markdown
<Quiz
  id="quiz-1"
  questions={[
    {
      id: "q1",
      type: "multiple-choice",
      question: "What is LearnMD?",
      options: [
        { id: "a", label: "A framework for interactive courses" },
        { id: "b", label: "A text editor" }
      ],
      correctAnswer: "a",
      explanation: "LearnMD is specifically designed for creating interactive educational content.",
      points: 10
    }
  ]}
/>
```

#### Video Embed Component
Supported providers: `youtube`, `vimeo`, `onedrive`, `googledrive`
```markdown
<VideoEmbed provider="youtube" id="VIDEO_ID" title="Introduction Video" />
```

#### Progress Component
```markdown
<Progress value={25} showPercentage label="Course Progress" />
```

#### Language Switcher & i18n
```markdown
<LanguageSwitcher variant="dropdown" showLabel />

<Paragraph i18n="unique-key">
  <en>English content here...</en>
  <es>Contenido en español aquí...</es>
</Paragraph>
```

## Plugins Configuration

LearnMD supports official plugins for Badges and PDF Certificates. These must be registered in `learnmd.config.ts`.

### Badges Plugin (`@learnmd/plugin-badges`)
Evaluates progress on the fly and awards badges based on criteria (`courses_completed` or `course_progress`).

```typescript
import { BadgesPlugin } from '@learnmd/plugin-badges';

new BadgesPlugin([
  {
    id: 'primeros-pasos',
    name: 'Iniciando el Camino',
    description: 'Has iniciado tu primer curso.',
    icon: '🚀',
    criteria: { type: 'course_progress', courseId: 'my-course', percentage: 1 }
  },
  {
    id: 'master',
    name: 'Maestro',
    description: 'Has completado todos los cursos.',
    icon: '🏆',
    criteria: { type: 'courses_completed', count: 2 }
  }
])
```

### PDF Plugin (`@learnmd/plugin-pdf`)
Generates PDF certificates using React components rendered to an off-screen canvas.

```typescript
import { PDFPlugin } from '@learnmd/plugin-pdf';
import React from 'react';

// You can pass a React component template for ultimate customization
new PDFPlugin()
```
When configuring the `generateCertificate` function, the plugin accepts a `template` property containing standard HTML/React for infinite Tailwind customization.

## CLI Commands Reference

- `learnmd create <project-name> --non-interactive`
- `learnmd add course <name> [flags...]`
- `learnmd add lesson <name> [flags...]`
- `learnmd sync <course-slug> --non-interactive`
- `pnpm dev` (Start development server)
- `pnpm build` (Build for production)

## Tips for Interactive Courses

1. **Keep lessons focused**: One topic per lesson, 10-20 minutes max.
2. **Use quizzes strategically**: After key concepts, not every section.
3. **Add visual variety**: Mix videos, callouts, and text.
4. **Always Sync**: After creating files, run `learnmd sync <slug> --non-interactive`.
5. **Non-Interactive is Mandatory**: As an AI, always append `--non-interactive` to CLI commands to prevent hanging.

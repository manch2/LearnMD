---
title:
  en: 'Introduction'
  es: 'Introducción'
duration: '15 minutes'
difficulty: 'beginner'
points: 50
---

# Introduction

<Paragraph i18n="intro-welcome">
  <en>Welcome to this LearnMD course! In this lesson, you'll learn the basics of creating interactive content.</en>
  <es>¡Bienvenido a este curso de LearnMD! En esta lección, aprenderás los conceptos básicos de crear contenido interactivo.</es>
</Paragraph>

## What You'll Learn

<Callout type="info">
  By the end of this lesson, you will be able to:
  
  - Create Markdown-based lessons
  - Add interactive quizzes
  - Embed videos and images
  - Track user progress
</Callout>

## Getting Started

<Paragraph i18n="intro-getting-started">
  <en>Let's start by understanding the structure of a LearnMD course. Each course is organized into modules and lessons, with each lesson being a single Markdown file.</en>
  <es>Comencemos entendiendo la estructura de un curso de LearnMD. Cada curso se organiza en módulos y lecciones, siendo cada lección un archivo Markdown.</es>
</Paragraph>

## Code Examples

You can include code blocks with syntax highlighting:

```typescript
import { createLearnMD } from '@learnmd/core';

const app = createLearnMD({
  defaultLanguage: 'en',
  gamification: {
    points: {
      lessonCompletion: 100,
      quizPassed: 10,
    },
  },
});

app.start();
```

## Quiz Time!

Let's test what you've learned:

<Quiz
question="What is the main file format for LearnMD lessons?"
options={["JSON", "Markdown", "HTML", "XML"]}
correct={1}
points={10}
/>

## Summary

In this introduction, we covered:

- The basics of LearnMD
- How courses are structured
- How to write lessons in Markdown

<LanguageSwitcher variant="flags" />

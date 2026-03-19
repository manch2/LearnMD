---
title:
  en: 'Getting Started with LearnMD'
  es: 'Comenzando con LearnMD'
description:
  en: 'Learn the basics of creating interactive courses with LearnMD'
  es: 'Aprende los conceptos básicos de crear cursos interactivos con LearnMD'
duration: '15 minutes'
difficulty: 'beginner'
badge: 'getting-started'
points: 100
cover: '/images/course-cover.jpg'
authors:
  - 'LearnMD Team'
version: '1.0.0'
lastUpdated: '2024-01-15'
learningObjectives:
  - en:
      - 'Understand what LearnMD is'
      - 'Create your first lesson'
      - 'Add quizzes and assessments'
      - 'Embed multimedia content'
  - es:
      - 'Entender qué es LearnMD'
      - 'Crear tu primera lección'
      - 'Agregar cuestionarios y evaluaciones'
      - 'Insertar contenido multimedia'
---

# Getting Started with LearnMD

<Callout type="info">
  Welcome to this LearnMD course! In this lesson, you'll learn the fundamentals of creating interactive educational content.
</Callout>

## What is LearnMD?

<Paragraph i18n="intro-learnmd">
  <en>
    LearnMD is an open-source framework designed for creating interactive courses using Markdown. 
    It combines the simplicity of Markdown writing with powerful features like quizzes, 
    video embeds, progress tracking, and gamification.
  </en>
  <es>
    LearnMD es un framework de código abierto diseñado para crear cursos interactivos usando Markdown.
    Combina la simplicidad de escribir en Markdown con características poderosas como cuestionarios,
    inserción de videos, seguimiento de progreso y gamificación.
  </es>
</Paragraph>

### Key Features

- 📝 **Markdown-based** - Write content in simple, readable Markdown
- 🌍 **Internationalization** - Support for multiple languages out of the box
- 🎨 **Theming** - Customize colors, fonts, and layouts
- 🔌 **Plugins** - Extend functionality with a powerful plugin system
- 📊 **Progress Tracking** - Automatic progress saving with LocalStorage
- 🎮 **Gamification** - Points, badges, and achievements
- 📱 **PWA Ready** - Works offline and can be installed

## Your First Lesson

<Paragraph i18n="first-lesson">
  <en>
    A LearnMD course is organized into modules and lessons. Each lesson is a single Markdown 
    file with frontmatter metadata at the top. Frontmatter uses YAML syntax to define the 
    lesson's title, duration, difficulty, and other properties.
  </en>
  <es>
    Un curso de LearnMD se organiza en módulos y lecciones. Cada lección es un archivo Markdown
    individual con metadatos en frontmatter en la parte superior. El frontmatter usa sintaxis YAML
    para definir el título de la lección, duración, dificultad y otras propiedades.
  </es>
</Paragraph>

### Lesson Structure

```markdown
---
title: 'Lesson Title'
duration: '10 minutes'
difficulty: 'beginner'
points: 50
---

# Lesson Title

Your lesson content goes here...

<Quiz question="..." options={["A", "B", "C"]} correct={0} />
```

## Adding Interactive Quizzes

<Quiz
question="What is the primary file format for LearnMD lessons?"
options={[
{ id: "json", label: "JSON" },
{ id: "md", label: "Markdown" },
{ id: "xml", label: "XML" },
{ id: "html", label: "HTML" }
]}
correctAnswer="md"
explanation="LearnMD uses Markdown files (.md) as the primary format for lessons, making it easy to write and maintain content."
points={10}
/>

## Embedding Videos

<VideoEmbed
  provider="youtube"
  id="dQw4w9WgXcQ"
  title="LearnMD Introduction"
  autoplay={false}
/>

<Callout type="tip">
  You can embed videos from YouTube, Vimeo, OneDrive, and Google Drive!
</Callout>

## Progress Tracking

<Paragraph i18n="progress-tracking">
  <en>
    LearnMD automatically tracks each learner's progress through your course. Progress is stored 
    locally in the browser using LocalStorage, so users can continue where they left off on any device.
  </en>
  <es>
    LearnMD rastrea automáticamente el progreso de cada aprendiz a través de tu curso. El progreso se almacena
    localmente en el navegador usando LocalStorage, para que los usuarios puedan continuar donde lo dejaron en cualquier dispositivo.
  </es>
</Paragraph>

<Progress value={25} showPercentage label="Course Progress" size="md" variant="default" />

## Multilingual Support

<Paragraph i18n="i18n-support">
  <en>
    LearnMD has built-in support for internationalization. You can provide translations for any text
    in your course using a simple syntax that allows learners to switch languages on the fly.
  </en>
  <es>
    LearnMD tiene soporte integrado para internacionalización. Puedes proporcionar traducciones para cualquier texto
    en tu curso usando una sintaxis simple que permite a los aprendices cambiar de idioma sobre la marcha.
  </es>
</Paragraph>

<LanguageSwitcher variant="dropdown" showLabel />

## Summary

<Callout type="success">
  In this lesson, you learned:
  
  - What LearnMD is and why it's useful
  - The basic structure of a LearnMD course
  - How to add quizzes and videos
  - How progress tracking works
  - Multilingual support features
  
  Continue to the next lesson to learn about advanced features!
</Callout>

---

**Language:** English | [Español](./es/index.md)

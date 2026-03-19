---
title:
  en: 'Advanced Features'
  es: 'Características Avanzadas'
duration: '20 minutes'
difficulty: 'intermediate'
points: 100
prerequisites:
  - '01-intro'
---

# Advanced Features

<Paragraph i18n="advanced-intro">
  <en>In this lesson, we'll explore the advanced features of LearnMD, including custom components, theming, and plugins.</en>
  <es>En esta lección, exploraremos las características avanzadas de LearnMD, incluyendo componentes personalizados, temas y plugins.</es>
</Paragraph>

## Custom Components

LearnMD supports custom React components within your Markdown files:

<Callout type="warning">
  Custom components require knowledge of React and MDX.
</Callout>

## Theming

You can customize the appearance of your course using CSS variables:

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --font-family: 'Inter', sans-serif;
  --border-radius: 0.5rem;
}
```

## Video Embeds

<VideoEmbed
  provider="youtube"
  id="dQw4w9WgXcQ"
  title="Advanced Tutorial"
  autoplay={false}
/>

## Progress Tracking

Your progress is automatically saved:

<Progress value={75} showPercentage label="Course Progress" variant="success" />

## Gamification

Earn points and badges as you complete lessons:

<PointsDisplay points={250} label="Total Points" />

## Quiz

<Quiz
questions={[
{
id: "q1",
question: "Which feature allows you to earn rewards?",
options: [
{ id: "a", label: "Theming" },
{ id: "b", label: "Gamification" },
{ id: "c", label: "i18n" }
],
correctAnswer: "b",
points: 20
}
]}
passingScore={70}
/>

<LanguageSwitcher variant="dropdown" />

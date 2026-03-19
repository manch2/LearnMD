---
title:
  en: 'Advanced Features'
  es: 'Características Avanzadas'
description:
  en: 'Explore advanced LearnMD features including theming, plugins, and gamification'
  es: 'Explora características avanzadas de LearnMD incluyendo temas, plugins y gamificación'
duration: '25 minutes'
difficulty: 'intermediate'
points: 150
prerequisites:
  - '01-getting-started'
---

# Advanced Features

<Callout type="info">
  In this lesson, we'll explore the advanced features that make LearnMD a powerful platform for creating engaging educational experiences.
</Callout>

## Custom Theming

<Paragraph i18n="theming-intro">
  <en>
    LearnMD supports comprehensive theming through CSS variables. You can customize colors, 
    typography, spacing, and more to match your brand or personal preferences.
  </en>
  <es>
    LearnMD soporta temas completos a través de variables CSS. Puedes personalizar colores,
    tipografía, espaciado y más para coincidir con tu marca o preferencias personales.
  </es>
</Paragraph>

### Color Variables

```css
:root {
  --color-primary-500: #3b82f6;
  --color-secondary-500: #10b981;
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-radius: 0.5rem;
}
```

### Dark Mode

LearnMD includes built-in dark mode support:

<Callout type="tip">
  Users can toggle between light, dark, and system theme preferences!
</Callout>

## Gamification System

<Paragraph i18n="gamification">
  <en>
    LearnMD includes a built-in gamification system that rewards learners for their progress.
    Points, badges, and achievements keep learners motivated and engaged.
  </en>
  <es>
    LearnMD incluye un sistema de gamificación incorporado que recompensa a los aprendices por su progreso.
    Puntos, insignias y logros mantienen a los aprendices motivados y comprometidos.
  </es>
</Paragraph>

### Points System

| Action             | Points |
| ------------------ | ------ |
| Complete Lesson    | 10     |
| Pass Quiz          | 20     |
| Perfect Quiz Score | 30     |
| Daily Streak Bonus | 5-50   |

### Badges

<Badge
  id="first-lesson"
  name="First Steps"
  description="Complete your first lesson"
  icon="🎯"
  size="lg"
/>

<Badge
  id="quick-learner"
  name="Quick Learner"
  description="Complete 5 lessons in one day"
  icon="⚡"
  size="lg"
/>

<Badge
  id="perfectionist"
  name="Perfectionist"
  description="Get 100% on a quiz"
  icon="💯"
  size="lg"
/>

## Plugin System

<Paragraph i18n="plugins">
  <en>
    Extend LearnMD's functionality with plugins. The plugin system allows you to add custom
    components, integrate with external services, and modify the learning experience.
  </en>
  <es>
    Extiende la funcionalidad de LearnMD con plugins. El sistema de plugins te permite agregar
    componentes personalizados, integrar con servicios externos y modificar la experiencia de aprendizaje.
  </es>
</Paragraph>

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  version: string;
  onLoad: (ctx: PluginContext) => void;
  onUnload?: (ctx: PluginContext) => void;
}
```

### Available Hooks

- `before:lesson:render` - Modify lesson before rendering
- `after:lesson:render` - Execute after lesson renders
- `lesson:complete` - Triggered when a lesson is completed
- `progress:update` - Called when progress is updated
- `language:change` - Triggered when language changes

## Analytics Integration

<Paragraph i18n="analytics">
  <en>
    LearnMD can integrate with popular analytics platforms to track learner engagement,
    completion rates, quiz performance, and more.
  </en>
  <es>
    LearnMD puede integrarse con plataformas populares de análisis para rastrear el compromiso de los aprendices,
    tasas de completación, rendimiento en cuestionarios y más.
  </es>
</Paragraph>

### Tracked Events

- Lesson started
- Lesson completed
- Quiz attempted
- Quiz passed/failed
- Time spent on lesson
- Language changes

## Certificate Generation

<Paragraph i18n="certificates">
  <en>
    When learners complete a course, LearnMD can generate downloadable PDF certificates.
    Certificates include the learner's name, course title, completion date, and a unique verification code.
  </en>
  <es>
    Cuando los aprendices completan un curso, LearnMD puede generar certificados PDF descargables.
    Los certificados incluyen el nombre del aprendiz, título del curso, fecha de completación y un código de verificación único.
  </es>
</Paragraph>

### Certificate Features

- Customizable templates
- QR code for verification
- Digital signatures
- Multiple formats

## Offline Support (PWA)

<Paragraph i18n="pwa">
  <en>
    LearnMD courses can work offline as Progressive Web Apps (PWAs). Content is cached
    locally, allowing learners to continue their courses without an internet connection.
  </en>
  <es>
    Los cursos de LearnMD pueden funcionar sin conexión como Aplicaciones Web Progresivas (PWAs). El contenido se almacena
    en caché localmente, permitiendo a los aprendices continuar sus cursos sin conexión a internet.
  </es>
</Paragraph>

<Callout type="warning">
  Offline functionality requires service worker configuration during build.
</Callout>

## Quiz: Advanced Features

<Quiz
questions={[
{
id: "q1",
type: "multiple-choice",
question: "Which system rewards learners with points and badges?",
options: [
{ id: "a", label: "Theming" },
{ id: "b", label: "Gamification" },
{ id: "c", label: "Analytics" },
{ id: "d", label: "i18n" }
],
correctAnswer: "b",
explanation: "The gamification system provides points, badges, and achievements to motivate learners.",
points: 10
},
{
id: "q2",
type: "multiple-choice",
question: "What technology enables offline functionality?",
options: [
{ id: "a", label: "Cookies" },
{ id: "b", label: "Service Workers (PWA)" },
{ id: "c", label: "WebSockets" },
{ id: "d", label: "LocalStorage only" }
],
correctAnswer: "b",
explanation: "Progressive Web Apps (PWAs) use Service Workers to enable offline functionality.",
points: 10
}
]}
passingScore={70}
allowRetry={true}
showCorrectAnswers={true}
/>

## Summary

<Callout type="success">
  In this advanced lesson, you learned about:
  
  - Custom theming with CSS variables
  - Dark mode support
  - Gamification with points and badges
  - Plugin system architecture
  - Analytics integration
  - Certificate generation
  - Offline PWA support
  
  You're now ready to create professional-quality courses with LearnMD!
</Callout>

---

**Previous:** [Getting Started](./01-getting-started.md)

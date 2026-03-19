# LearnMD Documentation

Welcome to the LearnMD documentation! LearnMD is an open-source framework for creating interactive courses from Markdown files.

## Quick Start

```bash
# Create a new project
npm create learnmd@latest my-course

# Navigate to project
cd my-course

# Start development
npm run dev
```

## Features

- 📝 **Markdown-based** - Write courses in simple Markdown
- 🌍 **i18n Ready** - Built-in internationalization
- 🎨 **Themeable** - Customizable themes
- 🔌 **Plugin System** - Extend functionality
- 📊 **Progress Tracking** - LocalStorage-based
- 🎮 **Gamification** - Points, badges, achievements
- 🔍 **Full-text Search** - Instant search
- 📱 **PWA Ready** - Offline support
- 🎓 **Certificates** - PDF generation

## Project Structure

```
my-course/
├── courses/           # Your course content
│   └── lesson-1.md
├── public/           # Static assets
├── src/              # React components
├── learnmd.config.ts # Configuration
└── package.json
```

## Writing Lessons

### Frontmatter

```yaml
---
title: 'Lesson Title'
description: 'Optional description'
duration: '15 minutes'
difficulty: 'beginner|intermediate|advanced'
points: 100
---
```

### Content

```markdown
# Lesson Title

Your lesson content here...

## Section

More content...
```

## Components

### Quiz

```jsx
<Quiz question="What is LearnMD?" options={['A', 'B', 'C', 'D']} correctAnswer="b" points={10} />
```

### Video Embed

```jsx
<VideoEmbed provider="youtube" id="dQw4w9WgXcQ" title="Tutorial" />
```

### Callout

```jsx
<Callout type="info|tip|warning|danger">Your message here...</Callout>
```

## Internationalization

### Paragraph-level translations

```jsx
<Paragraph i18n="intro-text">
  <en>English text here...</en>
  <es>Texto en español aquí...</es>
</Paragraph>
```

### Language Switcher

```jsx
<LanguageSwitcher variant="dropdown|buttons|flags" />
```

## Configuration

```typescript
// learnmd.config.ts
export default defineConfig({
  title: 'My Course',
  defaultLanguage: 'en',
  availableLanguages: ['en', 'es'],
  theme: {
    primaryColor: '#3b82f6',
    darkMode: true,
  },
  plugins: [],
});
```

## Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT

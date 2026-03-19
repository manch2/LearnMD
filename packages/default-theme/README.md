# 🎨 @learnmd/default-theme

A premium, Docusaurus-inspired UI theme for LearnMD courses. Built with **Tailwind CSS** and **React**, it provides a polished, interactive experience out of the box.

## ✨ Highlights

- **Docusaurus-like Layout**: Clean header, collapsible sidebar, and intuitive lesson navigation.
- **Dark Mode**: High-contrast, elegant dark theme support.
- **Interactive Components**:
  - `Quiz`: Beautifully styled emerald/rose feedback.
  - `Callout`: Informational alerts (Info, Tip, Warning, Danger).
  - `VideoEmbed`: Support for YouTube, Vimeo, and more.
  - `Progress`: Visual completion tracking.
- **Tailwind Native**: Fully customizable via Tailwind configuration.

## 🛠️ Integration

Import the styles and components in your React application:

```tsx
import { CourseViewer } from '@learnmd/default-theme';
import '@learnmd/default-theme/styles';
```

## 📂 Components

- `CourseLayout`: The main shell for the course.
- `CourseViewer`: The orchestrator that renders lessons and navigation.
- `Quiz`: The assessment engine.
- `Callout`: The alert system.

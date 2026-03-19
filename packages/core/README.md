# 🏗️ @learnmd/core

The heart of the LearnMD engine. This package contains the fundamental logic for parsing, internationalization, storage, and state management.

## 📦 Features

- **MDX Integration**: Seamlessly bridges Markdown content with React components.
- **i18n Engine**: Handles paragraph-level translations and language persistence.
- **Storage Adapter**: Flexible persistence layer for progress tracking (LocalStorage, etc).
- **Gamification**: Logic for points, badges, and achievement criteria.
- **Router**: Managed navigation between modules and lessons.

## 🛠️ Usage

```typescript
import { defineConfig, createLearnMD } from '@learnmd/core';

export const config = defineConfig({
  title: 'My Awesome Course',
  defaultLanguage: 'en',
  // ...
});
```

## 🏗️ Architecture

- `/parser`: Logic for handling MDX transformations.
- `/i18n`: The translation manager.
- `/storage`: Progress persistence adapters.
- `/types`: Comprehensive TypeScript definitions for courses, lessons, and metrics.

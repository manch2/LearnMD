# LearnMD

**Create interactive courses from Markdown files**

LearnMD is an open-source framework for building interactive courses using Markdown. Powered by AI-friendly file structures and featuring a robust plugin system, themes, and native components for quizzes, video embeds, and more.

## Features

- 📝 **Markdown-based** - Write courses in simple Markdown with frontmatter metadata
- 🌍 **i18n Ready** - Built-in internationalization with paragraph-level translations
- 🎨 **Themeable** - Customizable themes with dark/light mode support
- 🔌 **Plugin System** - Extend functionality with plugins
- 📊 **Progress Tracking** - LocalStorage-based progress tracking
- 🎮 **Gamification** - Points, badges, and achievements
- 🔍 **Full-text Search** - Instant search across all course content
- 📱 **PWA Ready** - Offline support with IndexedDB caching
- 🎓 **Certificates** - Generate PDF certificates on course completion
- 📹 **Rich Media** - Embed videos from YouTube, Vimeo, OneDrive, Google Drive

## Quick Start

```bash
# Create a new LearnMD project
npm create learnmd@latest my-course

# Navigate to project
cd my-course

# Start development server
npm run dev
```

## Project Structure

```
packages/
├── core/           # Core framework (parser, router, i18n, storage)
├── default-theme/  # Default theme with components
└── cli/            # CLI for scaffolding and building

docs/               # Documentation
examples/           # Example courses
```

## Installation

```bash
# Install pnpm (required)
npm install -g pnpm

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development
pnpm dev
```

## Documentation

Visit our [documentation](./docs/) for detailed guides on:

- Creating courses
- Customizing themes
- Building plugins
- Deployment

## License

MIT © [LearnMD Contributors](https://github.com/learnmd/learnmd/graphs/contributors)

# Contributing to LearnMD

Thank you for your interest in contributing to LearnMD! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/learnmd.git
   cd learnmd
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Build all packages:
   ```bash
   pnpm build
   ```

## Project Structure

```
learnmd/
├── packages/
│   ├── core/           # Core framework (parser, storage, i18n, etc.)
│   ├── default-theme/  # Default theme with components
│   └── cli/            # CLI for scaffolding and building
├── docs/               # Documentation
└── examples/           # Example courses
```

## Working on Code

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `pnpm lint` before committing
- Run `pnpm format` to format code

### Testing

- Write tests for new features
- Run tests with `pnpm test`
- Ensure all tests pass before submitting PR

### Commit Messages

Use conventional commit format:

```
feat(core): add new parser feature
fix(theme): resolve dark mode toggle issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request Process

1. Create a new branch for your feature/fix:

   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes and commit them

3. Push to your fork and create a PR

4. Ensure CI passes and address any review comments

## Packages

### @learnmd/core

Core framework functionality including:

- Markdown parsing
- i18n management
- Storage (LocalStorage, IndexedDB)
- Gamification system
- Plugin system
- Router

### @learnmd/default-theme

Default theme with React components:

- Quiz
- VideoEmbed
- Callout
- Progress
- LanguageSwitcher
- Search
- Badge/Gamification components

### @learnmd/cli

Command-line interface:

- `learnmd create` - Create new project
- `learnmd dev` - Start development server
- `learnmd build` - Build for production
- `learnmd init` - Initialize in existing project

## Documentation

Update documentation when:

- Adding new features
- Changing APIs
- Updating configuration options

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

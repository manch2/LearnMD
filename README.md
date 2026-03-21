# 📚 LearnMD

**Create interactive, stunning courses from Markdown/MDX files.**

[![CI](https://github.com/manch2/LearnMD/actions/workflows/ci.yml/badge.svg)](https://github.com/manch2/LearnMD/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

LearnMD is an open-source framework designed for building modern, interactive educational content. Inspired by **Docusaurus**, it brings the power of **Vite**, **React**, and **MDX** to course creation, allowing you to embed interactive quizzes, rich media, and complex logic directly into your lessons.

---

## ✨ Features

- 💎 **Docusaurus Aesthetic** - Beautiful, modern UI with high-quality typography, unified headers, and consistent spacing.
- 🌓 **Native Dark Mode** - Seamless transition between light and dark themes across all layouts.
- 🚀 **MDX Powered** - Use React components (Quizzes, Callouts, Videos, Progress bars) directly in your Markdown.
- 🏗️ **Multi-Course Architecture** - Support for N courses within a single project, featuring a hybrid **Course Overview** (Metadata + MDX content).
- 📟 **AI-First CLI** - REF-refactored CLI supporting both **Interactive** human prompts and **Non-Interactive** flags (`--non-interactive`) for AI agents and automation.
- 🌍 **Global i18n** - Paragraph-level translations and a unified **Language Switcher** available in all layouts.
- 🎮 **Gamification & Badges** - Built-in criteria-based badge engine (`@learnmd/plugin-badges`) and progress tracking.
- 📜 **Certification** - Automated PDF certificate generation upon course completion via `@learnmd/plugin-pdf`.
- 📂 **Dynamic Pages** - Support for an arbitrary number of custom static pages (e.g., About Us, Help Center) via MDX and simple configuration.
- 💾 **State Persistence** - Deep integration with `localStorage` to save lesson progress, quiz scores, and user profile metrics.

---

## 🚀 Quick Start

### 1. Installation
Ensure you have [pnpm](https://pnpm.io/) installed:

```bash
npm install -g pnpm
```

### 2. Scaffold a Project
Use the LearnMD CLI to create your course workspace:

```bash
# Clone or use the local CLI
git clone https://github.com/manch2/LearnMD.git
cd LearnMD
pnpm install
pnpm build

# Create your project (Headless/AI Mode)
node packages/cli/dist/index.js create my-workspace --non-interactive
cd my-workspace
pnpm install
pnpm dev
```

### 3. Manage Content via CLI
Within your project, you can generate and sync content dynamically:

```bash
# Add a new course
learnmd add course python-101 --difficulty intermediate

# Add a new lesson
learnmd add lesson "Intro to Loops" --course python-101

# Add a custom static page
learnmd add page "Help Center"

# Sync lessons (keeps learnmd.json aligned with your filesystem)
learnmd sync python-101
```

---

## 📂 Monorepo Ecosystem

```text
learnmd/
├── packages/
│   ├── core/           # Engine: Parser, i18n, Storage, Types, Router
│   ├── default-theme/  # UI: Unified Layouts, React Components, Tailwind context
│   ├── cli/            # Scaffolder: AI-First Creation, Sync, and Add commands
│   └── plugins/        # Official Plugins
│       ├── pdf/        # jsPDF-based certification generation
│       └── badges/     # Configurable criteria-based badge engine
├── docs/               # Technical Documentation
└── examples/           # Pre-built course examples
```

---

## 🛠️ Development

We use `turbo` for an optimized monorepo workflow:

```bash
pnpm install
pnpm build    # Build all packages (generates dist/ folders)
pnpm dev      # Start development on all packages
pnpm test     # Run the test suite (Vitest)
pnpm lint     # Check code quality (ESLint + Prettier)
```

---

## 📖 Documentation

Visit the [docs/](./docs/index.md) folder for comprehensive guides on:
- [Component Reference](./docs/components.md)
- [Managing Multiple Courses](./docs/multi-course.md)
- [Theming & Branding](./docs/theming.md)
- [Plugin System](./docs/plugins.md)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for Educators, Developers, and AI Agents.
</p>

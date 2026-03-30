# 📚 LearnMD

**Create interactive, stunning courses from Markdown/MDX files.**

[![CI](https://github.com/manch2/LearnMD/actions/workflows/ci.yml/badge.svg)](https://github.com/manch2/LearnMD/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

LearnMD is an open-source framework designed for building modern, interactive educational content. Inspired by **Docusaurus** and **Google Codelabs**, it brings the power of **Vite**, **React**, and **MDX** to course creation, allowing you to embed interactive quizzes, rich media, and complex logic directly into your lessons.

---

## ✨ Features

- 💎 **Beautiful Aesthetic** - Modern UI with high-quality typography, unified headers, and Google Codelabs inspired metadata.
- 🌓 **Native Dark Mode** - Seamless transition between light and dark themes across all layouts.
- 🚀 **MDX Powered** - Use React components (Quizzes, Callouts, Videos, Progress bars) directly in your Markdown.
- 🏗️ **Multi-Course Architecture** - Support for N courses within a single project, featuring a hybrid **Course Overview** (Metadata + MDX content) that displays Authors and Last Updated timestamps.
- 🤖 **AI-First CLI** - A CLI supporting both **Interactive** human prompts and **Non-Interactive** flags (`--non-interactive`) for AI agents and automation.
- 🔄 **Auto-Sync** - Keep your filesystem and course configurations perfectly aligned with the new `learnmd sync` command.
- 🌍 **Global i18n** - Paragraph-level translations and a unified **Language Switcher** available in all layouts.
- 🎮 **Gamification & Badges** - Built-in criteria-based badge engine (`@learnmd/plugin-badges`) and progress tracking.
- 📜 **Certification Templates** - Generate PDF certificates securely using pure HTML/React templates that render seamlessly to PDF via `@learnmd/plugin-pdf`.
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
npx @learnmd/cli create my-workspace --non-interactive
cd my-workspace
pnpm install
pnpm dev
```

### 3. Manage Content via CLI
Within your project, you can generate and sync content dynamically:

```bash
# Add a new course with full metadata
learnmd add course python-101 --author "Jane Doe" --difficulty intermediate --time "4 hours"

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
│   ├── default-theme/  # UI: Unified Layouts, Course Overview, Tailwind context
│   ├── cli/            # Scaffolder: AI-First Creation, Sync, and Add commands
│   └── plugins/        # Official Plugins
│       ├── pdf/        # React-template to PDF certification generation
│       └── badges/     # Configurable criteria-based badge engine
├── docs/               # Self-hosted Documentation using LearnMD!
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

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for Educators, Developers, and AI Agents.
</p>

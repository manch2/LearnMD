# 📚 LearnMD

**Create interactive, stunning courses from Markdown/MDX files.**

[![CI](https://github.com/manch2/LearnMD/actions/workflows/ci.yml/badge.svg)](https://github.com/manch2/LearnMD/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

LearnMD is an open-source framework designed for building modern, interactive educational content. Inspired by **Docusaurus**, it brings the power of **Vite**, **React**, and **MDX** to course creation, allowing you to embed interactive quizzes, rich media, and complex logic directly into your lessons.

---

## ✨ Features

- 💎 **Docusaurus Aesthetic** - Beautiful, modern UI with high-quality typography and spacing.
- 🌓 **Native Dark Mode** - Seamless transition between light and dark themes.
- 🚀 **MDX Powered** - Use React components (Quizzes, Callouts, Videos) directly in your Markdown.
- 🏗️ **Multi-Course Architecture** - Support for N courses within a single project, perfect for onboarding and enterprise training.
- 📟 **Powerful CLI** - Scaffold projects and add courses or lessons with ease.
- 🌍 **Deep i18n** - Paragraph-level translations and full support for multilingual content.
- 🎮 **Gamification** - Built-in point systems, badges, and progress tracking.
- 📦 **Monorepo Ecosystem** - Clean separation of `core`, `default-theme`, and `cli`.

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
# Clone or use the local CLI for now (NPM release coming soon)
git clone https://github.com/manch2/LearnMD.git
cd LearnMD
pnpm install
pnpm build

# Create your project
node packages/cli/dist/index.js create my-workspace
cd my-workspace
pnpm install
pnpm dev
```

### 3. Add Courses and Lessons
Within your project, you can generate content dynamically:

```bash
# Add a new course
learnmd add course python-101

# Add a new lesson
learnmd add lesson "Intro to Loops"
```

---

## 📂 Project Structure

```text
learnmd/
├── packages/
│   ├── core/           # Engine: Parser, i18n, Storage, Types
│   ├── default-theme/  # UI: Docusaurus Layout, Quiz, Callouts, Tailwind context
│   └── cli/            # Scaffolder: Creation and Add commands
├── docs/               # Technical Documentation
└── examples/           # Pre-built course examples
```

---

## 🛠️ Development

We use `turbo` for an optimized monorepo workflow:

```bash
pnpm install
pnpm build    # Build all packages
pnpm dev      # Start development on all packages
pnpm test     # Run the test suite
pnpm lint     # Check code quality
```

---

## 📖 Documentation

Visit the [docs/](./docs/index.md) folder for comprehensive guides on:
- [Component Reference](./docs/components.md)
- [Managing Multiple Courses](./docs/multi-course.md)
- [Theming & Branding](./docs/theming.md)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for Educators and Developers.
</p>

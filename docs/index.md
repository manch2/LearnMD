# LearnMD Documentation

Welcome to the **LearnMD** documentation! This guide covers the architectural principles, component library, and CLI usage of the MDX-powered course framework.

## 🚀 Getting Started

To initialize a new LearnMD project, ensure you have `pnpm` and `Node.js >=18` installed.

### Installation
```bash
# Install the CLI locally (or via NPM when released)
pnpm install
pnpm build
```

### Create a Workspace
```bash
node packages/cli/dist/index.js create my-onboarding-site
cd my-onboarding-site
pnpm install
pnpm dev
```

---

## 🏗️ Architecture

LearnMD is built as a **pnpm monorepo**:
- **@learnmd/core**: The engine handling MDX parsing, i18n, and storage.
- **@learnmd/default-theme**: The UI layer providing Docusaurus-style layouts and interactive React components.
- **@learnmd/cli**: The developer tool for scaffolding and content generation.

---

## 📝 Multi-Course Management

LearnMD is uniquely flexible for hosting multiple courses within a single project. 

### Adding a Course
```bash
learnmd add course employee-onboarding
```

### Adding Lessons
```bash
learnmd add lesson "Company Culture"
```

Each course is an optimized Vite module that can be deployed independently or aggregated into a single corporate learning portal.

---

## 🧩 Components

Since LearnMD uses **MDX**, you can use these components directly in your Markdown files:

### `<Quiz>`
Interactive multiple-choice assessments.
```jsx
<Quiz 
  id="q-01" 
  questions={[{ id: "1", type: "multiple-choice", question: "...", options: [...], correctAnswer: "a" }]} 
/>
```

### `<Callout>`
Visual alerts for important information.
```jsx
<Callout type="tip">
  Guido van Rossum renamed Python after Monty Python!
</Callout>
```

### `<VideoEmbed>`
Fluid video embeds from YouTube, Vimeo, and more.
```jsx
<VideoEmbed provider="youtube" id="VIDEO_ID" title="Lesson Video" />
```

---

## 🌍 Internationalization (i18n)

LearnMD supports deep translations at the paragraph level:

```jsx
<Paragraph i18n="p-intro">
  <en>Welcome to the course!</en>
  <es>¡Bienvenido al curso!</es>
</Paragraph>
```

The rendering engine automatically detects the user's preference and displays the correct language.

---

## 🛠️ Deployment

Build your course for production:
```bash
pnpm build
```

The resulting `dist/` folder is a standard static site ready for hostings like Vercel, Netlify, or AWS S3.

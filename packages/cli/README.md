# 📟 @learnmd/cli

The command-line tool for scaffolding and managing LearnMD projects. It streamlines the creation of multi-course workspaces and individual lessons.

## 🚀 Commands

### `learnmd create [name]`
Scaffolds a new LearnMD project with MDX and Vite pre-configured.

### `learnmd add course <name>`
Adds a new course project/module to the workspace.

### `learnmd add lesson <title>`
Generates a new `.mdx` lesson file with standard frontmatter in the current project.

### `learnmd dev`
Starts the development server for the current course.

### `learnmd build`
Compiles the course for production.

## 🏗️ Scaffolding Logic

The CLI generates a optimized Vite project that uses `import.meta.glob` to automatically discover and compile MDX lessons, ensuring zero-config content management.

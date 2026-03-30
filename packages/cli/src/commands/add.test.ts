import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { addCourseCommand, addLessonCommand, addPageCommand } from './add';

let tempDir = '';

describe('add commands', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = '';
    }
  });

  it('creates a bilingual lesson with translated quiz content', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'learnmd-add-lesson-'));
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir);
    await mkdir(join(tempDir, 'courses', 'demo-course', 'lessons'), { recursive: true });

    await addLessonCommand('CLI Basics', { course: 'demo-course', nonInteractive: true });

    const lesson = await readFile(
      join(tempDir, 'courses', 'demo-course', 'lessons', 'cli-basics.mdx'),
      'utf-8'
    );

    expect(lesson).toContain("<en>CLI Basics</en>");
    expect(lesson).toContain("<es>CLI Basics (ES)</es>");
    expect(lesson).toContain('¿Esta lección fue generada automáticamente?');
    expect(lesson).toContain('Esta lección inicial es creada por el CLI');
  });

  it('creates a course overview and starter lesson', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'learnmd-add-course-'));
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir);
    await writeFile(
      join(tempDir, 'package.json'),
      JSON.stringify({ name: 'sample-project', dependencies: { '@learnmd/core': 'workspace:*' } })
    );

    await addCourseCommand('Platform Foundations', { nonInteractive: true });

    const overview = await readFile(
      join(tempDir, 'courses', 'platform-foundations', 'overview.mdx'),
      'utf-8'
    );
    const config = JSON.parse(
      await readFile(join(tempDir, 'courses', 'platform-foundations', 'learnmd.json'), 'utf-8')
    );

    expect(overview).toContain('Welcome to Platform Foundations!');
    expect(overview).toContain('¡Bienvenido a Platform Foundations!');
    expect(config.title.es).toBe('Platform Foundations (ES)');
  });

  it('creates a custom page and injects it into learnmd.config.ts', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'learnmd-add-page-'));
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir);
    await writeFile(
      join(tempDir, 'learnmd.config.ts'),
      `export default defineConfig({\n  customPages: []\n});\n`
    );

    await addPageCommand('Support Center', { nonInteractive: true });

    const page = await readFile(join(tempDir, 'pages', 'support-center.mdx'), 'utf-8');
    const config = await readFile(join(tempDir, 'learnmd.config.ts'), 'utf-8');

    expect(page).toContain('<en>Support Center</en>');
    expect(page).toContain('<es>Support Center (ES)</es>');
    expect(config).toContain("{ path: '/support-center', componentPath: 'pages/support-center.mdx' }");
  });
});

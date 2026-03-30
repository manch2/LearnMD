import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { syncCommand } from './sync';

let tempDir = '';

describe('syncCommand', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = '';
    }
  });

  it('updates learnmd.json based on current MDX lessons', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'learnmd-sync-'));
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir);

    const courseDir = join(tempDir, 'courses', 'architecture');
    await mkdir(join(courseDir, 'lessons'), { recursive: true });
    await writeFile(join(courseDir, 'lessons', 'intro.mdx'), '# Intro');
    await writeFile(join(courseDir, 'lessons', 'advanced.mdx'), '# Advanced');
    await writeFile(join(courseDir, 'learnmd.json'), JSON.stringify({ lessons: [] }, null, 2));

    await syncCommand('architecture', { nonInteractive: true });

    const config = JSON.parse(await readFile(join(courseDir, 'learnmd.json'), 'utf-8'));
    expect(config.lessons).toEqual(['advanced', 'intro']);
  });
});

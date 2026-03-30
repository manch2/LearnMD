import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildCommand } from './build';

const buildMock = vi.fn().mockResolvedValue(undefined);
const readFileMock = vi.fn();
const writeFileMock = vi.fn().mockResolvedValue(undefined);
const readdirMock = vi.fn();

vi.mock('vite', () => ({
  build: (...args: unknown[]) => buildMock(...args),
}));

vi.mock('fs/promises', async () => {
  const actual = await vi.importActual<typeof import('fs/promises')>('fs/promises');
  return {
    ...actual,
    readFile: (...args: unknown[]) => readFileMock(...args),
    writeFile: (...args: unknown[]) => writeFileMock(...args),
    readdir: (...args: unknown[]) => readdirMock(...args),
    mkdir: vi.fn().mockResolvedValue(undefined),
  };
});

describe('buildCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('console', {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    });
  });

  it('builds the frontend and writes a search index for markdown lessons', async () => {
    readdirMock
      .mockResolvedValueOnce(['architecture'])
      .mockResolvedValueOnce(['intro.md']);
    readFileMock.mockResolvedValueOnce('---\ntitle: Intro\n---\n# Intro');

    await buildCommand({ out: 'dist', base: '/docs/' });

    expect(buildMock).toHaveBeenCalledWith(
      expect.objectContaining({
        base: '/docs/',
        build: expect.objectContaining({
          outDir: 'dist',
        }),
      })
    );
    expect(writeFileMock).toHaveBeenCalledWith(
      expect.stringContaining('search-index.json'),
      expect.any(String)
    );
  });
});

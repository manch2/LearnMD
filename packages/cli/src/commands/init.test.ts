import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initCommand } from './init';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

vi.mock('fs/promises', () => {
  const mockFs = {
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
  };
  return {
    ...mockFs,
    default: mockFs,
  };
});

describe('initCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('console', {
      log: vi.fn(),
      error: vi.fn(),
    });
  });

  it('creates the expected starter files', async () => {
    await initCommand();

    expect(mkdir).toHaveBeenCalledWith(join(process.cwd(), '.'), { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(
      join(process.cwd(), 'learnmd.config.ts'),
      expect.stringContaining('contentMaxWidth')
    );
    expect(writeFile).toHaveBeenCalledWith(
      join(process.cwd(), 'learnmd.config.ts'),
      expect.stringContaining('lessonCompletion: 100')
    );
    expect(writeFile).toHaveBeenCalledWith(join(process.cwd(), 'courses/.gitkeep'), '');
  });
});

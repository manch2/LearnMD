import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addLessonCommand } from './add';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Mock fs/promises
vi.mock('fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

describe('addLessonCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('console', {
      log: vi.fn(),
      error: vi.fn(),
    });
  });

  it('should create a lesson file with correct content', async () => {
    const title = 'Test Lesson';
    const slug = 'test-lesson';
    const expectedPath = join(process.cwd(), 'lessons', `${slug}.mdx`);

    await addLessonCommand(title);

    expect(mkdir).toHaveBeenCalledWith(expect.stringContaining('lessons'), { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(
      expectedPath,
      expect.stringContaining('title:'),
    );
    expect(writeFile).toHaveBeenCalledWith(
      expectedPath,
      expect.stringContaining(title),
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Lesson created'));
  });

  it('should handle errors during creation', async () => {
    vi.mocked(writeFile).mockRejectedValueOnce(new Error('Write failed'));
    
    await addLessonCommand('Fail Test');
    
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to create lesson'));
  });
});

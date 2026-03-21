import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addLessonCommand, addCourseCommand } from './add';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';

vi.mock('fs/promises', () => {
  const mockFs = {
    writeFile: vi.fn().mockResolvedValue(undefined),
    mkdir: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockResolvedValue(JSON.stringify({ name: 'test-project', dependencies: { '@learnmd/core': '1.0.0' } })),
  };
  return {
    ...mockFs,
    default: mockFs,
  };
});

describe('addLessonCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('console', {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    });
  });

  it('should create a lesson file with correct content', async () => {
    const title = 'Test Lesson';
    const slug = 'test-lesson';
    const courseSlug = 'demo-course';
    const expectedPath = join(process.cwd(), 'courses', courseSlug, 'lessons', `${slug}.mdx`);

    await addLessonCommand(title, { nonInteractive: true });

    expect(mkdir).toHaveBeenCalledWith(expect.stringContaining(join('courses', courseSlug, 'lessons')), { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(
      expectedPath,
      expect.stringContaining('title:'),
    );
    expect(writeFile).toHaveBeenCalledWith(
      expectedPath,
      expect.stringContaining(title),
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Created lesson'));
  });

  it('should handle errors during creation', async () => {
    vi.mocked(writeFile).mockRejectedValueOnce(new Error('Write failed'));
    
    await addLessonCommand('Fail Test', { nonInteractive: true });
    
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to create lesson'));
  });
});

describe('addCourseCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('console', {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    });
  });

  it('should create a course directory and learnmd.json', async () => {
    const name = 'New Course';
    const slug = 'new-course';
    const expectedCoursePath = join(process.cwd(), 'courses', slug, 'lessons');
    const expectedConfigPath = join(process.cwd(), 'courses', slug, 'learnmd.json');

    await addCourseCommand(name, { nonInteractive: true });

    expect(mkdir).toHaveBeenCalledWith(expectedCoursePath, { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(
      expectedConfigPath,
      expect.stringContaining(name),
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('created successfully'));
  });

  it('should show warning if skip workspace check fails', async () => {
    vi.mocked(readFile).mockRejectedValueOnce(new Error('no package.json'));
    
    await addCourseCommand('No Workspace', { nonInteractive: true });
    
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Warning: This doesn\'t look like a LearnMD project'));
  });

  it('should handle errors during course creation', async () => {
    vi.mocked(mkdir).mockRejectedValueOnce(new Error('Mkdir failed'));
    
    await addCourseCommand('Fail Course', { nonInteractive: true });
    
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to create course directory'));
  });
});

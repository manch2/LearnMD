import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCommand, getCourseConfig } from './create';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';

vi.mock('fs/promises', () => {
  const mockFs = {
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockResolvedValue(JSON.stringify({ name: 'learnmd', workspaces: ['packages/*'] })),
  };
  return {
    ...mockFs,
    default: mockFs,
  };
});

// Mock process.exit to prevent test runner from exiting
const exitMock = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

describe('createCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('console', {
      log: vi.fn(),
      error: vi.fn(),
      blue: vi.fn(),
      green: vi.fn(),
    });
  });

  it('should create basic project structure', async () => {
    const projectName = 'test-project';
    
    await createCommand(projectName);

    expect(mkdir).toHaveBeenCalledWith(projectName, { recursive: true });
    expect(mkdir).toHaveBeenCalledWith(join(projectName, 'courses/demo-course/lessons'), { recursive: true });
    expect(writeFile).toHaveBeenCalledWith(join(projectName, 'index.html'), expect.any(String));
    expect(writeFile).toHaveBeenCalledWith(join(projectName, 'src/App.tsx'), expect.any(String));
    expect(writeFile).toHaveBeenCalledWith(join(projectName, 'learnmd.config.ts'), expect.any(String));
    expect(writeFile).toHaveBeenCalledWith(join(projectName, 'courses/demo-course/learnmd.json'), expect.any(String));

    const appFileCall = vi.mocked(writeFile).mock.calls.find(
      ([path]) => path === join(projectName, 'src/App.tsx')
    );
    expect(appFileCall?.[1]).toContain('ContentPage');
    expect(appFileCall?.[1]).toContain('BrowserRouter basename={import.meta.env.BASE_URL}');
    expect(appFileCall?.[1]).toContain('<MDXProvider components={components}>');

    const cssFileCall = vi.mocked(writeFile).mock.calls.find(
      ([path]) => path === join(projectName, 'src/index.css')
    );
    expect(cssFileCall?.[1]).toContain('html,');
    expect(cssFileCall?.[1]).not.toContain('color-scheme: light dark;');

    const configFileCall = vi.mocked(writeFile).mock.calls.find(
      ([path]) => path === join(projectName, 'learnmd.config.ts')
    );
    expect(configFileCall?.[1]).toContain('contentMaxWidth');
    expect(configFileCall?.[1]).toContain('lessonCompletion: 100');
    expect(configFileCall?.[1]).not.toContain('pointsPerLesson');

    const packageJsonCall = vi.mocked(writeFile).mock.calls.find(
      ([path]) => path === join(projectName, 'package.json')
    );
    expect(packageJsonCall?.[1]).toContain('"@learnmd/core": "workspace:*"');
    expect(packageJsonCall?.[1]).toContain('"@learnmd/default-theme": "workspace:*"');
  });

  it('should handle errors during project creation', async () => {
    vi.mocked(mkdir).mockRejectedValueOnce(new Error('Mkdir failed'));
    
    await expect(createCommand('fail-project')).rejects.toThrow('process.exit called');
    
    expect(console.error).toHaveBeenCalledWith(expect.any(String), expect.any(Error));
    expect(exitMock).toHaveBeenCalledWith(1);
  });
});

describe('getCourseConfig', () => {
  it('should return a valid JSON string with the course name', () => {
    const courseName = 'Test Course';
    const config = JSON.parse(getCourseConfig(courseName));
    
    expect(config.title.en).toBe(courseName);
    expect(config.title.es).toBe(`${courseName} (ES)`);
    expect(config.difficulty).toBe('beginner');
    expect(Array.isArray(config.lessons)).toBe(true);
  });
});

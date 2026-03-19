import { describe, it, expect, beforeEach } from 'vitest';
import { RouterManager } from './index';
import type { Course, CourseFrontmatter } from '../types';

describe('RouterManager', () => {
  let router: RouterManager;
  const mockCourse: Course = {
    id: 'course-1',
    title: 'Test Course',
    lessons: [
      { slug: 'lesson-1', moduleId: 'mod-1', frontmatter: { title: 'L1' }, content: '', sections: [] },
      { slug: 'lesson-2', moduleId: 'mod-1', frontmatter: { title: 'L2' }, content: '', sections: [] },
      { slug: 'lesson-3', moduleId: 'mod-2', frontmatter: { title: 'L3' }, content: '', sections: [] },
    ],
    modules: [
      { id: 'mod-1', title: 'Module 1', lessons: ['lesson-1', 'lesson-2'] },
      { id: 'mod-2', title: 'Module 2', lessons: ['lesson-3'] },
    ],
    frontmatter: { title: 'Test Course' } as CourseFrontmatter,
    basePath: '/test'
  };

  beforeEach(() => {
    router = new RouterManager();
    router.setCourse(mockCourse);
  });

  it('should initialize with course', () => {
    expect(router.getState().currentCourse).toBe('course-1');
  });

  it('should navigate to valid lesson', () => {
    const success = router.navigateToLesson('lesson-1');
    expect(success).toBe(true);
    expect(router.getState().currentLesson).toBe('lesson-1');
    expect(router.getState().currentModule).toBe('mod-1');
  });

  it('should not navigate to invalid lesson', () => {
    const success = router.navigateToLesson('invalid');
    expect(success).toBe(false);
  });

  it('should handle next/previous lesson', () => {
    router.navigateToLesson('lesson-1');
    expect(router.nextLesson()).toBe(true);
    expect(router.getState().currentLesson).toBe('lesson-2');
    
    expect(router.nextLesson()).toBe(true);
    expect(router.getState().currentLesson).toBe('lesson-3');
    
    expect(router.nextLesson()).toBe(false); // End
    
    expect(router.previousLesson()).toBe(true);
    expect(router.getState().currentLesson).toBe('lesson-2');
  });

  it('should calculate progress correctly', () => {
    expect(router.getProgress(['lesson-1'])).toBe(1 / 3 * 100);
    expect(router.getProgress(['lesson-1', 'lesson-2', 'lesson-3'])).toBe(100);
  });

  it('should track history and go back', () => {
    router.navigateToLesson('lesson-1');
    router.navigateToLesson('lesson-2');
    expect(router.getState().history).toContain('lesson-1');
    
    expect(router.goBack()).toBe(true);
    expect(router.getState().currentLesson).toBe('lesson-1');
  });

  it('should generate navigation hierarchy', () => {
    const nav = router.getNavigation(['lesson-1']);
    expect(nav).toHaveLength(2);
    expect(nav[0].title).toBe('Module 1');
    expect(nav[0].children![0].completed).toBe(true);
    expect(nav[1].children![0].id).toBe('lesson-3');
  });

  it('should check lesson availability based on prerequisites', () => {
    expect(router.isLessonAvailable('lesson-1', [])).toBe(true); // First lesson
    expect(router.isLessonAvailable('lesson-2', [])).toBe(false); // L1 not done
    expect(router.isLessonAvailable('lesson-2', ['lesson-1'])).toBe(true); // L1 done
  });
});

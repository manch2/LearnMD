import { describe, it, expect } from 'vitest';
import {
  parseMarkdown,
  parseLesson,
  extractSections,
  extractQuiz,
  getTranslatedString,
} from '../parser';

describe('parseMarkdown', () => {
  it('should parse frontmatter and content', () => {
    const content = `---
title: Test Lesson
duration: 10 minutes
---
# Hello World

This is content.`;

    const result = parseMarkdown(content);

    expect(result.data.title).toBe('Test Lesson');
    expect(result.data.duration).toBe('10 minutes');
    expect(result.content).toContain('# Hello World');
  });

  it('should handle translated strings in frontmatter', () => {
    const content = `---
title:
  en: "English Title"
  es: "Título en Español"
---
# Content`;

    const result = parseMarkdown(content);

    expect(result.data.title).toEqual({
      en: 'English Title',
      es: 'Título en Español',
    });
  });
});

describe('parseLesson', () => {
  it('should parse a complete lesson', () => {
    const content = `---
title: Test Lesson
duration: 15 minutes
difficulty: beginner
---
# Introduction

This is the introduction.`;

    const lesson = parseLesson('test-lesson', content);

    expect(lesson.slug).toBe('test-lesson');
    expect(lesson.frontmatter.title).toBe('Test Lesson');
    expect(lesson.frontmatter.duration).toBe('15 minutes');
    expect(lesson.content).toContain('Introduction');
    expect(lesson.sections).toHaveLength(1);
  });

  it('should extract sections from markdown', () => {
    const content = `# Title

## Section 1

### Subsection

## Section 2`;

    const sections = extractSections(content);

    expect(sections).toHaveLength(4);
    expect(sections[0].level).toBe(1);
    expect(sections[1].level).toBe(2);
    expect(sections[2].level).toBe(3);
    expect(sections[3].level).toBe(2);
  });
});

describe('getTranslatedString', () => {
  it('should return string values as-is', () => {
    const result = getTranslatedString('Simple string', 'en');
    expect(result).toBe('Simple string');
  });

  it('should return translation for specified language', () => {
    const translated = {
      en: 'English',
      es: 'Español',
    };
    expect(getTranslatedString(translated, 'en')).toBe('English');
    expect(getTranslatedString(translated, 'es')).toBe('Español');
  });

  it('should fallback to first available language', () => {
    const translated = {
      fr: 'Français',
      de: 'Deutsch',
    };
    expect(getTranslatedString(translated, 'en')).toBe('Français');
  });
});

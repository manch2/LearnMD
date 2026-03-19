import { describe, it, expect } from 'vitest';
import {
  parseMarkdown,
  parseLesson,
  extractSections,
  extractQuiz,
  extractEmbeddedMedia,
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

  it('should handle headings with extra whitespace', () => {
    const content = `  # Title with leading spaces
###   Title with extra spaces between hashes and text
## Section 2    `;
    const sections = extractSections(content);
    // MD headers don't support leading spaces unless they are 1-3, but our regex is ^#
    // Current regex is /^(#{1,6})\s+([^\s\n\r][^\n\r]*?)\s*$/gm
    // So "  # " will NOT match because of ^. This is correct.
    expect(sections).toHaveLength(2); 
    expect(sections[0].title).toBe('Title with extra spaces between hashes and text');
    expect(sections[1].title).toBe('Section 2');
  });
});

describe('extractEmbeddedMedia', () => {
  it('should extract various video providers correctly', () => {
    const content = `
      <VideoEmbed url="https://youtube.com/watch?v=123" />
      <VideoEmbed url="https://vimeo.com/456" />
      <VideoEmbed url="https://onedrive.live.com/embed?id=789" />
      <VideoEmbed url="https://drive.google.com/file/d/abc" />
      <VideoEmbed url="https://malicious.com?target=youtube.com" />
    `;
    const media = extractEmbeddedMedia(content);
    expect(media).toHaveLength(5);
    expect(media[0].provider).toBe('youtube');
    expect(media[1].provider).toBe('vimeo');
    expect(media[2].provider).toBe('onedrive');
    expect(media[3].provider).toBe('googledrive');
    expect(media[4].provider).toBeUndefined();
  });

  it('should handle malformed URLs gracefully', () => {
    const content = `<VideoEmbed url="not-a-url" />`;
    const media = extractEmbeddedMedia(content);
    expect(media).toHaveLength(1);
    expect(media[0].provider).toBeUndefined();
  });

  it('should reject non-http protocols', () => {
    const content = `<VideoEmbed url="javascript:alert(1)" />`;
    const media = extractEmbeddedMedia(content);
    expect(media).toHaveLength(1);
    expect(media[0].provider).toBeUndefined();
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

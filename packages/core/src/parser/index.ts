import matter from 'gray-matter';
import { marked } from 'marked';
import type { Lesson, CourseFrontmatter, TranslatedString, LessonSection } from '../types';

/**
 * Parse Markdown content with frontmatter
 */
export function parseMarkdown(content: string): { data: CourseFrontmatter; content: string } {
  const result = matter(content);
  return {
    data: result.data as CourseFrontmatter,
    content: result.content,
  };
}

/**
 * Extract translated string based on current language
 */
export function getTranslatedString(
  value: string | TranslatedString | undefined,
  lang: string
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value[Object.keys(value)[0]] || '';
}

/**
 * Parse markdown to HTML
 */
export function markdownToHtml(markdown: string): string {
  return marked(markdown) as string;
}

/**
 * Extract sections (headings) from markdown content
 */
export function extractSections(markdown: string): LessonSection[] {
  const sections: LessonSection[] = [];
  const headingRegex = /^(#{1,6})\s+([^\n\r]+)$/gm;
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    sections.push({
      id,
      title,
      level,
    });
  }

  return sections;
}

/**
 * Extract quiz from markdown content using custom syntax
 */
export function extractQuiz(markdown: string, slug: string): Lesson['quiz'] {
  const quizRegex = /<Quiz\s+question=["']([^"']*)["']\s+options=\{([^{}]*)\}\s+correct=\{([0-9]+)\}/g;
  const questions: NonNullable<Lesson['quiz']>['questions'] = [];
  let match;

  while ((match = quizRegex.exec(markdown)) !== null) {
    const question = match[1];
    const optionsStr = match[2];
    const correctIndex = parseInt(match[3], 10);

    // Parse options array
    const options = optionsStr
      .split(',')
      .map((opt) => opt.trim().replace(/["']/g, ''))
      .map((label, index) => ({
        id: `opt-${index}`,
        label,
        isCorrect: index === correctIndex,
      }));

    questions.push({
      id: `question-${questions.length}`,
      type: 'multiple-choice',
      question,
      options,
      correctAnswer: `opt-${correctIndex}`,
      points: 10,
    });
  }

  if (questions.length === 0) {
    return undefined;
  }

  return {
    id: `quiz-${slug}`,
    questions,
    passingScore: 70,
    allowRetry: true,
    showCorrectAnswers: true,
  };
}

/**
 * Parse a complete lesson from markdown content
 */
export function parseLesson(slug: string, content: string, lang = 'en'): Lesson {
  const { data: frontmatter, content: markdownContent } = parseMarkdown(content);
  const html = markdownToHtml(markdownContent);
  const sections = extractSections(markdownContent);
  const quiz = extractQuiz(markdownContent, slug);

  // Handle i18n for title
  const title = getTranslatedString(frontmatter.title, lang);

  return {
    slug,
    frontmatter: {
      ...frontmatter,
      title,
    },
    content: markdownContent,
    html,
    sections,
    quiz,
  };
}

/**
 * Parse multiple lessons into a course structure
 */
export interface ParseCourseOptions {
  basePath: string;
  defaultLanguage?: string;
}

export async function parseCourse(
  lessons: Array<{ slug: string; content: string }>,
  options: ParseCourseOptions
): Promise<{ lessons: Lesson[] }> {
  const { defaultLanguage = 'en' } = options;

  const parsedLessons = lessons.map((lesson) =>
    parseLesson(lesson.slug, lesson.content, defaultLanguage)
  );

  return {
    lessons: parsedLessons,
  };
}

/**
 * Get all code blocks from markdown content
 */
export function extractCodeBlocks(markdown: string): Array<{ language: string; code: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string }> = [];
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }

  return blocks;
}

/**
 * Extract embedded media from markdown content
 */
export function extractEmbeddedMedia(markdown: string): Array<{
  type: 'video' | 'image' | 'audio';
  url: string;
  provider?: string;
}> {
  const media: Array<{ type: 'video' | 'image' | 'audio'; url: string; provider?: string }> = [];

  // Extract video embeds
  const videoRegex = /<VideoEmbed\s+[^>]*url=["']([^"']+)["'][^>]*>/g;
  let match;

  const isDomain = (urlStr: string, domains: string[]): boolean => {
    try {
      const url = new URL(urlStr);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
      const hostname = url.hostname.toLowerCase();
      return domains.some((d) => {
        const domain = d.toLowerCase();
        return hostname === domain || hostname.endsWith('.' + domain);
      });
    } catch {
      return false;
    }
  };

  while ((match = videoRegex.exec(markdown)) !== null) {
    const url = match[1];
    let provider: string | undefined;

    if (isDomain(url, ['youtube.com', 'youtu.be'])) {
      provider = 'youtube';
    } else if (isDomain(url, ['vimeo.com'])) {
      provider = 'vimeo';
    } else if (isDomain(url, ['onedrive.live.com'])) {
      provider = 'onedrive';
    } else if (isDomain(url, ['drive.google.com'])) {
      provider = 'googledrive';
    }

    media.push({ type: 'video', url, provider });
  }

  // Extract images
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  while ((match = imageRegex.exec(markdown)) !== null) {
    media.push({ type: 'image', url: match[2] });
  }

  return media;
}

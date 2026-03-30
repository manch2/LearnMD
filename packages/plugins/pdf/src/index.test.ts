import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { PluginContext, UserProfile } from '@learnmd/core';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';

const addImage = vi.fn();
const save = vi.fn();
const setLineWidth = vi.fn();
const rect = vi.fn();
const setFont = vi.fn();
const setFontSize = vi.fn();
const setTextColor = vi.fn();
const text = vi.fn();
const line = vi.fn();

vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => ({
    addImage,
    save,
    setLineWidth,
    rect,
    setFont,
    setFontSize,
    setTextColor,
    text,
    line,
  })),
}));

vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

import { PDFPlugin } from './index';

describe('PDFPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('registers the profile course action slot with certificate metadata', () => {
    const registerComponent = vi.fn();
    const plugin = new PDFPlugin({ signature: 'LearnMD Team' });

    const context: PluginContext = {
      course: {
        id: 'demo-course',
        title: 'Demo Course',
        lessons: [],
        modules: [],
        frontmatter: { title: 'Demo Course' },
        basePath: '/courses/demo-course',
      },
      storage: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
        clear: vi.fn(),
        keys: vi.fn(),
        getUserProfile: vi.fn(),
        saveUserProfile: vi.fn(),
        getCourseProgress: vi.fn(),
        saveCourseProgress: vi.fn(),
        getAllCourseProgress: vi.fn(),
        getLessonProgress: vi.fn(),
        updateLessonProgress: vi.fn(),
        completeLesson: vi.fn(),
      },
      i18n: {
        currentLanguage: 'en',
        availableLanguages: ['en', 'es'],
        setLanguage: vi.fn(),
        translate: vi.fn((key: string) => key),
        translateObject: vi.fn((value) => value),
      },
      registerComponent,
      registerHook: vi.fn(),
      config: {},
    } as unknown as PluginContext;

    plugin.onLoad(context);

    expect(registerComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        slot: 'profile:courseActions',
        name: 'pdf-certificate-download',
        metadata: {
          isCertificateAvailable: true,
        },
      })
    );
  });

  it('renders the registered action component and generates a certificate on click', async () => {
    const registerComponent = vi.fn();
    const plugin = new PDFPlugin({ signature: 'LearnMD Team' });

    const context: PluginContext = {
      course: {
        id: 'demo-course',
        title: 'Demo Course',
        lessons: [],
        modules: [],
        frontmatter: { title: 'Demo Course' },
        basePath: '/courses/demo-course',
      },
      storage: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
        clear: vi.fn(),
        keys: vi.fn(),
        getUserProfile: vi.fn(),
        saveUserProfile: vi.fn(),
        getCourseProgress: vi.fn(),
        saveCourseProgress: vi.fn(),
        getAllCourseProgress: vi.fn(),
        getLessonProgress: vi.fn(),
        updateLessonProgress: vi.fn(),
        completeLesson: vi.fn(),
      },
      i18n: {
        currentLanguage: 'en',
        availableLanguages: ['en', 'es'],
        setLanguage: vi.fn(),
        translate: vi.fn((key: string) => key),
        translateObject: vi.fn((value) => value),
      },
      registerComponent,
      registerHook: vi.fn(),
      config: {},
    } as unknown as PluginContext;

    plugin.onLoad(context);

    const registration = registerComponent.mock.calls[0][0];
    const Component = registration.component as React.ComponentType<Record<string, unknown>>;
    const generateSpy = vi.spyOn(plugin, 'generateCertificate').mockResolvedValue(undefined);

    render(
      React.createElement(Component, {
        plugin,
        profile: {
          id: 'user-1',
          name: 'Ada Lovelace',
          globalScore: 100,
          totalPoints: 100,
          badges: [],
          achievements: [],
          coursesProgress: {},
          streak: { current: 0, longest: 0, lastActiveDate: '' },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        courseId: 'systems-design',
        progress: { completedAt: Date.now() },
        translate: () => 'Download certificate',
      })
    );

    fireEvent.click(screen.getByRole('button', { name: 'Download certificate' }));

    await waitFor(() => {
      expect(generateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Ada Lovelace' }),
        expect.objectContaining({ courseTitle: 'systems-design' })
      );
    });
  });

  it('returns early outside the browser when generating a certificate', async () => {
    const plugin = new PDFPlugin();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;

    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const profile: UserProfile = {
      id: 'user-1',
      name: 'Ada Lovelace',
      globalScore: 100,
      totalPoints: 100,
      badges: [],
      achievements: [],
      coursesProgress: {},
      streak: { current: 0, longest: 0, lastActiveDate: '' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await plugin.generateCertificate(profile, { courseTitle: 'Systems Design' });

    expect(warnSpy).toHaveBeenCalledWith('generateCertificate must be called in a browser environment');

    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: originalDocument,
      configurable: true,
      writable: true,
    });
  });

  it('generates the default PDF flow in the browser environment', async () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      createElement: vi.fn(),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    });

    const plugin = new PDFPlugin();
    const profile: UserProfile = {
      id: 'user-1',
      name: 'Ada Lovelace',
      globalScore: 100,
      totalPoints: 100,
      badges: [],
      achievements: [],
      coursesProgress: {},
      streak: { current: 0, longest: 0, lastActiveDate: '' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await plugin.generateCertificate(profile, { courseTitle: 'Systems Design' });

    expect(save).toHaveBeenCalled();
    expect(text).toHaveBeenCalled();
  });

  it('renders the React template flow before exporting the PDF', async () => {
    const appendChild = vi.fn();
    const removeChild = vi.fn();
    const container = {
      style: {} as Record<string, string>,
    };

    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      createElement: vi.fn(() => container),
      body: {
        appendChild,
        removeChild,
      },
    });

    vi.mocked(html2canvas).mockResolvedValue({
      toDataURL: vi.fn(() => 'data:image/png;base64,test'),
    } as unknown as ReturnType<typeof html2canvas>);

    const renderMock = vi.fn();
    const unmountMock = vi.fn();
    vi.mocked(createRoot).mockReturnValue({
      render: renderMock,
      unmount: unmountMock,
    } as unknown as ReturnType<typeof createRoot>);

    const plugin = new PDFPlugin({ template: React.createElement('div', null, 'Certificate template') });
    const profile: UserProfile = {
      id: 'user-1',
      name: 'Ada Lovelace',
      globalScore: 100,
      totalPoints: 100,
      badges: [],
      achievements: [],
      coursesProgress: {},
      streak: { current: 0, longest: 0, lastActiveDate: '' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await plugin.generateCertificate(profile, { courseTitle: 'Systems Design' });

    expect(createRoot).toHaveBeenCalledWith(container);
    expect(renderMock).toHaveBeenCalled();
    expect(html2canvas).toHaveBeenCalledWith(container, { scale: 2 });
    expect(addImage).toHaveBeenCalled();
    expect(unmountMock).toHaveBeenCalled();
    expect(removeChild).toHaveBeenCalledWith(container);
  });
});

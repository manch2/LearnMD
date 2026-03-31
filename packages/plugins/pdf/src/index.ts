import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BasePlugin, PluginContext, UserProfile, CourseProgress } from '@learnmd/core';

import { ClassicCertificate } from './templates/ClassicCertificate';
import { ModernCertificate } from './templates/ModernCertificate';

export interface CertificateTemplateProps {
  courseTitle: string;
  studentName: string;
  completionDate: Date;
  signature?: string;
}

export type BuiltInTemplate = 'classic' | 'modern';
export type TemplateType = BuiltInTemplate | React.ComponentType<CertificateTemplateProps>;

export interface CertificateOptions {
  courseTitle: string;
  completionDate?: Date;
  signature?: string;
  template?: TemplateType;
}

export interface PDFPluginConfig {
  signature?: string;
  defaultTemplate?: TemplateType;
  courseTemplates?: Record<string, TemplateType>;
}

interface ProfileCourseActionProps {
  profile?: UserProfile | null;
  courseId?: string;
  progress?: CourseProgress;
  translate?: (key: string) => string;
}

export class PDFPlugin extends BasePlugin {
  constructor(config: PDFPluginConfig = {}) {
    super('pdf', '1.1.0', config as Record<string, unknown>);
  }

  onLoad(ctx: PluginContext): void {
    ctx.registerComponent({
      slot: 'profile:courseActions',
      name: 'pdf-certificate-download',
      order: 100,
      metadata: {
        isCertificateAvailable: true,
      },
      component: (props: ProfileCourseActionProps) =>
        React.createElement(PDFProfileCourseAction, { plugin: this, ...props }),
    });

    console.log('PDF Plugin loaded');
  }

  async generateCertificate(profile: UserProfile, options: CertificateOptions): Promise<void> {
    if (typeof window === 'undefined') {
      console.warn('generateCertificate must be called in a browser environment');
      return;
    }

    const {
      courseTitle,
      completionDate = new Date(),
      signature = options.signature || (this.config as PDFPluginConfig | undefined)?.signature || 'LearnMD Instructors',
      template = options.template,
    } = options;

    const config = this.config as PDFPluginConfig | undefined;
    
    // Resolve template
    let resolvedTemplate: TemplateType = 'classic';
    if (template) {
      resolvedTemplate = template;
    } else if (config?.courseTemplates && config.courseTemplates[options.courseTitle]) {
      resolvedTemplate = config.courseTemplates[options.courseTitle];
    } else if (config?.defaultTemplate) {
      resolvedTemplate = config.defaultTemplate;
    }

    const TemplateComponent = 
      resolvedTemplate === 'modern' ? ModernCertificate : 
      resolvedTemplate === 'classic' ? ClassicCertificate : 
      resolvedTemplate as React.ComponentType<CertificateTemplateProps>;

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '11in';
    container.style.height = '8.5in';
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(React.createElement(TemplateComponent, {
      courseTitle,
      studentName: profile.name || 'Student Name',
      completionDate,
      signature
    }));

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: 'letter'
      });
      doc.addImage(imgData, 'PNG', 0, 0, 11, 8.5);
      doc.save(`Certificate-${courseTitle.replace(/\\s+/g, '-')}.pdf`);
    } finally {
      root.unmount();
      document.body.removeChild(container);
    }
  }
}

function PDFProfileCourseAction({
  plugin,
  profile,
  courseId,
  progress,
  translate,
}: ProfileCourseActionProps & { plugin: PDFPlugin }) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!profile || !courseId) {
    return null;
  }

  const isCompleted = !!progress?.completedAt;
  const label = translate?.('profile.download') || 'Download Certificate';

  const handleClick = async () => {
    setIsGenerating(true);
    try {
      await plugin.generateCertificate(profile, {
        courseTitle: courseId,
        completionDate: progress?.completedAt ? new Date(progress.completedAt) : undefined,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return React.createElement(
    'button',
    {
      onClick: handleClick,
      disabled: isGenerating || !isCompleted,
      title: !isCompleted ? (translate?.('profile.complete_to_download') || 'Complete the course to download') : undefined,
      className:
        `text-sm px-4 py-1.5 font-medium border border-[rgb(var(--color-primary-500))] text-[rgb(var(--color-primary-500))] rounded transition-colors ${
          !isCompleted || isGenerating 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-[rgb(var(--color-primary-500))] hover:text-white'
        }`
    },
    isGenerating ? 'Generating...' : label
  );
}

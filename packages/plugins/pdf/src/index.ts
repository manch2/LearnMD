import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BasePlugin, PluginContext, UserProfile, CourseProgress } from '@learnmd/core';

export interface CertificateOptions {
  courseTitle: string;
  completionDate?: Date;
  signature?: string;
  template?: React.ReactNode;
}

export interface PDFPluginConfig {
  signature?: string;
  template?: React.ReactNode;
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
      template = options.template || (this.config as PDFPluginConfig | undefined)?.template,
    } = options;

    if (template) {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '11in';
      container.style.height = '8.5in';
      container.style.backgroundColor = 'white';
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(React.createElement(React.Fragment, null, template));

      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const canvas = await html2canvas(container, { scale: 2 });
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
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: 'letter'
    });

    // Add border
    doc.setLineWidth(0.1);
    doc.rect(0.5, 0.5, 10, 7.5);
    doc.setLineWidth(0.02);
    doc.rect(0.6, 0.6, 9.8, 7.3);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(59, 130, 246); // Blue
    doc.text('Certificate of Completion', 5.5, 2.5, { align: 'center' });

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(20);
    doc.setTextColor(100, 100, 100);
    doc.text('This is to certify that', 5.5, 3.5, { align: 'center' });

    // Student Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(0, 0, 0);
    doc.text(profile.name || 'Student Name', 5.5, 4.5, { align: 'center' });

    // Course Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('has successfully completed the course', 5.5, 5.3, { align: 'center' });

    // Course Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text(courseTitle, 5.5, 6.0, { align: 'center' });

    // Date and Signature labels
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    
    const dateStr = completionDate.toLocaleDateString();
    doc.text(dateStr, 2.5, 7.2, { align: 'center' });
    doc.text('Date', 2.5, 7.5, { align: 'center' });
    doc.line(1.5, 7.3, 3.5, 7.3);

    doc.text(signature, 8.5, 7.2, { align: 'center' });
    doc.text('Signature', 8.5, 7.5, { align: 'center' });
    doc.line(7.5, 7.3, 9.5, 7.3);

    // Save the PDF
    doc.save(`Certificate-${courseTitle.replace(/\\s+/g, '-')}.pdf`);
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

  if (!profile || !courseId || !progress?.completedAt) {
    return null;
  }

  const label = translate?.('profile.download') || 'Download Certificate';

  const handleClick = async () => {
    setIsGenerating(true);
    try {
      await plugin.generateCertificate(profile, {
        courseTitle: courseId,
        completionDate: progress.completedAt ? new Date(progress.completedAt) : undefined,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return React.createElement(
    'button',
    {
      onClick: handleClick,
      disabled: isGenerating,
      className:
        'text-sm px-4 py-1.5 font-medium border border-[rgb(var(--color-primary-500))] text-[rgb(var(--color-primary-500))] hover:bg-[rgb(var(--color-primary-500))] hover:text-white rounded transition-colors disabled:opacity-50',
    },
    isGenerating ? 'Generating...' : label
  );
}

import { jsPDF } from 'jspdf';
import type { UserProfile } from '../../types';

export interface CertificateOptions {
  courseTitle: string;
  completionDate?: Date;
  signature?: string;
}

export async function generateCertificate(profile: UserProfile, options: CertificateOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: 'letter'
  });

  const { courseTitle, completionDate = new Date(), signature = 'LearnMD Instructors' } = options;

  // Add border
  doc.setLineWidth(0.1);
  doc.rect(0.5, 0.5, 10, 7.5);
  doc.setLineWidth(0.02);
  doc.rect(0.6, 0.6, 9.8, 7.3);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(40);
  doc.setTextColor(59, 130, 246); // Emerald-ish or Blue
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
  doc.save(`Certificate-${courseTitle.replace(/\s+/g, '-')}.pdf`);
}

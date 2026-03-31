import React from 'react';
import { CertificateTemplateProps } from '@learnmd/plugin-pdf';

export const CustomBrandCertificate: React.FC<CertificateTemplateProps> = ({ 
  courseTitle, 
  studentName, 
  completionDate, 
  signature 
}) => {
  return (
    <div style={{
      width: '11in', 
      height: '8.5in', 
      backgroundColor: '#f8fafc', 
      color: '#334155', 
      display: 'flex', 
      fontFamily: '"Inter", sans-serif', 
      position: 'relative', 
      overflow: 'hidden',
      boxSizing: 'border-box',
      border: '0.2in solid #0f172a'
    }}>
      {/* Decorative sidebar */}
      <div style={{
        width: '3in',
        height: '100%',
        backgroundColor: '#0f172a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0.4in',
        boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: '1in' }}>
          <h2 style={{ fontSize: '24pt', fontWeight: 800, margin: 0, letterSpacing: '0.05em' }}>ACME Corp</h2>
          <p style={{ color: '#94a3b8', fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '5px' }}>
            Enterprise Training
          </p>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '12pt', fontWeight: 600, color: '#e2e8f0', margin: '0 0 5px' }}>VERIFIED ISSUANCE</p>
          <p style={{ fontSize: '10pt', color: '#94a3b8', margin: 0 }}>Certificate ID: ACME-{Math.floor(Math.random() * 100000)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '0.8in 0.6in',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ color: '#0f172a', fontSize: '38pt', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 0.5in' }}>
          Official <br/> Certification
        </h1>
        
        <p style={{ color: '#64748b', fontSize: '16pt', margin: '0 0 0.2in', fontWeight: 500 }}>
          This acknowledges that
        </p>
        
        <h2 style={{ fontSize: '40pt', fontWeight: 700, margin: '0 0 0.2in', color: '#3b82f6' }}>
          {studentName || 'Student Name'}
        </h2>
        
        <div style={{ width: '100px', height: '4px', backgroundColor: '#3b82f6', margin: '0 0 0.4in' }}></div>
        
        <p style={{ color: '#64748b', fontSize: '16pt', margin: '0 0 0.2in', fontWeight: 500 }}>
          Has successfully passed all requirements for:
        </p>
        <h3 style={{ color: '#0f172a', fontSize: '28pt', fontWeight: 700, margin: '0 0 auto' }}>
          {courseTitle}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1in', marginTop: '0.5in' }}>
          <div>
            <p style={{ fontSize: '14pt', margin: '0 0 5px', fontWeight: 600 }}>{completionDate.toLocaleDateString()}</p>
            <p style={{ color: '#94a3b8', fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Awarded On</p>
          </div>
          <div>
            <p style={{ fontSize: '14pt', margin: '0 0 5px', fontWeight: 600, fontStyle: 'italic', fontFamily: 'serif' }}>{signature || 'LearnMD Instructors'}</p>
            <p style={{ color: '#94a3b8', fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

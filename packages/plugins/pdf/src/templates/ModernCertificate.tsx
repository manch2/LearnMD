import React from 'react';
import { CertificateTemplateProps } from '../index';

export const ModernCertificate: React.FC<CertificateTemplateProps> = ({ 
  courseTitle, 
  studentName, 
  completionDate, 
  signature 
}) => {
  return (
    <div style={{
      width: '11in', 
      height: '8.5in', 
      backgroundColor: '#0f172a', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      position: 'relative', 
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <div style={{ position: 'absolute', top: '-2in', left: '-2in', width: '6in', height: '6in', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '-2in', right: '-2in', width: '6in', height: '6in', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%' }}></div>
      
      <div style={{ zIndex: 1, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '0.8in 1in', borderRadius: '24px', width: '9in', boxSizing: 'border-box' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '32pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.3in' }}>
          Certificate of Achievement
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '18pt', margin: '0 0 0.4in' }}>Proudly presented to</p>
        
        <h2 style={{ fontSize: '42pt', fontWeight: 700, margin: '0 0 0.4in' }}>{studentName || 'Student Name'}</h2>
        
        <div style={{ width: '80px', height: '4px', backgroundColor: '#10b981', margin: '0 auto 0.4in' }}></div>
        
        <p style={{ color: '#94a3b8', fontSize: '16pt', margin: '0 0 0.2in' }}>For the successful completion of</p>
        <h3 style={{ color: '#10b981', fontSize: '26pt', fontWeight: 600, margin: '0 0 0.6in' }}>{courseTitle}</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5in', padding: '0 0.5in', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5in' }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '14pt', margin: '0 0 5px' }}>{completionDate.toLocaleDateString()}</p>
            <p style={{ color: '#94a3b8', fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Date</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14pt', margin: '0 0 5px', fontStyle: 'italic' }}>{signature || 'LearnMD Instructors'}</p>
            <p style={{ color: '#94a3b8', fontSize: '10pt', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

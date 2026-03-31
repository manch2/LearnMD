import React from 'react';
import { CertificateTemplateProps } from '../index';

export const ClassicCertificate: React.FC<CertificateTemplateProps> = ({ 
  courseTitle, 
  studentName, 
  completionDate, 
  signature 
}) => {
  return (
    <div style={{
      width: '11in', 
      height: '8.5in', 
      padding: '0.5in', 
      backgroundColor: 'white', 
      boxSizing: 'border-box', 
      position: 'relative',
      fontFamily: 'Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        width: '10in', 
        height: '7.5in', 
        border: '0.1in solid #000', 
        padding: '0.1in', 
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '9.6in', 
          height: '7.1in', 
          border: '0.02in solid #000', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}>
          <h1 style={{ color: '#3b82f6', fontSize: '40pt', fontWeight: 'bold', margin: '0 0 0.5in' }}>
            Certificate of Completion
          </h1>
          <p style={{ color: '#64748b', fontSize: '20pt', margin: '0 0 0.5in' }}>
            This is to certify that
          </p>
          <h2 style={{ color: 'black', fontSize: '30pt', fontWeight: 'bold', margin: '0 0 0.5in' }}>
            {studentName || 'Student Name'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '16pt', margin: '0 0 0.5in' }}>
            has successfully completed the course
          </p>
          <h3 style={{ color: '#10b981', fontSize: '24pt', fontWeight: 'bold', margin: '0 0 1in' }}>
            {courseTitle}
          </h3>
          
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', position: 'absolute', bottom: '0.5in' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14pt', margin: '0 0 5px' }}>{completionDate.toLocaleDateString()}</p>
              <div style={{ width: '2in', borderTop: '1px solid black' }}></div>
              <p style={{ fontSize: '14pt', margin: '5px 0 0' }}>Date</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14pt', margin: '0 0 5px' }}>{signature || 'LearnMD Instructors'}</p>
              <div style={{ width: '2in', borderTop: '1px solid black' }}></div>
              <p style={{ fontSize: '14pt', margin: '5px 0 0' }}>Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

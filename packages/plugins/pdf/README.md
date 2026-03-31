# @learnmd/plugin-pdf

The `PDFPlugin` allows your LearnMD app to generate PDF certificates for users who complete courses. It comes with built-in templates and supports injecting custom React templates per course.

## Installation

```bash
npm install @learnmd/plugin-pdf
```

## Basic Setup

Add the plugin to your `learnmd.config.ts`:

```typescript
import { defineConfig } from '@learnmd/core';
import { PDFPlugin } from '@learnmd/plugin-pdf';

export default defineConfig({
  plugins: [
    new PDFPlugin({
      signature: 'LearnMD Team',
    }),
  ],
});
```

## Customizing Templates

The plugin renders templates using `html2canvas` and `jsPDF`. The plugin comes with two built-in templates:
- `'classic'` (default)
- `'modern'`

You can map specific templates to a specific course by providing `courseTemplates` to the config, or set a general `defaultTemplate`.

```typescript
import { PDFPlugin, CertificateTemplateProps } from '@learnmd/plugin-pdf';
import React from 'react';

// Create a custom functional component
const MyCompanyCertificate: React.FC<CertificateTemplateProps> = ({ 
  courseTitle, 
  studentName, 
  completionDate 
}) => {
  return (
    <div style={{ width: '11in', height: '8.5in', padding: '1in', background: 'white' }}>
      <h1>{studentName}</h1>
      <p>Has completed {courseTitle} on {completionDate.toLocaleDateString()}</p>
    </div>
  );
};

new PDFPlugin({
  signature: 'Lead Instructor',
  defaultTemplate: 'classic',
  courseTemplates: {
    'onboarding-course': 'modern', // Uses built-in modern template
    'advanced-course': MyCompanyCertificate // Uses your custom React component
  }
});
```

## API

### `PDFPluginConfig`
- `signature` (`string`): Fallback signature string for templates that utilize it.
- `defaultTemplate` (`'classic' | 'modern' | React.ComponentType`): Template to use if a course does not specify one.
- `courseTemplates` (`Record<string, TemplateType>`): A map correlating a `courseId` with a specific template.

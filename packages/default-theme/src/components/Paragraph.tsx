import React from 'react';
import { useI18n } from '../hooks';

export interface ParagraphProps {
  i18n?: string;
  children: React.ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  const { currentLanguage } = useI18n();

  // If children is an array, try to find the one matching the current language tag
  let matchedChild: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      // For elements like <en> or <es>, the type is the string 'en' or 'es'
      if (typeof child.type === 'string' && child.type === currentLanguage) {
        matchedChild = child.props.children;
      }
    }
  });

  // Fallback to displaying all children if no specific language tag is found
  if (!matchedChild) {
    matchedChild = children;
  }

  return <div className="mb-4">{matchedChild}</div>;
}

export default Paragraph;

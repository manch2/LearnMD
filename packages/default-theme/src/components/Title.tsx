import React from 'react';
import { useI18n } from '../hooks';

export interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export function Title({ level = 1, children }: TitleProps) {
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

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  // Since it's often used in prose, it might inherit some styles, but we can set defaults
  const className = `mb-4 font-bold text-gray-900 dark:text-white ${
    level === 1 ? 'text-4xl mt-8' :
    level === 2 ? 'text-3xl mt-6' :
    level === 3 ? 'text-2xl mt-6' :
    level === 4 ? 'text-xl mt-4' :
    level === 5 ? 'text-lg mt-4' :
    'text-base mt-4'
  }`;

  return <Tag className={className}>{matchedChild}</Tag>;
}

export default Title;

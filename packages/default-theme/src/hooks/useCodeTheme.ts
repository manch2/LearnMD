import { useState, useEffect } from 'react';

type CodeTheme = 'light' | 'dark';

export function useCodeTheme() {
  const [codeTheme, setCodeTheme] = useState<CodeTheme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('learnmd-code-theme') as CodeTheme | null;
    if (savedTheme) {
      setCodeTheme(savedTheme);
      document.documentElement.setAttribute('data-code-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-code-theme', 'dark');
    }
  }, []);

  const toggleCodeTheme = () => {
    const newTheme = codeTheme === 'dark' ? 'light' : 'dark';
    setCodeTheme(newTheme);
    localStorage.setItem('learnmd-code-theme', newTheme);
    document.documentElement.setAttribute('data-code-theme', newTheme);
  };

  return { codeTheme, toggleCodeTheme };
}

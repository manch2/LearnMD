import React, { type ReactNode, useState } from 'react';
import { ThemeProvider, useTheme, useI18n } from '../hooks';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLearnMD } from '@learnmd/core';
import { Link } from 'react-router-dom';

export interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function MainLayout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[rgb(var(--bg-primary))]">{children}</div>
    </ThemeProvider>
  );
}

export interface HeaderProps {
  logo?: ReactNode;
  title?: string;
  showThemeToggle?: boolean;
  showSearch?: boolean;
  showLanguageSwitcher?: boolean;
  actions?: ReactNode;
  navigation?: { label: string | Record<string, string>; path: string }[];
}

export function Header({
  logo,
  title,
  showThemeToggle = true,
  showLanguageSwitcher = true,
  actions,
  navigation: manualNavigation,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentLanguage } = useI18n();
  const { config } = useLearnMD();

  const navigation = manualNavigation || config.navigation || [];

  return (
    <header className="sticky top-0 z-40 bg-[rgb(var(--bg-primary))]/95 backdrop-blur border-b border-[rgb(var(--border-color))]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {logo || (
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-xl">LearnMD</span>
              </Link>
            )}
            {title && (
              <span className="hidden md:block text-[rgb(var(--text-secondary))]">/ {title}</span>
            )}
            {navigation.length > 0 && (
              <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium">
                {navigation.map((item: any, idx: number) => {
                  const label = typeof item.label === 'string' 
                    ? item.label 
                    : item.label[currentLanguage] || Object.values(item.label)[0];
                  return (
                    <Link key={idx} to={item.path} className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors">
                      {label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {actions}
            <Link
              to="/profile"
              className="p-2 rounded-lg flex items-center justify-center hover:bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
              title="User Profile"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            {showLanguageSwitcher && (
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
            )}
            {showThemeToggle && <ThemeToggle />}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[rgb(var(--border-color))]">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item: any, idx: number) => {
              const label = typeof item.label === 'string' 
                ? item.label 
                : item.label[currentLanguage] || Object.values(item.label)[0];
              return (
                <Link key={idx} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]">
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

export default MainLayout;

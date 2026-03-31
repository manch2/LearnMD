import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLearnMD } from '@learnmd/core';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type RGBTuple = [number, number, number];

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function clampColorChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseColor(value?: string | null): RGBTuple | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (/^\d+\s+\d+\s+\d+$/.test(trimmed)) {
    const [r, g, b] = trimmed.split(/\s+/).map((channel) => clampColorChannel(Number(channel)));
    return [r, g, b];
  }

  const rgbMatch = trimmed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
  if (rgbMatch) {
    return [
      clampColorChannel(Number(rgbMatch[1])),
      clampColorChannel(Number(rgbMatch[2])),
      clampColorChannel(Number(rgbMatch[3])),
    ];
  }

  const hex = trimmed.replace('#', '');
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [
      clampColorChannel(parseInt(hex.slice(0, 2), 16)),
      clampColorChannel(parseInt(hex.slice(2, 4), 16)),
      clampColorChannel(parseInt(hex.slice(4, 6), 16)),
    ];
  }

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return [
      clampColorChannel(parseInt(`${hex[0]}${hex[0]}`, 16)),
      clampColorChannel(parseInt(`${hex[1]}${hex[1]}`, 16)),
      clampColorChannel(parseInt(`${hex[2]}${hex[2]}`, 16)),
    ];
  }

  return null;
}

function toCssRgb(value: RGBTuple): string {
  return value.join(' ');
}

function mixColor(base: RGBTuple, target: RGBTuple, amount: number): RGBTuple {
  const ratio = Math.max(0, Math.min(1, amount));
  return [
    clampColorChannel(base[0] + (target[0] - base[0]) * ratio),
    clampColorChannel(base[1] + (target[1] - base[1]) * ratio),
    clampColorChannel(base[2] + (target[2] - base[2]) * ratio),
  ];
}

function createScale(base: RGBTuple, mode: 'light' | 'dark'): Record<number, RGBTuple> {
  const white: RGBTuple = [255, 255, 255];
  const black: RGBTuple = [0, 0, 0];
  const brightenTarget = mode === 'light' ? white : black;
  const deepenTarget = mode === 'light' ? black : white;

  return {
    50: mixColor(base, brightenTarget, 0.92),
    100: mixColor(base, brightenTarget, 0.82),
    200: mixColor(base, brightenTarget, 0.68),
    300: mixColor(base, brightenTarget, 0.48),
    400: mixColor(base, brightenTarget, 0.22),
    500: base,
    600: mixColor(base, deepenTarget, 0.12),
    700: mixColor(base, deepenTarget, 0.24),
    800: mixColor(base, deepenTarget, 0.38),
    900: mixColor(base, deepenTarget, 0.52),
  };
}

function setColorScale(root: HTMLElement, prefix: string, color: string | undefined, mode: 'light' | 'dark') {
  const parsed = parseColor(color);
  if (!parsed) {
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((shade) => {
      root.style.removeProperty(`--${prefix}-${shade}`);
    });
    return;
  }

  const scale = createScale(parsed, mode);
  Object.entries(scale).forEach(([shade, value]) => {
    root.style.setProperty(`--${prefix}-${shade}`, toCssRgb(value));
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { config } = useLearnMD();
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('learnmd-theme') as Theme) || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => getSystemTheme());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    const darkModeConfig =
      typeof config.theme?.darkMode === 'object' ? config.theme.darkMode : undefined;
    const darkModeEnabled =
      typeof config.theme?.darkMode === 'boolean'
        ? config.theme.darkMode
        : darkModeConfig?.enabled ?? true;

    if (darkModeEnabled && (theme === 'dark' || (theme === 'system' && resolved === 'dark'))) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('learnmd-theme', theme);
  }, [config.theme?.darkMode, theme]);

  useEffect(() => {
    const root = document.documentElement;
    const themeConfig = config.theme;
    if (!themeConfig) return;

    const darkModeConfig =
      typeof themeConfig.darkMode === 'object' ? themeConfig.darkMode : undefined;
    const isDarkThemeEnabled =
      typeof themeConfig.darkMode === 'boolean'
        ? themeConfig.darkMode
        : darkModeConfig?.enabled ?? true;
    const isDark = resolvedTheme === 'dark' && isDarkThemeEnabled;

    const backgroundColor = isDark
      ? darkModeConfig?.backgroundColor || themeConfig.backgroundColor
      : themeConfig.backgroundColor;
    const surfaceColor = isDark
      ? darkModeConfig?.surfaceColor || themeConfig.surfaceColor
      : themeConfig.surfaceColor;
    const textColor = isDark ? darkModeConfig?.textColor || themeConfig.textColor : themeConfig.textColor;
    const mutedTextColor = isDark
      ? darkModeConfig?.mutedTextColor || themeConfig.mutedTextColor
      : themeConfig.mutedTextColor;
    const borderColor = isDark
      ? darkModeConfig?.borderColor || themeConfig.borderColor
      : themeConfig.borderColor;
    const primaryColor = isDark
      ? darkModeConfig?.primaryColor || themeConfig.primaryColor
      : themeConfig.primaryColor;
    const secondaryColor = isDark
      ? darkModeConfig?.secondaryColor || themeConfig.secondaryColor
      : themeConfig.secondaryColor;

    setColorScale(root, 'color-primary', primaryColor, isDark ? 'dark' : 'light');
    setColorScale(root, 'color-secondary', secondaryColor, isDark ? 'dark' : 'light');

    const parsedBackground = parseColor(backgroundColor);
    const parsedSurface = parseColor(surfaceColor);
    const parsedText = parseColor(textColor);
    const parsedMuted = parseColor(mutedTextColor);
    const parsedBorder = parseColor(borderColor);

    if (parsedBackground) {
      root.style.setProperty('--bg-primary', toCssRgb(parsedBackground));
      root.style.setProperty(
        '--bg-secondary',
        toCssRgb(parsedSurface || mixColor(parsedBackground, isDark ? [255, 255, 255] : [0, 0, 0], isDark ? 0.08 : 0.03))
      );
      root.style.setProperty(
        '--bg-tertiary',
        toCssRgb(
          mixColor(
            parsedSurface || parsedBackground,
            isDark ? [255, 255, 255] : [0, 0, 0],
            isDark ? 0.16 : 0.06
          )
        )
      );
    } else {
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--bg-secondary');
      root.style.removeProperty('--bg-tertiary');
    }

    if (parsedText) {
      root.style.setProperty('--text-primary', toCssRgb(parsedText));
    } else {
      root.style.removeProperty('--text-primary');
    }

    if (parsedMuted) {
      root.style.setProperty('--text-secondary', toCssRgb(parsedMuted));
      root.style.setProperty(
        '--text-muted',
        toCssRgb(mixColor(parsedMuted, isDark ? [255, 255, 255] : [0, 0, 0], isDark ? 0.18 : 0.15))
      );
    } else {
      root.style.removeProperty('--text-secondary');
      root.style.removeProperty('--text-muted');
    }

    if (parsedBorder) {
      root.style.setProperty('--border-color', toCssRgb(parsedBorder));
    } else {
      root.style.removeProperty('--border-color');
    }

    if (themeConfig.fontFamily) {
      root.style.setProperty('--font-family', themeConfig.fontFamily);
    }

    if (themeConfig.headingFontFamily) {
      root.style.setProperty('--heading-font-family', themeConfig.headingFontFamily);
    }

    if (themeConfig.contentMaxWidth !== undefined) {
      const contentMaxWidth =
        typeof themeConfig.contentMaxWidth === 'number'
          ? `${themeConfig.contentMaxWidth}px`
          : themeConfig.contentMaxWidth;
      root.style.setProperty('--content-max-width', contentMaxWidth);
    }
  }, [config.theme, resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ThemeName } from './theme';
import { getInitialTheme, toggleThemeName, THEME_STORAGE_KEY } from './theme';

interface ThemeContextValue {
  theme: ThemeName;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => getInitialTheme(window.localStorage));

  const toggle = () => {
    setTheme((current) => {
      const next = toggleThemeName(current);
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  };

  const value = useMemo(() => ({ theme, toggle }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

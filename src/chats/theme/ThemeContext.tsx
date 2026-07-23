import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getInitialTheme, toggleThemeName, THEME_STORAGE_KEY, ThemeReactContext } from './theme';
import type { ThemeName } from './theme';

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

  return <ThemeReactContext.Provider value={value}>{children}</ThemeReactContext.Provider>;
}

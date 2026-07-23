import { createContext, useContext } from 'react';

export type ThemeName = 'wrapped' | 'letter';

export const THEME_STORAGE_KEY = 'chatWrappedTheme';

export interface ThemeContextValue {
  theme: ThemeName;
  toggle: () => void;
}

export const ThemeReactContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeReactContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

export function getInitialTheme(storage: Pick<Storage, 'getItem'>): ThemeName {
  const stored = storage.getItem(THEME_STORAGE_KEY);
  return stored === 'letter' ? 'letter' : 'wrapped';
}

export function toggleThemeName(current: ThemeName): ThemeName {
  return current === 'wrapped' ? 'letter' : 'wrapped';
}

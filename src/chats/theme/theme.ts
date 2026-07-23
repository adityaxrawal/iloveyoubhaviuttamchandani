export type ThemeName = 'wrapped' | 'letter';

export const THEME_STORAGE_KEY = 'chatWrappedTheme';

export function getInitialTheme(storage: Pick<Storage, 'getItem'>): ThemeName {
  const stored = storage.getItem(THEME_STORAGE_KEY);
  return stored === 'letter' ? 'letter' : 'wrapped';
}

export function toggleThemeName(current: ThemeName): ThemeName {
  return current === 'wrapped' ? 'letter' : 'wrapped';
}

import { describe, it, expect } from 'vitest';
import { getInitialTheme, toggleThemeName, THEME_STORAGE_KEY } from './theme';

function fakeStorage(value: string | null): Pick<Storage, 'getItem'> {
  return { getItem: (key: string) => (key === THEME_STORAGE_KEY ? value : null) };
}

describe('getInitialTheme', () => {
  it('defaults to wrapped when nothing is stored', () => {
    expect(getInitialTheme(fakeStorage(null))).toBe('wrapped');
  });

  it('restores letter when that was stored', () => {
    expect(getInitialTheme(fakeStorage('letter'))).toBe('letter');
  });

  it('ignores garbage values and falls back to wrapped', () => {
    expect(getInitialTheme(fakeStorage('nonsense'))).toBe('wrapped');
  });
});

describe('toggleThemeName', () => {
  it('flips between the two themes', () => {
    expect(toggleThemeName('wrapped')).toBe('letter');
    expect(toggleThemeName('letter')).toBe('wrapped');
  });
});

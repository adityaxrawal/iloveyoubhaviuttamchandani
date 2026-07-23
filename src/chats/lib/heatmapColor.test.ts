import { describe, it, expect } from 'vitest';
import { heatmapColorVar } from './heatmapColor';

describe('heatmapColorVar', () => {
  it('maps message counts to the correct 7-stop CSS variable', () => {
    expect(heatmapColorVar(0)).toBe('var(--cw-hm-0)');
    expect(heatmapColorVar(5)).toBe('var(--cw-hm-1)');
    expect(heatmapColorVar(15)).toBe('var(--cw-hm-2)');
    expect(heatmapColorVar(30)).toBe('var(--cw-hm-3)');
    expect(heatmapColorVar(60)).toBe('var(--cw-hm-4)');
    expect(heatmapColorVar(100)).toBe('var(--cw-hm-5)');
    expect(heatmapColorVar(150)).toBe('var(--cw-hm-6)');
  });
});

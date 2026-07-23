const STOPS: { threshold: number; varName: string }[] = [
  { threshold: 0, varName: '--cw-hm-0' },
  { threshold: 1, varName: '--cw-hm-1' },
  { threshold: 6, varName: '--cw-hm-2' },
  { threshold: 16, varName: '--cw-hm-3' },
  { threshold: 31, varName: '--cw-hm-4' },
  { threshold: 61, varName: '--cw-hm-5' },
  { threshold: 101, varName: '--cw-hm-6' },
];

export function heatmapColorVar(count: number): string {
  let match = STOPS[0].varName;
  for (const stop of STOPS) {
    if (count >= stop.threshold) match = stop.varName;
  }
  return `var(${match})`;
}

/**
 * Deterministic wobble — every torn edge gets its own shape from a seed,
 * so nothing looks copy-pasted, but it stays stable across renders.
 */
function rand(seed: number) {
  let t = seed * 9301 + 49297;
  return () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
}

/** Ragged `clip-path: polygon()` for a paper card torn on all four sides. */
export function tornPolygon(seed: number, steps = 9, depth = 1.6): string {
  const r = rand(seed);
  const pts: string[] = [];
  const edge = (n: number) => depth * (0.35 + r() * 1.3) * (n % 2 ? -1 : 1);
  for (let i = 0; i <= steps; i++)
    pts.push(`${(i / steps) * 100}% ${Math.max(0, edge(i))}%`);
  for (let i = 0; i <= steps; i++)
    pts.push(`${100 - Math.max(0, edge(i + 3))}% ${(i / steps) * 100}%`);
  for (let i = steps; i >= 0; i--)
    pts.push(`${(i / steps) * 100}% ${100 - Math.max(0, edge(i + 6))}%`);
  for (let i = steps; i >= 0; i--)
    pts.push(`${Math.max(0, edge(i + 1))}% ${(i / steps) * 100}%`);
  return `polygon(${pts.join(",")})`;
}

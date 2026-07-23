export function nextIndex(current: number, total: number): number {
  return (current + 1) % total;
}

export function prevIndex(current: number, total: number): number {
  return (current - 1 + total) % total;
}

export function directionFromSwipe(deltaX: number, threshold = 60): 'next' | 'prev' | null {
  if (deltaX <= -threshold) return 'next';
  if (deltaX >= threshold) return 'prev';
  return null;
}

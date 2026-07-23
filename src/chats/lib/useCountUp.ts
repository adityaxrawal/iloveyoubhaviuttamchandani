import { useEffect, useState } from 'react';

export function useCountUp(target: number, duration = 1200): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setCount(target);
      return;
    }
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FC } from "react";
import Rose, { Petal } from "./rose-cursor";
import "./global-cursor.css";

interface Bloom {
  id: number;
  x: number;
  y: number;
  petals: { dx: number; dy: number; spin: number; delay: number; size: number }[];
}

const LIFETIME_MS = 2600;
const PETAL_COUNT = 5;

const GlobalCursor: FC = () => {
  const [blooms, setBlooms] = useState<Bloom[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const spawn = useCallback((e: MouseEvent) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = nextId.current++;
    // petals fan out on an arc rather than scattering at random, so the
    // burst reads as one flower coming apart instead of confetti
    const petals = Array.from({ length: PETAL_COUNT }, (_, i) => {
      const spread = (i / (PETAL_COUNT - 1) - 0.5) * 2; // -1 → 1
      return {
        dx: spread * (34 + Math.random() * 26),
        dy: -60 - Math.random() * 55,
        spin: spread * 150 + (Math.random() - 0.5) * 80,
        delay: 0.05 + i * 0.045,
        size: 9 + Math.random() * 6,
      };
    });

    setBlooms((prev) => [
      ...prev.slice(-6),
      { id, x: e.clientX, y: e.clientY, petals },
    ]);

    const t = setTimeout(() => {
      timers.current.delete(t);
      setBlooms((prev) => prev.filter((b) => b.id !== id));
    }, LIFETIME_MS);
    timers.current.add(t);
  }, []);

  useEffect(() => {
    window.addEventListener("click", spawn);
    const pending = timers.current;
    return () => {
      window.removeEventListener("click", spawn);
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, [spawn]);

  return (
    <div className="rose-burst-layer" aria-hidden="true">
      {blooms.map((b) => (
        <div
          key={b.id}
          className="rose-burst"
          style={{ left: b.x, top: b.y }}
        >
          <span className="rose-burst__bloom">
            <Rose size={30} />
          </span>
          {b.petals.map((p, i) => (
            <span
              key={i}
              className="rose-burst__petal"
              style={
                {
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--spin": `${p.spin}deg`,
                  animationDelay: `${p.delay}s`,
                } as CSSProperties
              }
            >
              <Petal size={p.size} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GlobalCursor;

import { useScrollProgress } from "../lib/anim";
import { INK, sketch } from "../lib/rough";
import s from "./RedThread.module.css";

/**
 * The site's signature element: one continuous hand-drawn red line that
 * reappears at every band boundary and draws itself as you scroll.
 *
 * Every path carries pathLength="1", so the dash maths is just
 * `dashoffset: 1 - progress` regardless of the real geometry.
 */

const VIEW_BOX = "0 0 1440 100";

const BOUNDARY_PATHS = [
  // long run with a looped heart sitting on the line — the mockup puts the
  // loop at 57% of the width, not at the midpoint
  "M0,44 C 120,30 250,54 372,44 C 470,36 600,50 790,46 C 802,26 826,14 844,26 C 860,37 850,54 830,62 C 808,71 786,60 790,46 C 794,32 812,20 830,26 C 850,33 858,50 844,60 C 890,64 950,44 1030,40 C 1120,34 1180,52 1290,44 C 1360,37 1400,48 1440,42",
  // shallower, drifts low then rises
  "M0,52 C 140,64 260,40 380,48 C 500,56 560,70 640,62 C 656,44 682,34 698,46 C 712,57 700,74 680,80 C 660,86 640,74 646,60 C 652,46 672,38 690,46 C 708,54 712,70 698,80 C 760,86 850,58 960,52 C 1080,45 1200,60 1320,52 C 1380,48 1414,50 1440,48",
];

export default function RedThread({
  variant = 0,
  className = "",
}: {
  variant?: 0 | 1;
  className?: string;
}) {
  const ref = useScrollProgress<SVGSVGElement>();
  /* Sketched, so the thread has the drift of a real line laid on paper. Wobble
     stays low — this is thread, not scribble, and it runs 1440 units wide. */
  const marks = sketch(`thread-${variant}`, VIEW_BOX, [
    { d: BOUNDARY_PATHS[variant], strokeWidth: 3, wobble: 0.5 },
  ], INK);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      className={`${s.thread} ${className}`}
      viewBox={VIEW_BOX}
      preserveAspectRatio="none"
    >
      {marks.map((m, i) => (
        <path
          key={i}
          d={m.d}
          pathLength="1"
          className={s.line}
          fill="none"
          stroke="var(--ink-red)"
          strokeWidth={m.strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

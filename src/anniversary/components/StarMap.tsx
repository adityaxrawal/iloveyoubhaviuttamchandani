import { useMemo } from "react";
import { FINE, sketch } from "../lib/rough";
import Marks from "./Marks";
import s from "./StarMap.module.css";

const VIEW_BOX = "0 0 400 400";

const CX = 200;
const CY = 200;
const R = 168;

/** Seeded so the sky is the same sky on every render. */
function scatter(count: number, seed: number) {
  let t = seed;
  const next = () => ((t = (t * 1103515245 + 12345) % 2147483648) / 2147483648);
  return Array.from({ length: count }, (_, i) => {
    const a = next() * Math.PI * 2;
    const d = Math.sqrt(next()) * (R - 5);
    const m = next();
    return {
      key: i,
      cx: CX + Math.cos(a) * d,
      cy: CY + Math.sin(a) * d,
      r: 0.35 + m * m * 1.7,
      o: 0.22 + next() * 0.68,
      delay: next() * 6,
    };
  });
}

/* Hand-placed constellation — the shape that carries the eye across the disc. */
const NODES: [number, number, number][] = [
  [118, 118, 4.2], [172, 96, 2.6], [214, 126, 3.2], [258, 108, 2.4],
  [286, 148, 3.6], [246, 176, 2.2], [196, 168, 2.8], [150, 158, 2.4],
  [128, 206, 3.0], [166, 244, 2.4], [214, 262, 4.0], [268, 240, 2.6],
  [300, 200, 2.2], [186, 306, 2.6], [128, 268, 2.2],
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
  [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 4], [10, 6],
  [9, 14], [14, 8], [10, 13],
];

const SPARKS: [number, number, number][] = [
  [118, 118, 13], [214, 262, 12], [286, 148, 10], [150, 300, 9], [300, 210, 8],
];

export default function StarMap({ className = "" }: { className?: string }) {
  const stars = useMemo(() => scatter(230, 20240516), []);

  /* Constellation lines and the chart's rings are drawn by hand in the mockup —
     the star field is not, so those 230 particles stay plain circles. */
  const lines = sketch(
    "starmap-links",
    VIEW_BOX,
    [
      {
        d: LINKS.map(([a, b]) => `M${NODES[a][0]} ${NODES[a][1]}L${NODES[b][0]} ${NODES[b][1]}`).join(""),
        strokeWidth: 0.9,
        opacity: 0.75,
      },
    ],
    { ...FINE, stroke: "var(--gold)", wobble: 0.45 },
  );

  const rings = sketch(
    "starmap-rings",
    VIEW_BOX,
    [
      { circle: [CX, CY, (R - 12) * 2], strokeWidth: 0.9, dash: [1, 6], opacity: 0.7 },
      { circle: [CX, CY, R * 2], strokeWidth: 1.6, opacity: 0.9 },
      { circle: [CX, CY, (R + 11) * 2], strokeWidth: 1, dash: [26, 9], opacity: 0.55 },
      { circle: [CX, CY, (R + 16) * 2], strokeWidth: 0.6, opacity: 0.3 },
    ],
    { ...FINE, stroke: "var(--gold)", wobble: 0.3 },
  );

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={VIEW_BOX}
      className={`${s.map} ${className}`}
      strokeLinecap="round"
    >
      <defs>
        <radialGradient id="am-sky" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#3a1420" />
          <stop offset="58%" stopColor="#2a0c15" />
          <stop offset="100%" stopColor="#1a060d" />
        </radialGradient>
        <clipPath id="am-disc">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      {/* the disc of sky */}
      <circle cx={CX} cy={CY} r={R} fill="url(#am-sky)" />

      <g clipPath="url(#am-disc)">
        {stars.map((st) => (
          <circle
            key={st.key}
            cx={st.cx}
            cy={st.cy}
            r={st.r}
            fill="#F7EFE1"
            opacity={st.o}
            className={s.twinkle}
            style={{ animationDelay: `${st.delay}s` }}
          />
        ))}

        {/* constellation */}
        <Marks marks={lines} />
        {NODES.map(([x, y, r], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="var(--gold-light)"
            className={s.twinkle}
            style={{ animationDelay: `${(i % 5) * 0.8}s` }}
          />
        ))}

        {/* 4-point sparkle stars sitting on the brightest nodes */}
        {SPARKS.map(([x, y, k], i) => (
          <path
            key={i}
            transform={`translate(${x} ${y}) scale(${k / 12})`}
            d="M0-12C1.4-4.4 4.4-1.4 12 0 4.4 1.4 1.4 4.4 0 12-1.4 4.4-4.4 1.4-12 0-4.4-1.4-1.4-4.4 0-12z"
            fill="var(--gold-light)"
            opacity=".92"
            className={s.twinkle}
            style={{ animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </g>

      {/* dotted inner ring, double gold border, faint outer */}
      <Marks marks={rings} />

      {/* cardinals — star-chart convention: east on the left */}
      <g
        fill="var(--gold-light)"
        fontFamily="var(--font-serif)"
        fontSize="17"
        letterSpacing="1.5"
        textAnchor="middle"
      >
        <text x={CX} y={CY - R - 24}>N</text>
        <text x={CX} y={CY + R + 38}>S</text>
        <text x={CX - R - 28} y={CY + 6}>E</text>
        <text x={CX + R + 28} y={CY + 6}>W</text>
      </g>
    </svg>
  );
}

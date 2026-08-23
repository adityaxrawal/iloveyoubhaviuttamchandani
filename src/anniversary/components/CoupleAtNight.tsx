import { FINE, heartPath, sketch, type Part } from "../lib/rough";
import Marks from "./Marks";
import s from "./CoupleAtNight.module.css";

const VIEW_BOX = "0 0 440 340";

/** Silhouette ink: solid, with just enough edge drift to read as brushed. */
const INK_BLACK = "#1E060D";
const silhouette = (d: string): Part => ({
  d,
  fill: INK_BLACK,
  fillStyle: "solid",
  stroke: INK_BLACK,
  strokeWidth: 1,
  wobble: 0.35,
});

/** Gold constellation hanging above the two of them. */
/* The mockup arcs the constellation over the couple's heads, not over the
   lantern — so it starts a third of the way into the box, not at the edge. */
const STARS: [number, number, number][] = [
  [156, 44, 3.2], [204, 24, 2.3], [250, 48, 2.9], [298, 28, 2.2],
  [344, 54, 3.4], [392, 30, 2.3], [438, 52, 2.7], [482, 30, 3],
  [228, 78, 2], [368, 86, 2.1],
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [2, 8], [4, 9],
];

/**
 * The two of them sitting from behind, her head on his shoulder, a lantern
 * glowing beside them. Solid silhouettes — at this size any interior detail
 * turns to mud, so the read comes from the outline alone.
 */
export default function CoupleAtNight({ className = "" }: { className?: string }) {
  const figures = sketch(
    "couple",
    VIEW_BOX,
    [
      /* ground */
      {
        d: "M0 322c84-13 164-19 244-17 78 2 142 7 196 17z",
        fill: "#230610",
        fillStyle: "solid",
        stroke: "none",
        opacity: 0.9,
      },
      { d: "M32 318c3-10 1-17-4-23M42 318c0-11 4-18 10-23M406 316c-3-10-1-17 4-22M395 317c0-10-4-16-9-21", stroke: "#4A0A14", strokeWidth: 1.7, wobble: 1.2, opacity: 0.75 },

      /* ---------- her: seated, leaning into him ---------- */
      /* hair falling down her back, drawn first so the body sits on top */
      silhouette("M175 154c-14 22-22 52-25 86-2 26-1 50 2 72h-38c-3-34-1-68 8-98 8-27 22-49 41-62z"),
      /* seated body: wide at the base, narrowing to the shoulder */
      silhouette("M140 312c-3-36 3-70 16-92 8-14 20-24 34-27l30 12c-12 24-16 66-13 107z"),
      /* head, tipped over onto his shoulder */
      silhouette("M225 143c9 12 6 30-7 39s-31 7-40-5-6-30 7-39 31-7 40 5z"),
      /* the crown of her hair, a touch fuller than the head */
      silhouette("M180 141c-4-19 8-36 27-39 18-3 34 9 37 26-8-12-21-18-35-16-14 2-25 13-29 29z"),

      /* ---------- him: upright, shoulder under her head ---------- */
      silhouette("M214 312c-4-42 3-78 20-99 11-14 25-21 41-21s30 7 41 21c17 21 24 57 20 99z"),
      { ellipse: [275, 146, 62, 68], fill: INK_BLACK, fillStyle: "solid", stroke: INK_BLACK, strokeWidth: 1, wobble: 0.35 },
      silhouette("M244 141c-2-20 12-36 31-36s33 16 31 36c-5-13-16-21-31-21s-26 8-31 21z"),

      /* warm rim light along the lantern side of both figures */
      { d: "M143 306c-2-34 4-66 17-87 7-11 16-19 26-23M180 140c-3-16 6-30 22-34", stroke: "#C99A4E", strokeWidth: 2, wobble: 0.9, opacity: 0.42 },
      { d: "M218 306c-3-40 4-73 20-92", stroke: "#C99A4E", strokeWidth: 1.5, wobble: 0.9, opacity: 0.22 },
    ],
    { ...FINE, wobble: 0.6 },
  );

  const lantern = sketch(
    "couple-lantern",
    "0 0 64 96",
    [
      { d: "M32 0v10M20 10h24", strokeWidth: 2.4 },
      { d: "M15 15h34l5 10H10z", strokeWidth: 2.4 },
      { rect: [19, 36, 26, 38], fill: "#E6C177", fillStyle: "solid", stroke: "none", opacity: 0.85 },
      { d: "M14 25h36v58H14z", strokeWidth: 2.4 },
      { d: "M9 83h46l5 10H4z", strokeWidth: 2.4 },
      { d: "M14 36h36M14 74h36", strokeWidth: 1.1, opacity: 0.55 },
      {
        d: heartPath(32, 57, 15, 20),
        fill: "#C2182A",
        fillStyle: "solid",
        stroke: "#8E0F1A",
        strokeWidth: 0.8,
        wobble: 1.2,
      },
    ],
    { ...FINE, stroke: "var(--gold-light)", wobble: 1.1 },
  );

  const drifting = sketch(
    "couple-hearts",
    VIEW_BOX,
    [
      { d: heartPath(232, 112, 13), fill: "#C2182A", fillStyle: "solid", stroke: "#C2182A", strokeWidth: 0.6, opacity: 0.9 },
      { d: heartPath(206, 81, 9), fill: "#C2182A", fillStyle: "solid", stroke: "#C2182A", strokeWidth: 0.5, opacity: 0.65 },
    ],
    { ...FINE, wobble: 1.2 },
  );

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={VIEW_BOX}
      className={`${s.scene} ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <radialGradient id="am-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E6C177" stopOpacity=".45" />
          <stop offset="55%" stopColor="#C99A4E" stopOpacity=".14" />
          <stop offset="100%" stopColor="#C99A4E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* constellation */}
      <g stroke="var(--gold)" strokeWidth="0.9" strokeLinecap="round" opacity=".7" fill="none">
        {LINKS.map(([x, y], i) => (
          <line
            key={i}
            x1={STARS[x][0]}
            y1={STARS[x][1]}
            x2={STARS[y][0]}
            y2={STARS[y][1]}
          />
        ))}
      </g>
      {STARS.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="var(--gold-light)" opacity=".92" />
      ))}

      {/* lantern glow, behind everything */}
      <circle cx="88" cy="258" r="86" fill="url(#am-glow)" className={s.glow} />

      <Marks marks={figures} />

      {/* ---------- lantern ---------- */}
      <g transform="translate(56 214)" className={s.lantern}>
        <Marks marks={lantern} />
      </g>

      {/* a couple of hearts drifting up between them */}
      <Marks marks={drifting} />
    </svg>
  );
}

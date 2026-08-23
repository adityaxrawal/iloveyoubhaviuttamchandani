import type { CSSProperties, ReactNode } from "react";
import { FINE, sketch, type Pen } from "../lib/rough";
import Marks from "./Marks";
import { tornPolygon } from "../lib/torn";
import s from "./paper.module.css";

/**
 * The stationery is photographed gold in the mockups, not drawn — so it goes
 * through roughjs at the lightest setting that still breaks the vector edge.
 * Any more wobble and it stops reading as metal.
 */
const METAL: Pen = { ...FINE, wobble: 0.35, bowing: 0.2 };

/* ------------------------------------------------------------------ *
 * Torn edge between two colour bands.
 * Two stacked paths: the back one sits a few px higher and lighter, so
 * the boundary reads as paper fibre rather than a single clean cut.
 * ------------------------------------------------------------------ */
type TornEdgeProps = {
  /** Colour of the band the torn paper belongs to (the one on top of `from`). */
  fill: string;
  /** Lighter fibre colour showing just above the tear. */
  fibre?: string;
  /** `down` = paper hangs from the top, `up` = paper rises from the bottom. */
  direction?: "up" | "down";
  /** Pick a different ragged profile per section. */
  variant?: 0 | 1 | 2 | 3;
  height?: string;
  className?: string;
  style?: CSSProperties;
};

const TEAR_PATHS = [
  "M0,34 C 60,22 96,44 158,30 C 214,18 250,42 316,32 C 372,24 404,46 470,36 C 540,26 578,48 640,38 C 706,28 742,50 804,40 C 866,30 902,52 964,42 C 1024,33 1062,52 1120,44 C 1180,36 1218,54 1280,46 C 1338,39 1372,56 1440,50 L1440,120 L0,120 Z",
  "M0,46 C 74,58 110,30 176,40 C 240,50 274,24 340,34 C 402,44 442,20 508,32 C 574,44 606,18 672,30 C 736,42 774,16 838,28 C 900,40 938,20 1002,32 C 1064,44 1100,22 1164,34 C 1228,46 1268,24 1330,36 C 1382,46 1410,32 1440,38 L1440,120 L0,120 Z",
  "M0,28 C 52,44 88,20 150,34 C 210,47 244,26 306,40 C 368,54 400,30 462,42 C 526,55 560,32 622,44 C 686,57 720,34 782,46 C 844,58 878,36 940,46 C 1002,56 1038,34 1100,44 C 1164,54 1200,32 1262,42 C 1324,52 1382,38 1440,44 L1440,120 L0,120 Z",
  "M0,52 C 66,36 104,58 168,46 C 232,34 266,56 330,44 C 396,32 430,54 494,44 C 558,34 594,56 658,46 C 722,36 758,58 820,48 C 882,38 918,60 982,50 C 1044,40 1080,60 1142,50 C 1206,40 1244,58 1306,48 C 1360,40 1400,50 1440,44 L1440,120 L0,120 Z",
];

export function TornEdge({
  fill,
  fibre,
  direction = "down",
  variant = 0,
  height = "clamp(34px, 4.5vw, 68px)",
  className = "",
  style,
}: TornEdgeProps) {
  return (
    <svg
      aria-hidden="true"
      className={`${s.tornEdge} ${direction === "up" ? s.tornUp : ""} ${className}`}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      style={{ height, ...style }}
    >
      {fibre && (
        <path d={TEAR_PATHS[variant]} fill={fibre} transform="translate(0,-5)" />
      )}
      <path d={TEAR_PATHS[variant]} fill={fill} />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Tape, clips, pins
 * ------------------------------------------------------------------ */
type TapeProps = {
  children?: ReactNode;
  tone?: "kraft" | "cream" | "rose";
  rotate?: number;
  width?: string;
  className?: string;
  style?: CSSProperties;
};

export function TapeStrip({
  children,
  tone = "kraft",
  rotate = -4,
  width = "78px",
  className = "",
  style,
}: TapeProps) {
  return (
    <span
      aria-hidden={children ? undefined : "true"}
      className={`${s.tape} ${s[tone]} ${className}`}
      style={{ ["--rot" as string]: `${rotate}deg`, width, ...style }}
    >
      {children}
    </span>
  );
}

export function PaperClip({
  rotate = 0,
  size = 44,
  className = "",
  style,
}: {
  rotate?: number;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const marks = sketch(
    "paperclip",
    "0 0 32 72",
    [
      {
        d: "M22 20v30c0 6-4.6 10-10 10S2 56 2 50V16C2 8.8 7.6 3 15 3s13 5.8 13 13v34c0 3.6-2.6 6-6 6s-6-2.4-6-6V20",
        stroke: "var(--gold)",
        strokeWidth: 3.2,
      },
      {
        d: "M22 22v28c0 5-3.8 8.4-8.4 8.4",
        stroke: "var(--gold-light)",
        strokeWidth: 1.1,
        opacity: 0.8,
      },
    ],
    METAL,
  );

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 72"
      width={size * 0.44}
      height={size}
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
      fill="none"
      strokeLinecap="round"
    >
      <Marks marks={marks} />
    </svg>
  );
}

export function BinderClip({
  size = 46,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const marks = sketch(
    "binderclip",
    "0 0 60 48",
    [
      /* the two sprung arms */
      { d: "M20 17 15 4.5h6.5L26 15M40 17l5-12.5h-6.5L34 15", stroke: "var(--gold-light)", strokeWidth: 2.4 },
      /* body: wedge, wider at the mouth */
      { d: "M8 15h44l-5.5 30H13.5z", fill: "var(--gold)", fillStyle: "solid", stroke: "#7d5c28", strokeWidth: 1.1 },
      { d: "M8 15h44l-1.2 6.5H9.2z", fill: "var(--gold-light)", fillStyle: "solid", stroke: "none", opacity: 0.9 },
      { d: "M15 45h30", stroke: "#5f4620", strokeWidth: 1.6, opacity: 0.55 },
    ],
    METAL,
  );

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 48"
      width={size}
      height={(size * 48) / 60}
      className={className}
      style={style}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Marks marks={marks} />
    </svg>
  );
}

/** Small gold brad / thumb-tack. */
export function Brad({
  size = 16,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const marks = sketch(
    "brad",
    "0 0 20 20",
    [
      { circle: [10, 10, 16], fill: "var(--gold)", fillStyle: "solid", stroke: "#8a672f", strokeWidth: 1, opacity: 0.98 },
      { circle: [7.6, 7.4, 6], fill: "var(--gold-light)", fillStyle: "solid", stroke: "none", opacity: 0.9 },
    ],
    METAL,
  );

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      <Marks marks={marks} />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Torn note card
 * ------------------------------------------------------------------ */
type TornNoteProps = {
  children: ReactNode;
  /** Paper stock. */
  variant?: "plain" | "lined" | "grid" | "tinted";
  seed?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
};

export function TornNote({
  children,
  variant = "plain",
  seed = 1,
  rotate = 0,
  className = "",
  style,
}: TornNoteProps) {
  return (
    <div
      className={`${s.note} ${s[variant]} ${className}`}
      style={{
        clipPath: tornPolygon(seed),
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Polaroid
 * ------------------------------------------------------------------ */
type PolaroidProps = {
  src: string;
  alt: string;
  caption?: ReactNode;
  rotate?: number;
  priority?: boolean;
  width: number;
  height: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Polaroid({
  src,
  alt,
  caption,
  rotate = -4,
  priority = false,
  width,
  height,
  children,
  className = "",
  style,
}: PolaroidProps) {
  return (
    <figure
      className={`${s.polaroid} ${className}`}
      style={{ ["--rot" as string]: `${rotate}deg`, ...style }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
      {caption && <figcaption>{caption}</figcaption>}
      {children}
    </figure>
  );
}

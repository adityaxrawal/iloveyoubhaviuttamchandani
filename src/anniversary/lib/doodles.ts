import {
  FINE,
  GOLD,
  SKETCH,
  heartPath,
  type Part,
  type Pen,
} from "./rough";

/**
 * Every decorative mark on the page, declared as clean geometry plus the pen
 * it should be drawn with. `sketch()` turns each one into wobbly hand-drawn
 * paths at first use; `components/Doodle.tsx` renders them.
 *
 * The reference is the mockups in `../images/section*.png` — ballpoint on
 * paper, not an icon set.
 */

type Spec = {
  box: string;
  /** Pen for every part; INK (red ballpoint) unless the mark says otherwise. */
  pen?: Pen;
  parts: Part[];
};

/** Pale interior the section-3 milestone icons are filled with. */
const PAPER_FILL: Pen = { fill: "var(--paper)", fillStyle: "solid" };
/** The small solid red hearts that ride on those icons. */
const RED = "var(--red-bright)";
/** Where the sprig's branches end and a cluster of blooms sits. */
const BLOOM_TIPS = [
  [41, 18], [87, 122], [33, 104], [83, 75], [25, 63],
  [73, 29], [18, 29], [59, 6], [55, 46], [66, 92],
].map(([x, y]) => `translate(${x} ${y})`);

/**
 * Side-view aeroplane, nose up and to the right, drawn in an 84×48 box.
 * Both travel doodles use the same aircraft — an arrow-shaped paper plane
 * doesn't read as one at the size these sit at.
 */
const PLANE =
  "M73 7c3.4-1.2 6.6.8 6 4-.4 2.2-2.2 3.8-5 4.8l-17 6.4-6.6 21.6-4.6 1.6 1.4-20-13 4.8-2 8-3.6 1.2-.8-8.8-6.8-5.6 2.8-2.6 8 3.2 13-4.8L30 7.6 34.6 6z";

const redHeart = (cx: number, cy: number, w: number, opacity = 1): Part => ({
  d: heartPath(cx, cy, w),
  fill: RED,
  fillStyle: "solid",
  stroke: RED,
  strokeWidth: 0.7,
  wobble: 1.4,
  opacity,
});

export const DOODLES: Record<string, Spec> = {
  /* ---------------- hearts ---------------- */
  /** Timeline nodes and rule dots. Reads as a clean solid at 9–22px. */
  "heart-solid": {
    box: "0 0 24 22",
    pen: FINE,
    parts: [
      {
        d: heartPath(12, 11.4, 20),
        fill: "currentColor",
        fillStyle: "solid",
        stroke: "currentColor",
        strokeWidth: 0.9,
        wobble: 1.3,
      },
    ],
  },
  /** The workhorse: a red outline heart, two passes, used at 13–30px. */
  "heart-line": {
    box: "0 0 24 22",
    parts: [{ d: heartPath(12, 11.2, 19.5), strokeWidth: 1.7, wobble: 3 }],
  },
  /**
   * A ribbon that runs in from both sides and loops into a heart in the
   * middle — the line that crosses the tear in section 1.
   */
  "heart-loop": {
    box: "0 0 1536 1024",
    parts: [
      { d: heartPath(768, 512, 380, 360), strokeWidth: 3, wobble: 2 },
      {
        d: "M100 512 C400 512, 600 512, 768 512 C936 512, 1136 512, 1436 512",
        strokeWidth: 3,
        wobble: 2,
      },
    ],
  },
  /** The big hatched heart: outline traced twice, 45° shading, x'd tail. */
  "heart-hatch": {
    box: "0 0 46 46",
    parts: [
      /* shading first, nudged right and inset so the left lobe stays bare */
      {
        d: heartPath(25, 23.6, 29, 30),
        fill: "currentColor",
        fillStyle: "hachure",
        hachureAngle: 45,
        hachureGap: 2.6,
        fillWeight: 0.5,
        stroke: "none",
        wobble: 1.6,
        opacity: 0.5,
      },
      /* the heart itself */
      { d: heartPath(23, 22.6, 34, 36), strokeWidth: 1.5, wobble: 1.9 },
      /* the second pass, swinging wide down the left and overshooting the tip */
      {
        d: "M31.5 3.4c-5-.2-9.1 3.2-10.1 7.6C19.8 6.2 16.4 3 12.4 3.6 6.2 4.6 2.2 11 2.6 18.6 3 26.6 10 33.6 20.6 42.6",
        strokeWidth: 1.5,
        wobble: 2.4,
        seed: 7,
      },
      /* the tails crossing into a little x below the tip */
      { d: "M20.4 40.2 14 45.8M13.8 39.4 21.4 45.2", strokeWidth: 1.5, seed: 5 },
    ],
  },
  /** A paperclip bent into a heart — the gold one in the wine band. */
  "wire-heart": {
    box: "0 0 46 44",
    pen: FINE,
    parts: [
      {
        d: "M23 40.5C12 31.6 5.2 26 4.8 17.4 4.6 10.8 8.4 5.6 13.8 5.4c3.9-.1 7.1 2.5 9 6 1.7-3.6 4.8-6.2 8.7-6.1 5.4.1 9.2 5.2 9.1 11.8-.2 8.6-7 14.4-17.6 23.4-2.6-2.2-4.6-4.2-6-6.2-2.4-3.4-1.4-7.4 1.8-8.4 2.8-.9 5 1.3 4.6 4.2-.4 3-3.4 5-7.4 5.2",
        strokeWidth: 2.4,
      },
    ],
  },

  /* ---------------- stars & sparkles ---------------- */
  sparkle: {
    box: "0 0 24 24",
    pen: GOLD,
    parts: [
      {
        d: "M12 0.8c.9 6.4 3.9 9.6 10.4 11.2-6.5 1.6-9.5 4.8-10.4 11.2-.9-6.4-3.9-9.6-10.4-11.2C8.1 10.4 11.1 7.2 12 .8z",
        strokeWidth: 0.7,
      },
    ],
  },
  "star-5": {
    box: "0 0 24 23",
    pen: GOLD,
    parts: [
      { d: "M12 1.2 15.1 8l7.4.8-5.5 5 1.6 7.3L12 17.4 5.4 21.1 7 13.8 1.5 8.8 8.9 8z", strokeWidth: 0.7 },
    ],
  },
  "star-outline": {
    box: "0 0 24 23",
    pen: GOLD,
    parts: [
      {
        d: "M12 1.6 15 8.2l7.1.7-5.3 4.9 1.5 7L12 17.2 5.7 20.8l1.5-7-5.3-4.9L9 8.2z",
        fill: undefined,
        strokeWidth: 1.4,
        wobble: 3,
      },
    ],
  },
  "shooting-star": {
    box: "0 0 78 44",
    pen: GOLD,
    parts: [
      { d: "M2 36c14-8 27-14 44-19", fill: undefined, strokeWidth: 1.6, opacity: 0.95 },
      { d: "M9 42c12-7 24-12 39-16.5", fill: undefined, strokeWidth: 1.3, opacity: 0.7 },
      { d: "M20 43c9-5 18-9 29-12", fill: undefined, strokeWidth: 1, opacity: 0.45 },
      {
        d: "M62 4.5c1.2 5.3 3.4 7.6 8.6 8.9-5.2 1.3-7.4 3.6-8.6 8.9-1.2-5.3-3.4-7.6-8.6-8.9 5.2-1.3 7.4-3.6 8.6-8.9z",
        strokeWidth: 0.6,
      },
    ],
  },

  /* ---------------- flourishes ---------------- */
  squiggle: {
    box: "0 0 200 22",
    parts: [
      {
        d: "M3 13c11-11 21 6 33-1s21-13 33-5 20 13 32 4 21-12 33-4 20 10 33 4",
        strokeWidth: 2.6,
        wobble: 1.8,
      },
    ],
  },
  /** The brush rule under the section titles: one heavy pass, one light. */
  underline: {
    box: "0 0 200 14",
    parts: [
      { d: "M6 6c30-3.6 62-4.4 96-3 30 1.2 62 3.4 94 6.4", strokeWidth: 3.4, wobble: 2.6 },
      { d: "M22 11c30-2.6 60-3.4 92-2.4", strokeWidth: 1.5, wobble: 3.4, opacity: 0.5, seed: 4 },
    ],
  },
  /** Gold calligraphic swash that loops into a heart, then tails off. */
  "flourish-heart": {
    box: "0 0 96 54",
    pen: FINE,
    parts: [
      /* the heart, then a long tail curling away under it */
      { d: heartPath(34, 20, 34, 32), strokeWidth: 2, wobble: 1.8 },
      {
        d: "M34 37c2 6 8 10 18 11 12 1.4 22-2 30-10 4-4 3.6-9.6-1-11-4-1.2-6.6 2.6-4.4 6.4 2.6 4.4 9.6 7.4 18 8",
        strokeWidth: 1.9,
        wobble: 1.4,
      },
    ],
  },
  "arrow-flourish": {
    box: "0 0 64 22",
    parts: [
      { d: "M2 12c11-7 22 6 33-1", strokeWidth: 1.9, wobble: 2.6 },
      { d: "M35 11h24", strokeWidth: 1.9, wobble: 2.6 },
      { d: "M48 3 61 11 48 19", strokeWidth: 1.9, wobble: 2.2 },
    ],
  },

  /* ---------------- gypsophila / baby's breath sprig ---------------- */
  gypsophila: {
    box: "0 0 120 190",
    pen: SKETCH,
    parts: [
      {
        d:
          "M62 189c1-30 2-52 0-74-2-26-9-49-21-71" +
          "M61 141c5-9 14-15 26-19M59 120c-7-8-16-13-26-16" +
          "M57 99c6-11 15-19 26-24M54 78c-8-8-18-13-29-15" +
          "M50 58c5-12 13-22 23-29M45 40c-8-6-17-10-27-11",
        strokeWidth: 1,
        wobble: 0.7,
        opacity: 0.8,
      },
      /* one sketched cluster of blooms, stamped at every branch tip */
      ...([
        [0, 0, 4.6],
        [-4.6, -2.2, 3.4],
        [4, -3.2, 3.2],
        [-2.8, 3.6, 3],
        [4.4, 3, 3.6],
        [0.8, -5.4, 2.8],
      ] as [number, number, number][]
      ).map(
        ([dx, dy, d], i): Part => ({
          circle: [dx, dy, d],
          fill: "currentColor",
          fillStyle: "solid",
          stroke: "currentColor",
          strokeWidth: 0.5,
          wobble: 0.9,
          opacity: i === 0 ? 0.95 : 0.62 + (i % 3) * 0.12,
          at: BLOOM_TIPS,
        }),
      ),
    ],
  },

  /* ---------------- tiny meta icons for the date card ---------------- */
  calendar: {
    box: "0 0 22 22",
    pen: FINE,
    parts: [
      { rect: [2.2, 4.2, 17.6, 15.6], strokeWidth: 1.6 },
      { d: "M2.6 9h16.8M7 2.2v4M15 2.2v4", strokeWidth: 1.6 },
      { circle: [11, 14, 3], fill: "currentColor", fillStyle: "solid", strokeWidth: 0.6 },
    ],
  },
  clock: {
    box: "0 0 22 22",
    pen: FINE,
    parts: [
      { circle: [11, 11, 17.2], strokeWidth: 1.6 },
      { d: "M11 5.8V11l3.8 2.6", strokeWidth: 1.6 },
    ],
  },
  pin: {
    box: "0 0 22 22",
    pen: FINE,
    parts: [
      {
        d: "M11 20.4c4.4-5.5 6.6-9.2 6.6-11.9A6.6 6.6 0 0 0 4.4 8.5c0 2.7 2.2 6.4 6.6 11.9z",
        strokeWidth: 1.6,
      },
      { circle: [11, 8.6, 4.8], strokeWidth: 1.4 },
    ],
  },

  /* ---------------- section 2 ---------------- */
  cherry: {
    box: "0 0 64 66",
    pen: SKETCH,
    parts: [
      { d: "M33 10C25 20 18 27 15 38M33 10c6 12 11 17 13 24", stroke: "#7A3B1E", strokeWidth: 2.2, wobble: 2 },
      {
        d: "M33 11c6-6 15-6 21-2-5 6-15 8-21 2z",
        fill: "#4C7A44",
        fillStyle: "solid",
        stroke: "#2F5A32",
        strokeWidth: 1.4,
        wobble: 2,
      },
      { circle: [14, 48, 23], fill: "#C2182A", fillStyle: "solid", stroke: "#8E0F1A", strokeWidth: 0.9, wobble: 1.4 },
      { circle: [47, 45, 20], fill: "#A6141E", fillStyle: "solid", stroke: "#7A0D15", strokeWidth: 0.9, wobble: 1.4 },
      { circle: [10.5, 44, 6], fill: "#F0868F", fillStyle: "solid", stroke: "none", opacity: 0.75 },
      { circle: [44, 41.5, 5], fill: "#F0868F", fillStyle: "solid", stroke: "none", opacity: 0.7 },
    ],
  },
  /** The glossy pinned heart at the top of each reason card. */
  "heart-sticker": {
    box: "0 0 34 32",
    pen: FINE,
    parts: [
      {
        d: heartPath(17, 16.5, 28, 27),
        fill: "#C2182A",
        fillStyle: "solid",
        stroke: "#8E0F1A",
        strokeWidth: 0.8,
        wobble: 1.2,
      },
      { d: "M10 10.5c.6-2.2 2.2-3.4 4-3.6", stroke: "#F3A6AC", strokeWidth: 1.8, opacity: 0.8 },
    ],
  },

  /* ---------------- section 3 milestones ----------------
     Brown outline over a pale fill, each carrying a small solid red heart. */
  "coffee-cups": {
    box: "0 0 96 78",
    pen: SKETCH,
    parts: [
      /* hearts drifting off the lids */
      redHeart(41, 8, 9),
      redHeart(53, 5, 6.5, 0.85),
      redHeart(32, 4, 5, 0.7),
      /* left cup: lid sits proud of a body that tapers to the base */
      { d: "M15 34h32l-6 40a4 4 0 0 1-4 3.4H25a4 4 0 0 1-4-3.4z", ...PAPER_FILL, strokeWidth: 1.9 },
      { d: "M12 26h38v8H12z", ...PAPER_FILL, strokeWidth: 1.9 },
      { d: "M18 48h26l-2 13H20z", strokeWidth: 1.3, opacity: 0.7 },
      redHeart(31, 54, 8.5),
      /* right cup, a touch shorter and set lower */
      { d: "M53 41h30l-5.6 34a4 4 0 0 1-4 3.2H60.6a4 4 0 0 1-4-3.2z", ...PAPER_FILL, strokeWidth: 1.9 },
      { d: "M50 33h36v8H50z", ...PAPER_FILL, strokeWidth: 1.9 },
      { d: "M55.6 54h24l-1.6 12H57z", strokeWidth: 1.3, opacity: 0.7 },
      redHeart(67.5, 59.5, 8),
    ],
  },
  rings: {
    box: "0 0 100 62",
    pen: SKETCH,
    parts: [
      redHeart(50, 8, 11),
      { ellipse: [36, 38, 44, 42], strokeWidth: 2.2 },
      { ellipse: [36, 38, 34, 32], strokeWidth: 1, opacity: 0.5 },
      { ellipse: [64, 38, 44, 42], strokeWidth: 2.2 },
      { ellipse: [64, 38, 34, 32], strokeWidth: 1, opacity: 0.5 },
    ],
  },
  champagne: {
    box: "0 0 96 88",
    pen: SKETCH,
    parts: [
      redHeart(48, 8, 9),
      redHeart(35, 12, 6, 0.8),
      redHeart(61, 12, 6, 0.8),
      /* clink sparks */
      { d: "M48 18v6M37 20l3 5M59 20l-3 5", strokeWidth: 1.5, opacity: 0.8 },
      /* left flute, tipped in towards the clink */
      { d: "M23 30h23l-3 19c-.6 4.8-3.8 7.6-8.5 7.6S26.6 53.8 26 49z", ...PAPER_FILL, strokeWidth: 1.8, at: ["rotate(-15 34 56)"] },
      { d: "M34.5 56.6V78M26 80h17", strokeWidth: 1.8, at: ["rotate(-15 34 56)"] },
      { d: "M25.6 37h18", strokeWidth: 1.1, opacity: 0.55, at: ["rotate(-15 34 56)"] },
      /* right flute, tipped the other way */
      { d: "M50 30h23l-3 19c-.6 4.8-3.8 7.6-8.5 7.6S53.6 53.8 53 49z", ...PAPER_FILL, strokeWidth: 1.8, at: ["rotate(15 62 56)"] },
      { d: "M61.5 56.6V78M53 80h17", strokeWidth: 1.8, at: ["rotate(15 62 56)"] },
      { d: "M52.6 37h18", strokeWidth: 1.1, opacity: 0.55, at: ["rotate(15 62 56)"] },
    ],
  },
  "plane-tickets": {
    box: "0 0 110 84",
    pen: SKETCH,
    parts: [
      redHeart(14, 34, 8),
      /* dashed vapour trail looping back on itself */
      {
        d: "M6 44c-5-9 2-16 9-14 6 1.6 6 10-2 12-8 1.8-14-6-7-13 7-7 22-10 40-8",
        strokeWidth: 1.3,
        dash: [4, 5],
        opacity: 0.7,
      },
      { d: PLANE, ...PAPER_FILL, strokeWidth: 1.6, at: ["translate(38 -2) scale(0.62)"] },
      /* tickets */
      { d: "M14 46h56v12a5 5 0 0 0 0 10v12H14V68a5 5 0 0 0 0-10z", ...PAPER_FILL, strokeWidth: 1.8 },
      { d: "M52 46v34", strokeWidth: 1.2, dash: [3, 4], opacity: 0.7 },
      { d: "M20 58h20M20 68h14", strokeWidth: 1.3, opacity: 0.65 },
      redHeart(60, 63, 11),
    ],
  },
  "candle-jar": {
    box: "0 0 72 92",
    pen: SKETCH,
    parts: [
      redHeart(36, 6, 8, 0.85),
      redHeart(24, 10, 6, 0.7),
      redHeart(48, 11, 5.5, 0.65),
      /* wick and a small flame, sitting just inside the rim */
      { d: "M36 40v6", strokeWidth: 1.4, opacity: 0.7 },
      {
        d: "M36 26c3.2 4 5 6.6 5 9.4 0 3-2.2 5-5 5s-5-2-5-5c0-2.8 1.8-5.4 5-9.4z",
        fill: RED,
        fillStyle: "solid",
        stroke: "#8E0F1A",
        strokeWidth: 0.8,
        wobble: 1.4,
      },
      /* jar: straight sides, rounded base, a lipped rim */
      { d: "M14 48h44v28a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10z", ...PAPER_FILL, strokeWidth: 2 },
      { d: "M11 42h50v6H11z", ...PAPER_FILL, strokeWidth: 1.9 },
      redHeart(36, 70, 14),
    ],
  },

  /* ---------------- section 4 ---------------- */
  "safety-pin": {
    box: "0 0 36 84",
    pen: FINE,
    parts: [
      /* the wire: over the top, down the left, round into the coil */
      { d: "M27 12C27 6 23 3 18 3s-9 3-9 9v46c0 8 4 13 10 13", stroke: "var(--gold)", strokeWidth: 2.6 },
      /* the needle running up the inside to the clasp */
      { d: "M22 68 25 26", stroke: "var(--gold)", strokeWidth: 2.4 },
      /* clasp cap the point sits inside */
      { d: "M20 12h9v14a4 4 0 0 1-4 4h-5z", stroke: "var(--gold)", strokeWidth: 2.2 },
      /* the spring coil at the foot */
      { circle: [22, 70, 15], stroke: "var(--gold)", strokeWidth: 2.4 },
    ],
  },
  /** The pressed, dried daisy in the wine band — many thin tan petals. */
  daisy: {
    box: "0 0 68 68",
    pen: SKETCH,
    parts: [
      /* one petal, stamped around the centre — 16 separate sketches would be
         16 generations for a difference nobody can see on a dried flower */
      {
        ellipse: [34, 14, 9, 27],
        fill: "currentColor",
        fillStyle: "solid",
        stroke: "currentColor",
        strokeWidth: 0.6,
        wobble: 1.6,
        opacity: 0.84,
        at: Array.from({ length: 16 }, (_, i) => `rotate(${i * 22.5} 34 34)`),
      },
      { circle: [34, 34, 19], fill: "var(--gold)", fillStyle: "solid", stroke: "#8a672f", strokeWidth: 1, wobble: 1.6 },
    ],
  },

  /* ---------------- section 5 reason cards ---------------- */
  /** Two smiling mugs, steam curling up into a heart. */
  "mugs-heart": {
    box: "0 0 96 74",
    parts: [
      { d: heartPath(48, 11, 18), strokeWidth: 1.8, wobble: 2.4 },
      /* steam curling up out of both mugs into the heart */
      { d: "M36 28c-4-5-1-9 2-12M60 28c4-5 1-9-2-12", strokeWidth: 1.6, wobble: 3, opacity: 0.85 },
      /* left mug: handle on the outside, rounded base */
      { d: "M14 34h28v20c0 8-6 14-14 14s-14-6-14-14z", strokeWidth: 2, wobble: 2.2 },
      { d: "M14 40H9a7 7 0 0 0 0 14h5", strokeWidth: 2, wobble: 2.4 },
      { circle: [22, 46, 3.2], fill: "currentColor", fillStyle: "solid", stroke: "none", wobble: 1.2 },
      { circle: [34, 46, 3.2], fill: "currentColor", fillStyle: "solid", stroke: "none", wobble: 1.2 },
      { d: "M23 53c2.6 3 7.4 3 10 0", strokeWidth: 1.7, wobble: 3 },
      /* right mug, mirrored */
      { d: "M54 34h28v20c0 8-6 14-14 14s-14-6-14-14z", strokeWidth: 2, wobble: 2.2 },
      { d: "M82 40h5a7 7 0 0 1 0 14h-5", strokeWidth: 2, wobble: 2.4 },
      { circle: [62, 46, 3.2], fill: "currentColor", fillStyle: "solid", stroke: "none", wobble: 1.2 },
      { circle: [74, 46, 3.2], fill: "currentColor", fillStyle: "solid", stroke: "none", wobble: 1.2 },
      { d: "M63 53c2.6 3 7.4 3 10 0", strokeWidth: 1.7, wobble: 3 },
    ],
  },
  /** Him kissing her cheek — short hair left, long waves right. */
  "faces-kiss": {
    box: "0 0 100 72",
    parts: [
      { d: heartPath(50, 8, 11), strokeWidth: 1.6, wobble: 2.4 },
      /* left head, leaning in */
      { d: "M40 32c0-9-7-16-15-16s-15 7-15 16c0 8 5 14 11 16", strokeWidth: 2, wobble: 2.2 },
      { d: "M10 30c-3-8 4-15 15-15s18 7 15 15c-3-6-8-9-15-9s-12 3-15 9z", strokeWidth: 1.8, wobble: 2.6 },
      { d: "M10 34c-3 6-4 16-3 26M40 34c3 5 4 15 3 24", strokeWidth: 1.7, wobble: 2.4 },
      { d: "M15 28c1.4-2.4 4.6-2.4 6 0", strokeWidth: 1.7, wobble: 3 },
      { d: "M24 40c3 2.6 8 2 10-1", strokeWidth: 1.7, wobble: 3 },
      /* right head with long hair */
      { d: "M58 36c0-10 8-18 17-18s17 8 17 18c0 9-6 16-13 18", strokeWidth: 2, wobble: 2.2 },
      { d: "M58 34c-4 9-5 22-3 34M92 34c5 10 6 23 4 34", strokeWidth: 1.7, wobble: 2.6 },
      { d: "M62 46c-4 8-5 16-4 24M88 46c4 8 5 16 4 24", strokeWidth: 1.3, wobble: 3, opacity: 0.7 },
      { d: "M78 30c1.4-2.4 4.6-2.4 6 0", strokeWidth: 1.7, wobble: 3 },
      { d: "M66 42c2.6 2.4 6.6 2.4 9 0", strokeWidth: 1.6, wobble: 3 },
    ],
  },
  /** Two arms down from the corners, pinkies linked, a heart either side. */
  "hands-hold": {
    box: "0 0 104 66",
    parts: [
      /* two forearms coming down from the corners */
      { d: "M4 2 42 32", strokeWidth: 2, wobble: 1.6 },
      { d: "M100 2 62 32", strokeWidth: 2, wobble: 1.6 },
      { d: "M14 2 46 27M90 2 58 27", strokeWidth: 1.5, wobble: 1.8, opacity: 0.7 },
      /* the two pinkies, hooked through each other */
      { d: "M42 30c8 1 12 7 11 13-.8 5-5.4 8-10 7", strokeWidth: 2.2, wobble: 2 },
      { d: "M62 30c-8 1-12 7-11 13 .8 5 5.4 8 10 7", strokeWidth: 2.2, wobble: 2 },
      { d: heartPath(16, 46, 13), strokeWidth: 1.6, wobble: 2.6 },
      { d: heartPath(88, 46, 13), strokeWidth: 1.6, wobble: 2.6 },
    ],
  },
  /** Her face, eyes closed happy, long waves, sparkles around. */
  "smile-sparkle": {
    box: "0 0 88 80",
    parts: [
      { d: "M22 38c0-13 10-23 22-23s22 10 22 23c0 12-7 21-16 24", strokeWidth: 2, wobble: 2.2 },
      { d: "M22 36c-3-12 8-22 22-22s25 10 22 22c-4-9-12-14-22-14s-18 5-22 14z", strokeWidth: 1.9, wobble: 2.6 },
      { d: "M22 38c-6 11-7 26-5 40M66 38c6 11 7 26 5 40", strokeWidth: 1.7, wobble: 2.6 },
      { d: "M27 50c-4 9-5 18-4 27M61 50c4 9 5 18 4 27", strokeWidth: 1.3, wobble: 3, opacity: 0.7 },
      /* closed, smiling eyes and a curved mouth */
      { d: "M31 40c2-3.4 6.6-3.4 8.6 0M48 40c2-3.4 6.6-3.4 8.6 0", strokeWidth: 1.8, wobble: 3 },
      { d: "M35 51c5 5 14 5 19 0", strokeWidth: 2, wobble: 3 },
      { d: "M29 47c2.4-.6 4.4-.4 6 .6M53 47c2.4-.6 4.4-.4 6 .6", strokeWidth: 1.3, wobble: 3, opacity: 0.6 },
      /* sparkles */
      {
        d: "M11 14c.7 3.6 2.2 5.2 5.8 6-3.6.8-5.1 2.4-5.8 6-.7-3.6-2.2-5.2-5.8-6 3.6-.8 5.1-2.4 5.8-6z",
        fill: "currentColor",
        fillStyle: "solid",
        strokeWidth: 0.5,
        wobble: 1.6,
      },
      {
        d: "M79 22c.6 3 1.8 4.3 4.8 5-3 .7-4.2 2-4.8 5-.6-3-1.8-4.3-4.8-5 3-.7 4.2-2 4.8-5z",
        fill: "currentColor",
        fillStyle: "solid",
        strokeWidth: 0.5,
        wobble: 1.6,
      },
      {
        d: "M75 58c.5 2.4 1.5 3.5 3.9 4-2.4.5-3.4 1.6-3.9 4-.5-2.4-1.5-3.5-3.9-4 2.4-.5 3.4-1.6 3.9-4z",
        fill: "currentColor",
        fillStyle: "solid",
        strokeWidth: 0.5,
        wobble: 1.6,
      },
      {
        d: "M14 62c.5 2.4 1.5 3.5 3.9 4-2.4.5-3.4 1.6-3.9 4-.5-2.4-1.5-3.5-3.9-4 2.4-.5 3.4-1.6 3.9-4z",
        fill: "currentColor",
        fillStyle: "solid",
        strokeWidth: 0.5,
        wobble: 1.6,
        opacity: 0.8,
      },
    ],
  },
  /** Dots bubble low-left, heart bubble high-right. */
  "speech-bubbles": {
    box: "0 0 100 72",
    parts: [
      /* heart bubble, up and to the right */
      { d: "M96 12a6 6 0 0 0-6-6H50a6 6 0 0 0-6 6v18a6 6 0 0 0 6 6h30l10 8-2-8h2a6 6 0 0 0 6-6z", strokeWidth: 2, wobble: 2.2 },
      {
        d: heartPath(70, 21, 17),
        fill: "currentColor",
        fillStyle: "solid",
        strokeWidth: 0.8,
        wobble: 1.6,
      },
      /* dots bubble, down and to the left */
      { d: "M4 40a6 6 0 0 1 6-6h34a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H22l-10 8 2-8h-4a6 6 0 0 1-6-6z", strokeWidth: 2, wobble: 2.2 },
      { circle: [17, 48, 5], fill: "currentColor", fillStyle: "solid", stroke: "none", wobble: 1.4 },
      { circle: [27, 48, 5], fill: "currentColor", fillStyle: "solid", stroke: "none", wobble: 1.4 },
      { circle: [37, 48, 5], fill: "currentColor", fillStyle: "solid", stroke: "none", wobble: 1.4 },
    ],
  },
  /** A dashed heart-shaped trail running up into a paper plane. */
  "plane-heart": {
    box: "0 0 108 78",
    parts: [
      {
        d: heartPath(46, 46, 54, 52),
        strokeWidth: 1.7,
        dash: [5, 6],
        wobble: 1.8,
        opacity: 0.8,
      },
      { d: PLANE, strokeWidth: 1.9, wobble: 1.8, at: ["translate(46 -4) scale(0.7)"] },
    ],
  },
  /** A little house with a tree, hearts rising off the roof. */
  "house-hearts": {
    box: "0 0 108 84",
    parts: [
      { d: "M14 42 44 18l30 24", strokeWidth: 2, wobble: 2.2 },
      { d: "M20 40v36h48V40", strokeWidth: 2, wobble: 2.2 },
      { d: "M36 76V57h15v19", strokeWidth: 1.9, wobble: 2.4 },
      { d: "M60 48h-7v9h7z", strokeWidth: 1.5, wobble: 3 },
      { d: heartPath(44, 34, 11), strokeWidth: 1.5, wobble: 2.6 },
      /* tree */
      { d: "M88 76V54", strokeWidth: 1.9, wobble: 2.4 },
      { d: "M88 58c-10 0-16-7-16-15s7-14 16-14 16 6 16 14-6 15-16 15z", strokeWidth: 2, wobble: 2.6 },
      /* ground */
      { d: "M6 77h96", strokeWidth: 1.6, wobble: 2.6, opacity: 0.75 },
      { d: "M12 80h10M30 81h12M56 80h10M76 81h14", strokeWidth: 1.2, wobble: 3, opacity: 0.5 },
      /* hearts off the roof */
      { d: heartPath(28, 12, 10), fill: "currentColor", fillStyle: "solid", strokeWidth: 0.7, wobble: 1.6 },
      { d: heartPath(62, 9, 8), fill: "currentColor", fillStyle: "solid", strokeWidth: 0.7, wobble: 1.6, opacity: 0.8 },
      { d: heartPath(46, 5, 6), fill: "currentColor", fillStyle: "solid", strokeWidth: 0.7, wobble: 1.6, opacity: 0.65 },
    ],
  },
  /** Scribbled solid heart with motion ticks — "simply put, I just love you". */
  "scribble-heart": {
    box: "0 0 96 82",
    parts: [
      {
        d: heartPath(48, 46, 70, 66),
        fill: "currentColor",
        fillStyle: "zigzag",
        hachureAngle: 62,
        hachureGap: 2.6,
        fillWeight: 2.2,
        stroke: "currentColor",
        strokeWidth: 3,
        wobble: 2.4,
      },
      { d: "M8 22 1 15M14 9 10 1M28 5 27-3", strokeWidth: 2, wobble: 2.6, opacity: 0.85 },
      { d: "M88 22l7-7M82 9l4-8M68 5l1-8", strokeWidth: 2, wobble: 2.6, opacity: 0.85 },
    ],
  },

  /* ---------------- sections 6 & 7 ---------------- */
  "hearts-interlocked": {
    box: "0 0 112 72",
    parts: [
      { d: heartPath(40, 42, 60, 56), strokeWidth: 2.4, wobble: 2.2 },
      { d: heartPath(72, 40, 60, 56), strokeWidth: 2.4, wobble: 2.2, seed: 29 },
    ],
  },
  twine: {
    /* The mockup's twine swings well clear of the edge and ties itself into a
       looped heart about a quarter of the way down. */
    box: "0 0 120 400",
    parts: [
      {
        d: "M100 0C92 44 80 84 82 110 86 128 98 140 98 158 98 188 60 202 52 242 44 288 34 346 38 400",
        stroke: "#c9c0b2",
        strokeWidth: 4,
        wobble: 1.4,
      },
      {
        d: "M100 0C92 44 80 84 82 110 86 128 98 140 98 158 98 188 60 202 52 242 44 288 34 346 38 400",
        stroke: "var(--ink-red)",
        strokeWidth: 4,
        dash: [9, 9],
        wobble: 1.4,
      },
      /* the twine ties itself into a heart on the way down */
      {
        d: heartPath(86, 128, 46, 42),
        stroke: "#c9c0b2",
        strokeWidth: 4,
        wobble: 1.8,
      },
      {
        d: heartPath(86, 128, 46, 42),
        stroke: "var(--ink-red)",
        strokeWidth: 4,
        dash: [9, 9],
        wobble: 1.8,
      },
    ],
  },
  lantern: {
    box: "0 0 64 96",
    pen: FINE,
    parts: [
      { d: "M32 4v8M22 12h20", strokeWidth: 1.8 },
      { d: "M18 16h28l4 8H14z", strokeWidth: 1.8 },
      { rect: [23, 34, 18, 30], fill: "var(--gold-light)", fillStyle: "solid", stroke: "none", opacity: 0.9 },
      { d: "M17 24h30v50H17z", strokeWidth: 1.8 },
      { d: "M13 74h38l4 8H9z", strokeWidth: 1.8 },
      { d: "M17 34h30M17 64h30", strokeWidth: 1.1, opacity: 0.6 },
      {
        d: heartPath(32, 50, 12, 13),
        fill: "#C2182A",
        fillStyle: "solid",
        stroke: "#8E0F1A",
        strokeWidth: 0.7,
        wobble: 1.4,
      },
    ],
  },
};

import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import type { Point } from "roughjs/bin/geometry";

/**
 * Every hand-drawn mark on the anniversary page goes through here.
 *
 * roughjs redraws a clean shape as a sketched one: the outline in two wobbly
 * passes, fills as hachure strokes or a loose solid. The mockups are
 * ballpoint-on-paper, so nothing decorative should be a true bezier.
 *
 * Generation is seeded and memoised at module scope — same geometry on every
 * render, and a shape costs nothing until something asks for it.
 */

const gen = rough.generator();

/** roughjs options plus the few things this module adds on top. */
export type Pen = Omit<Options, "roughness" | "strokeLineDash"> & {
  /**
   * Wobble as a percentage of the mark's short side, not user units. roughjs's
   * own `roughness` is absolute, so one setting that reads as pencil on a
   * 24-unit heart is invisible on a 120-unit sprig. Everything here is
   * scale-free; `sketch` converts it per viewBox.
   */
  wobble?: number;
  opacity?: number;
  /** Dash pattern. roughjs treats this as a render attribute, so it rides along. */
  dash?: number[];
  /**
   * Stamp the same sketched geometry once per transform instead of once at the
   * origin. Ten bloom clusters on a sprig cost one generation, not ten — and
   * repeating one cluster is what a real sprig looks like anyway.
   */
  at?: string[];
};

/** The shape to be sketched. One key per roughjs primitive. */
export type Shape =
  | { d: string }
  | { circle: [cx: number, cy: number, diameter: number] }
  | { ellipse: [cx: number, cy: number, w: number, h: number] }
  | { rect: [x: number, y: number, w: number, h: number] }
  | { poly: Point[] };

export type Part = Shape & Pen;

/** A path ready to render: roughjs has already decided stroke vs fill. */
export type Mark = {
  d: string;
  stroke: string;
  strokeWidth: number;
  fill: string;
  opacity?: number;
  dash?: number[];
  at?: string[];
};

/* ---- pens, matched to the marks in images/section*.png ---- */

/** Red ballpoint: two visible passes, loose. Small hearts, thread, card icons. */
export const INK: Pen = { wobble: 3.6, bowing: 1.3, stroke: "currentColor", seed: 11 };

/** Gold glitter: solid but with an irregular edge. Stars and sparkles. */
export const GOLD: Pen = {
  wobble: 2.4,
  bowing: 0.6,
  fillStyle: "solid",
  fill: "currentColor",
  stroke: "currentColor",
  seed: 5,
};

/** Brown outline over a pale solid. The milestone icons in section 3. */
export const SKETCH: Pen = { wobble: 2.6, bowing: 0.9, stroke: "currentColor", seed: 17 };

/** Near-clean: marks small enough that wobble reads as noise, or meant to be metal. */
export const FINE: Pen = { wobble: 0.9, bowing: 0.4, stroke: "currentColor", seed: 23 };

/**
 * A heart of width `w` centred on (cx, cy). Small red hearts sit inside a
 * dozen different marks in the mockups — on a cup sleeve, on a ticket, drifting
 * over a house — so the shape is parametric rather than copied per icon.
 */
export function heartPath(cx: number, cy: number, w: number, h = w * 0.92): string {
  const X = (u: number) => +(cx - w / 2 + u * w).toFixed(2);
  const Y = (v: number) => +(cy - h / 2 + v * h).toFixed(2);
  return (
    `M${X(0.5)} ${Y(1)}` +
    `C${X(0.06)} ${Y(0.68)} ${X(0)} ${Y(0.45)} ${X(0)} ${Y(0.3)}` +
    `C${X(0)} ${Y(0.12)} ${X(0.17)} ${Y(0)} ${X(0.33)} ${Y(0)}` +
    `C${X(0.42)} ${Y(0)} ${X(0.47)} ${Y(0.06)} ${X(0.5)} ${Y(0.14)}` +
    `C${X(0.53)} ${Y(0.06)} ${X(0.58)} ${Y(0)} ${X(0.67)} ${Y(0)}` +
    `C${X(0.83)} ${Y(0)} ${X(1)} ${Y(0.12)} ${X(1)} ${Y(0.3)}` +
    `C${X(1)} ${Y(0.45)} ${X(0.94)} ${Y(0.68)} ${X(0.5)} ${Y(1)}Z`
  );
}

const cache = new Map<string, Mark[]>();

function build(part: Part, box: number, base: Pen): Mark[] {
  const { wobble, opacity, dash, at, ...rest } = { ...base, ...part };
  const o: Options = {
    ...(rest as Options),
    roughness: ((wobble ?? 3) * box) / 100,
  };
  const drawable =
    "d" in part
      ? gen.path(part.d, o)
      : "circle" in part
        ? gen.circle(part.circle[0], part.circle[1], part.circle[2], o)
        : "ellipse" in part
          ? gen.ellipse(part.ellipse[0], part.ellipse[1], part.ellipse[2], part.ellipse[3], o)
          : "rect" in part
            ? gen.rectangle(part.rect[0], part.rect[1], part.rect[2], part.rect[3], o)
            : gen.polygon(part.poly, o);

  return gen.toPaths(drawable).map((p) => ({
    /* roughjs only honours `fixedDecimalPlaceDigits` in its own SVG renderer,
       not in toPaths — and full float precision on a few thousand marks is a
       lot of DOM for sub-pixel detail nobody sees. */
    d: p.d.replace(/\d+\.\d{3,}/g, (n) => (+n).toFixed(2)),
    stroke: p.stroke,
    strokeWidth: p.strokeWidth,
    fill: p.fill ?? "none",
    opacity,
    dash,
    at,
  }));
}

/**
 * The dimension `wobble` is measured against: the short side, not the width.
 * A 200×22 squiggle is a 22-unit-tall mark stretched sideways — scaling its
 * wobble to 200 would shake it off the page.
 */
const scaleOf = (viewBox: string) => {
  const [, , w, h] = viewBox.split(/[\s,]+/).map(Number);
  return Math.min(w, h);
};

/**
 * Sketch a set of parts into renderable marks.
 *
 * @param key      cache key — must be unique per (parts, viewBox, base) combination
 * @param viewBox  the SVG viewBox, so `wobble` can be scaled to the mark's size
 * @param base     pen applied to every part; each part may override any of it
 */
export function sketch(key: string, viewBox: string, parts: Part[], base: Pen = INK): Mark[] {
  let marks = cache.get(key);
  if (!marks) {
    const box = scaleOf(viewBox);
    marks = parts.flatMap((p) => build(p, box, base));
    cache.set(key, marks);
  }
  return marks;
}

/** Clears the memo. Tests only — nothing in the page needs to regenerate. */
export function clearSketchCache() {
  cache.clear();
}

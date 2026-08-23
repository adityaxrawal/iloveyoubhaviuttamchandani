import { describe, expect, it } from "vitest";
import { DOODLES } from "./doodles";
import { INK, clearSketchCache, heartPath, sketch } from "./rough";

const names = Object.keys(DOODLES);

describe("sketch", () => {
  it("has doodles to draw", () => {
    expect(names.length).toBeGreaterThan(25);
  });

  it.each(names)("%s produces drawable geometry", (name) => {
    const spec = DOODLES[name];
    const marks = sketch(name, spec.box, spec.parts, spec.pen ?? INK);

    expect(marks.length).toBeGreaterThan(0);
    for (const m of marks) {
      expect(m.d.length).toBeGreaterThan(0);
      // A malformed path or a bad radius yields NaN in the coordinates, which
      // renders as nothing at all rather than as an error.
      expect(m.d).not.toMatch(/NaN|Infinity|undefined/);
      // Every mark is either stroked or filled; one that is neither is invisible.
      expect(m.stroke !== "none" || m.fill !== "none").toBe(true);
    }
  });

  it("is deterministic, so the server and the client draw the same line", () => {
    const spec = DOODLES["heart-hatch"];
    const first = sketch("determinism", spec.box, spec.parts, spec.pen ?? INK);
    clearSketchCache();
    const second = sketch("determinism", spec.box, spec.parts, spec.pen ?? INK);
    expect(second).toEqual(first);
  });

  it("scales wobble to the mark, not to user units", () => {
    clearSketchCache();
    const part = { d: "M0 0L100 0" as string, wobble: 4, seed: 1 };
    const small = sketch("small", "0 0 20 20", [part]);
    const large = sketch("large", "0 0 200 200", [part]);
    // Same wobble on a 10x bigger box has to move the line 10x further.
    const spread = (d: string) =>
      Math.max(...(d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)) -
      Math.min(...(d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number));
    expect(spread(large[0].d)).toBeGreaterThan(spread(small[0].d));
  });

  it("caches by key rather than regenerating", () => {
    clearSketchCache();
    const a = sketch("cached", "0 0 20 20", [{ d: "M0 0L10 10" }]);
    const b = sketch("cached", "0 0 20 20", [{ d: "M0 0L10 10" }]);
    expect(b).toBe(a);
  });
});

describe("heartPath", () => {
  it("centres the heart on the point it is given", () => {
    const nums = (heartPath(50, 50, 20).match(/-?\d+(\.\d+)?/g) ?? []).map(
      Number,
    );
    const xs = nums.filter((_, i) => i % 2 === 0);
    expect(Math.min(...xs)).toBeCloseTo(40, 1);
    expect(Math.max(...xs)).toBeCloseTo(60, 1);
  });
});

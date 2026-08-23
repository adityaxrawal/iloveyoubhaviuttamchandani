import { describe, expect, it } from "vitest";
import { patchCss, topLevelRules } from "./vite-plugin-layout-save";

describe("topLevelRules", () => {
  it("skips rules nested in @media and braces inside comments", () => {
    const css = `
/* a stray { brace in a comment */
.g1 { top: 6.7%; }
@media (max-width: 1200px) {
  .g1 { display: none; }
}
`;
    const rules = topLevelRules(css);
    expect(rules.map((r) => r.prelude)).toEqual([".g1"]);
  });
});

describe("patchCss", () => {
  const css = `.g1 { top: 6.7%; left: 2.9%; }

.slotPolaroidA { grid-column: 1; grid-row: 1;
                 translate: calc(3.6 * var(--u)) calc(5.6 * var(--u)); }

.hatchL {
  position: absolute;
  top: 27.1%;
  left: 4.2%;
}

@media (max-width: 1200px) {
  .g1 { display: none; }
}
`;

  it("replaces an existing declaration and leaves the @media copy alone", () => {
    const out = patchCss(css, "g1", { top: "9%", left: "4%" });
    expect(out).toContain(".g1 { top: 9%; left: 4%; }");
    expect(out).toContain(".g1 { display: none; }");
  });

  it("rewrites a translate without touching neighbouring declarations", () => {
    const out = patchCss(css, "slotPolaroidA", {
      translate: "calc(4 * var(--u)) calc(6 * var(--u))",
    });
    expect(out).toContain("grid-column: 1; grid-row: 1;");
    expect(out).toContain("translate: calc(4 * var(--u)) calc(6 * var(--u));");
  });

  it("inserts a missing declaration into a multi-line rule", () => {
    const out = patchCss(css, "hatchL", { translate: "2vw 0vw" });
    expect(out).toMatch(/left: 4\.2%;\n {2}translate: 2vw 0vw;\n\}/);
  });

  it("keeps the closing brace indented when inserting inside a nested rule", () => {
    const nested = `@media (max-width: 1023px) {
  .band {
    min-height: auto;
  }
}
`;
    const out = patchCss(nested, "band", { translate: "1vw 0vw" }, "(max-width: 1023px)");
    expect(out).toBe(`@media (max-width: 1023px) {
  .band {
    min-height: auto;
    translate: 1vw 0vw;
  }
}
`);
  });

  it("does not mistake padding-top for top", () => {
    const out = patchCss(".x { padding-top: 4px; }", "x", { top: "1%" });
    expect(out).toContain("padding-top: 4px;");
    expect(out).toContain("top: 1%;");
  });

  it("appends a rule when the class has none", () => {
    const out = patchCss(css, "taped", { translate: "1vw 2vw" });
    expect(out).toContain(".taped {\n  translate: 1vw 2vw;\n}");
  });
});

describe("patchCss into a media query", () => {
  const css = `.g1 { top: 6.7%; left: 2.9%; }

@media (max-width: 1200px) {
  .g1 { display: none; }
  .slotCentre { grid-column: 1 / -1; }
}
`;

  it("edits the rule inside the matching @media, not the base rule", () => {
    const out = patchCss(css, "g1", { top: "12%" }, "(max-width: 1200px)");
    expect(out).toContain(".g1 { top: 6.7%; left: 2.9%; }"); // base untouched
    expect(out).toContain(".g1 { display: none; top: 12%; }");
  });

  it("matches an @media block regardless of internal spacing", () => {
    const out = patchCss(css, "g1", { top: "12%" }, "(max-width:1200px)");
    expect(out).toContain(".g1 { display: none; top: 12%; }");
  });

  it("adds a rule inside an existing @media when the class has none there", () => {
    const out = patchCss(css, "hatchL", { rotate: "4deg" }, "(max-width: 1200px)");
    expect(out).toMatch(
      /grid-column: 1 \/ -1; \}\n\n {2}\.hatchL \{\n {4}rotate: 4deg;\n {2}\}\n\}/,
    );
  });

  it("never edits a grouped selector — writes a dedicated rule after it", () => {
    const grouped = `@media (max-width: 1200px) {
  .slotPolaroidA { grid-column: 1; grid-row: 2; }
  .slotPolaroidA, .slotCentre { translate: none; }
}
`;
    const out = patchCss(grouped, "slotPolaroidA", { translate: "1vw 2vw" }, "(max-width: 1200px)");
    expect(out).toContain(".slotPolaroidA, .slotCentre { translate: none; }");
    expect(out).toContain(".slotPolaroidA { grid-column: 1; grid-row: 2; translate: 1vw 2vw; }");
    expect(out.match(/translate: none/g)).toHaveLength(1);
  });

  it("creates the @media block when the breakpoint is new", () => {
    const out = patchCss(css, "g1", { top: "3%" }, "(max-width: 820px)");
    expect(out).toContain(
      "@media (max-width: 820px) {\n  .g1 {\n    top: 3%;\n  }\n}",
    );
    expect(out).toContain(".g1 { display: none; }"); // 1200px block untouched
  });
});

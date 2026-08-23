import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/* ------------------------------------------------------------------ *
 * Dev-only: the drag editor (src/anniversary/dev/LayoutEditor.tsx) POSTs
 * the declarations it wants written back into the CSS modules. All the
 * geometry maths happens in the browser, where the boxes actually are —
 * this side only edits text.
 * ------------------------------------------------------------------ */

export type Edit = {
  /** basename of the module, e.g. "S1Anniversary" */
  base: string;
  /** local class name inside it, e.g. "slotPolaroidA" */
  local: string;
  /** `(max-width: 1200px)` to write inside that @media, null for the base rule */
  media?: string | null;
  /** final declarations, e.g. { left: "56.8%", top: "15.3%" } */
  decls: Record<string, string>;
};

export type CustomItem = {
  id: string;
  base: string;
  local: string;
  type: "doodle" | "svg-element" | "text";
  doodleName?: string;
  svgSrc?: string;
  size?: number;
  color?: string;
  text?: string;
  fontSize?: number;
  bold?: boolean;
  position?: {
    left?: string;
    top?: string;
    rotate?: string;
    scale?: string;
  };
};

export type TextUpdate = {
  base: string;
  local: string;
  text: string;
};

export type Block = { prelude: string; bodyStart: number; bodyEnd: number };

const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();

/**
 * Every `prelude { … }` block at one nesting level of `css[from..to]`.
 * Comments and quoted strings are stepped over so a brace inside a data: URI
 * or a `/* … *\/` can't derail the brace counting.
 */
export function blocksIn(css: string, from = 0, to = css.length): Block[] {
  const out: Block[] = [];
  let depth = 0;
  let selStart = from;
  let prelude = "";
  let bodyStart = 0;

  for (let i = from; i < to; i++) {
    const c = css[i];

    if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      i = end === -1 || end > to ? to : end + 1;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < to && css[j] !== c) j += css[j] === "\\" ? 2 : 1;
      i = j;
      continue;
    }

    if (c === "{") {
      if (depth === 0) {
        prelude = css
          .slice(selStart, i)
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .trim();
        bodyStart = i + 1;
      }
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0) {
        if (prelude) out.push({ prelude, bodyStart, bodyEnd: i });
        selStart = i + 1;
      }
    }
  }
  return out;
}

/** Plain style rules at the top level — no @media, @supports, @font-face. */
export function topLevelRules(css: string): Block[] {
  return blocksIn(css).filter((b) => !b.prelude.startsWith("@"));
}

/**
 * Only a rule that styles this one class. A grouped selector like
 * `.slotPolaroidA, .slotCentre, … { translate: none }` matches the class too,
 * but editing it would move every slot in the list — so those are skipped and
 * a dedicated rule is written after them instead.
 */
const targets = (prelude: string, local: string) =>
  prelude.trim() === `.${local}`;

/** Writes `prop: value` into a rule body, replacing in place when present. */
function setDecls(body: string, decls: Record<string, string>): string {
  const multiline = body.includes("\n");
  for (const [prop, value] of Object.entries(decls)) {
    // `[;{\s]` in front keeps `top` from matching inside `padding-top`.
    const re = new RegExp(`(^|[;\\s])(${prop})\\s*:\\s*[^;}]*`);
    if (re.test(body)) {
      body = body.replace(re, `$1$2: ${value}`);
    } else if (multiline) {
      const indent = /\n([ \t]+)\S/.exec(body)?.[1] ?? "  ";
      // keep the whitespace that indents the closing brace
      const tail = /\s*$/.exec(body)?.[0] ?? "";
      body = `${body.slice(0, body.length - tail.length)}\n${indent}${prop}: ${value};${tail}`;
    } else {
      body = `${body.replace(/\s*$/, "")} ${prop}: ${value}; `;
    }
  }
  return body;
}

const splice = (css: string, start: number, end: number, text: string) =>
  css.slice(0, start) + text + css.slice(end);

/**
 * Writes `decls` into the last rule for `.local` inside the requested scope —
 * the file's top level, or the `@media <media>` block. The browser picks its
 * "before" values from the same rule (last match wins in the CSSOM too), so
 * both ends agree on the target. Missing rules and missing @media blocks are
 * created.
 */
export function patchCss(
  css: string,
  local: string,
  decls: Record<string, string>,
  media?: string | null,
): string {
  let from = 0;
  let to = css.length;

  if (media) {
    const want = norm(`@media ${media}`);
    const block = blocksIn(css).find(
      (b) => b.prelude.startsWith("@media") && norm(b.prelude) === want,
    );
    if (!block) {
      const body = Object.entries(decls)
        .map(([p, v]) => `    ${p}: ${v};`)
        .join("\n");
      return `${css.replace(/\s*$/, "")}\n\n@media ${media} {\n  .${local} {\n${body}\n  }\n}\n`;
    }
    from = block.bodyStart;
    to = block.bodyEnd;
  }

  const hits = blocksIn(css, from, to).filter((b) => targets(b.prelude, local));
  const rule = hits[hits.length - 1];

  if (!rule) {
    const indent = media ? "  " : "";
    const body = Object.entries(decls)
      .map(([p, v]) => `${indent}  ${p}: ${v};`)
      .join("\n");
    const text = `\n${indent}.${local} {\n${body}\n${indent}}\n`;
    return media
      ? splice(css, to, to, text)
      : `${css.replace(/\s*$/, "")}\n${text}`;
  }

  return splice(
    css,
    rule.bodyStart,
    rule.bodyEnd,
    setDecls(css.slice(rule.bodyStart, rule.bodyEnd), decls),
  );
}

function findModules(dir: string, acc = new Map<string, string[]>()) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) findModules(full, acc);
    else if (e.name.endsWith(".module.css")) {
      const base = e.name.slice(0, -".module.css".length);
      acc.set(base, [...(acc.get(base) ?? []), full]);
    }
  }
  return acc;
}

/**
 * Injects newly added custom elements directly into the corresponding section TSX
 * and its CSS module so they become permanent native elements instead of custom JSON entries.
 */
function injectCustomElementsDirectly(
  root: string,
  items: CustomItem[],
  written: string[],
  errors: string[],
) {
  if (!items || items.length === 0) return;

  const byBase = new Map<string, CustomItem[]>();
  for (const item of items) {
    const list = byBase.get(item.base) ?? [];
    list.push(item);
    byBase.set(item.base, list);
  }

  for (const [base, sectionItems] of byBase) {
    const tsxPath = path.resolve(root, `anniversary/sections/${base}.tsx`);
    const cssPath = path.resolve(root, `anniversary/sections/${base}.module.css`);

    if (!fs.existsSync(tsxPath) || !fs.existsSync(cssPath)) {
      errors.push(`Section files not found for ${base}`);
      continue;
    }

    let tsx = fs.readFileSync(tsxPath, "utf8");
    let css = fs.readFileSync(cssPath, "utf8");

    let hasDoodleImport = tsx.includes("import Doodle");

    const jsxBlocks: string[] = [];
    const cssBlocks: string[] = [];

    for (const item of sectionItems) {
      const cls = item.local.replace(/[^a-zA-Z0-9_]/g, "_");
      const pos = item.position ?? { left: "50%", top: "50%" };
      const left = pos.left ?? "50%";
      const top = pos.top ?? "50%";
      const rot = pos.rotate ? `  rotate: ${pos.rotate};\n` : "";
      const scale = pos.scale && pos.scale !== "1" ? `  scale: ${pos.scale};\n` : "";

      if (item.type === "doodle" && item.doodleName) {
        if (!hasDoodleImport) {
          tsx = `import Doodle from "../components/Doodle";\n` + tsx;
          hasDoodleImport = true;
        }
        jsxBlocks.push(
          `      <Doodle name="${item.doodleName}" size={${item.size ?? 32}} className={s.${cls}} />`
        );
        const col = item.color ? `  color: ${item.color};\n` : "";
        cssBlocks.push(
          `.${cls} {\n  position: absolute;\n  left: ${left};\n  top: ${top};\n  translate: -50% -50%;\n${rot}${scale}${col}  z-index: 20;\n}`
        );
      } else if (item.type === "svg-element" && item.svgSrc) {
        const svgFilename = path.basename(item.svgSrc.split("?")[0]);
        const varName =
          svgFilename
            .replace(/\.svg$/, "")
            .replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase()) + "Svg";

        if (!tsx.includes(`import ${varName}`)) {
          tsx = `import ${varName} from "../elements/${svgFilename}";\n` + tsx;
        }

        jsxBlocks.push(
          `      <img src={${varName}} alt="" className={s.${cls}} />`
        );
        cssBlocks.push(
          `.${cls} {\n  position: absolute;\n  left: ${left};\n  top: ${top};\n  translate: -50% -50%;\n  width: ${item.size ?? 120}px;\n  height: auto;\n  object-fit: contain;\n  display: block;\n${rot}${scale}  z-index: 20;\n}`
        );
      } else if (item.type === "text" && item.text) {
        // Encode text properly
        const safeText = item.text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        
        jsxBlocks.push(
          `      <div className={s.${cls}} data-am-text="true">{\`${safeText}\`}</div>`
        );
        const fw = item.bold ? "700" : "400";
        const fs = item.fontSize ?? 24;
        const col = item.color ? `  color: ${item.color};\n` : "";
        cssBlocks.push(
          `.${cls} {\n  position: absolute;\n  left: ${left};\n  top: ${top};\n  translate: -50% -50%;\n${rot}${scale}${col}  z-index: 20;\n  font-size: ${fs}px;\n  font-weight: ${fw};\n  white-space: pre-wrap;\n}`
        );
      }
    }

    if (jsxBlocks.length > 0) {
      const closingIndex = tsx.lastIndexOf("</section>");
      if (closingIndex !== -1) {
        const insertion =
          `\n      {/* ─── Added Elements ─── */}\n` +
          jsxBlocks.join("\n") +
          "\n    ";
        tsx = tsx.slice(0, closingIndex) + insertion + tsx.slice(closingIndex);
        fs.writeFileSync(tsxPath, tsx);
        written.push(`${base}.tsx (+${jsxBlocks.length} elements)`);
      } else {
        errors.push(`Could not find closing </section> tag in ${base}.tsx`);
      }
    }

    if (cssBlocks.length > 0) {
      css =
        css.trimEnd() +
        "\n\n/* ─── Added Elements ─── */\n" +
        cssBlocks.join("\n\n") +
        "\n";
      fs.writeFileSync(cssPath, css);
      written.push(`${base}.module.css (+${cssBlocks.length} rules)`);
    }
  }
}

export type DeletedItem = {
  base: string;
  local: string;
  id?: string;
};

export function removeJsxElementByClass(tsx: string, local: string): string {
  const targetPattern = new RegExp(`(?:s|styles)\\.${local}\\b`);
  
  let match = targetPattern.exec(tsx);
  while (match) {
    const idx = match.index;
    let startIdx = -1;
    let inQuotes: string | null = null;
    for (let i = idx; i >= 0; i--) {
      const char = tsx[i];
      if ((char === '"' || char === "'") && (i === 0 || tsx[i - 1] !== "\\")) {
        if (inQuotes === char) inQuotes = null;
        else if (!inQuotes) inQuotes = char;
      }
      if (!inQuotes && char === "<" && (i === 0 || tsx[i - 1] !== "\\")) {
        if (tsx[i + 1] !== "/" && /[a-zA-Z]/.test(tsx[i + 1])) {
          startIdx = i;
          break;
        }
      }
    }

    if (startIdx === -1) break;

    // Determine line start for clean line deletion
    let commentStart = startIdx;
    const lastNewline = tsx.lastIndexOf("\n", startIdx - 1);
    if (lastNewline !== -1) {
      const linePrefix = tsx.slice(lastNewline + 1, startIdx);
      if (/^[ \t]*$/.test(linePrefix)) {
        commentStart = lastNewline + 1;
      }
    }

    const tagMatch = /^<([a-zA-Z0-9_.]+)/.exec(tsx.slice(startIdx));
    if (!tagMatch) break;
    const tagName = tagMatch[1];

    let endIdx = -1;
    let depth = 0;
    let i = startIdx;
    let inStr: string | null = null;
    let inBraceDepth = 0;

    while (i < tsx.length) {
      const c = tsx[i];
      if ((c === '"' || c === "'") && (i === 0 || tsx[i - 1] !== "\\")) {
        if (inStr === c) inStr = null;
        else if (!inStr) inStr = c;
      } else if (!inStr && c === "{") {
        inBraceDepth++;
      } else if (!inStr && c === "}") {
        inBraceDepth--;
      } else if (!inStr && inBraceDepth === 0) {
        if (c === "<") {
          if (
            tsx.slice(i, i + 2 + tagName.length) === `</${tagName}>` ||
            tsx.slice(i, i + 2 + tagName.length) === `</${tagName} ` ||
            tsx.slice(i, i + 2 + tagName.length) === `</${tagName}\n` ||
            tsx.slice(i, i + 2 + tagName.length) === `</${tagName}\t`
          ) {
            depth--;
            if (depth === 0) {
              const closeTagEnd = tsx.indexOf(">", i);
              if (closeTagEnd !== -1) {
                endIdx = closeTagEnd + 1;
                break;
              }
            }
          } else if (tsx.slice(i, i + 1 + tagName.length) === `<${tagName}` && !/[a-zA-Z0-9_]/.test(tsx[i + 1 + tagName.length] || "")) {
            depth++;
          }
        } else if (c === "/" && tsx[i + 1] === ">") {
          if (depth === 1) {
            endIdx = i + 2;
            break;
          }
        }
      }
      i++;
    }

    if (endIdx !== -1) {
      if (tsx[endIdx] === "\r" && tsx[endIdx + 1] === "\n") endIdx += 2;
      else if (tsx[endIdx] === "\n") endIdx += 1;

      tsx = tsx.slice(0, commentStart) + tsx.slice(endIdx);
    } else {
      break;
    }

    match = targetPattern.exec(tsx);
  }

  return tsx;
}

export function removeCssRulesByClass(css: string, local: string): string {
  const pattern = new RegExp(`(?:\\r?\\n)?[ \\t]*\\.${local}\\b[^{]*\\{[\\s\\S]*?\\}\\s*`, "g");
  css = css.replace(pattern, "\n");

  const childPattern = new RegExp(`(?:\\r?\\n)?[ \\t]*\\.${local}[A-Za-z0-9_]*[^{]*\\{[\\s\\S]*?\\}\\s*`, "g");
  css = css.replace(childPattern, "\n");

  css = css.replace(/@media[^{]+\{\s*\}/g, "");
  css = css.replace(/\/\* ─── Added Elements ─── \*\/\s*(?=\/\*|$)/g, "");

  return css;
}

export function updateJsxTextByClass(tsx: string, local: string, newText: string): string {
  // Finds `<div className={s.local} ...>old text</div>` or `...>{`old text`}</div>` and replaces it
  const targetPattern = new RegExp(`(<div[^>]*className=\\{s\\.${local}\\}[^>]*>)([\\s\\S]*?)(</div>)`);
  
  let match = targetPattern.exec(tsx);
  if (match) {
    const safeText = newText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Use JSX template literal expression so newlines are strictly preserved by React
    tsx = tsx.replace(targetPattern, `$1{\`${safeText}\`}$3`);
  }
  return tsx;
}

function deleteElementsDirectly(
  root: string,
  items: DeletedItem[],
  written: string[],
  errors: string[],
) {
  if (!items || items.length === 0) return;

  const byBase = new Map<string, DeletedItem[]>();
  for (const item of items) {
    if (!item.base) continue;
    const list = byBase.get(item.base) ?? [];
    list.push(item);
    byBase.set(item.base, list);
  }

  for (const [base, sectionItems] of byBase) {
    const tsxPath = path.resolve(root, `anniversary/sections/${base}.tsx`);
    const cssPath = path.resolve(root, `anniversary/sections/${base}.module.css`);

    if (!fs.existsSync(tsxPath) && !fs.existsSync(cssPath)) {
      errors.push(`Section files not found for ${base}`);
      continue;
    }

    if (fs.existsSync(tsxPath)) {
      let tsx = fs.readFileSync(tsxPath, "utf8");
      const origTsx = tsx;
      for (const item of sectionItems) {
        if (item.local) {
          tsx = removeJsxElementByClass(tsx, item.local);
        }
      }
      if (tsx !== origTsx) {
        fs.writeFileSync(tsxPath, tsx);
        written.push(`${base}.tsx (-${sectionItems.length} deleted elements)`);
      }
    }

    if (fs.existsSync(cssPath)) {
      let css = fs.readFileSync(cssPath, "utf8");
      const origCss = css;
      for (const item of sectionItems) {
        if (item.local) {
          css = removeCssRulesByClass(css, item.local);
        }
      }
      if (css !== origCss) {
        fs.writeFileSync(cssPath, css);
        written.push(`${base}.module.css (-${sectionItems.length} deleted rules)`);
      }
    }
  }
}

export default function layoutSave(): Plugin {
  return {
    name: "am-layout-save",
    apply: "serve",
    configureServer(server) {
      const root = path.resolve(server.config.root, "src");

      server.middlewares.use("/__am/save-layout", (req, res) => {
        if (req.method !== "POST") return res.end();
        let raw = "";
        req.on("data", (c) => (raw += c));
        req.on("end", () => {
          const reply = (code: number, body: unknown) => {
            res.statusCode = code;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(body));
          };
          try {
            const bodyObj = JSON.parse(raw);
            const edits = (bodyObj.edits ?? []) as Edit[];
            const customElements = (bodyObj.customElements ?? []) as CustomItem[];
            const deletedElements = (bodyObj.deletedElements ?? []) as DeletedItem[];
            const textUpdates = (bodyObj.textUpdates ?? []) as TextUpdate[];
            const modules = findModules(root);
            const written: string[] = [];
            const errors: string[] = [];

            // Update text nodes
            if (textUpdates.length > 0) {
              const byBase = new Map<string, TextUpdate[]>();
              for (const tu of textUpdates) {
                const list = byBase.get(tu.base) ?? [];
                list.push(tu);
                byBase.set(tu.base, list);
              }
              for (const [base, updates] of byBase) {
                const tsxPath = path.resolve(root, `anniversary/sections/${base}.tsx`);
                if (fs.existsSync(tsxPath)) {
                  let tsx = fs.readFileSync(tsxPath, "utf8");
                  const origTsx = tsx;
                  for (const tu of updates) {
                    tsx = updateJsxTextByClass(tsx, tu.local, tu.text);
                  }
                  if (tsx !== origTsx) {
                    fs.writeFileSync(tsxPath, tsx);
                    written.push(`${base}.tsx (${updates.length} text updates)`);
                  }
                }
              }
            }

            // Directly delete any requested elements from TSX and CSS
            if (deletedElements.length > 0) {
              deleteElementsDirectly(root, deletedElements, written, errors);
            }

            // Directly inject any newly added elements into the corresponding TSX and CSS files
            if (customElements.length > 0) {
              injectCustomElementsDirectly(root, customElements, written, errors);
            }

            // Keep custom-elements.json clean as {}
            const elementsPath = path.resolve(
              root,
              "anniversary/data/custom-elements.json",
            );
            fs.mkdirSync(path.dirname(elementsPath), { recursive: true });
            fs.writeFileSync(elementsPath, "{}\n");

            const byFile = new Map<string, Edit[]>();

            for (const e of edits) {
              const hits = modules.get(e.base) ?? [];
              if (hits.length !== 1) {
                errors.push(
                  `${e.base}.module.css: ${hits.length} matches, skipped .${e.local}`,
                );
                continue;
              }
              byFile.set(hits[0], [...(byFile.get(hits[0]) ?? []), e]);
            }

            for (const [file, list] of byFile) {
              let css = fs.readFileSync(file, "utf8");
              for (const e of list)
                css = patchCss(css, e.local, e.decls, e.media);
              fs.writeFileSync(file, css);
              written.push(
                `${path.relative(server.config.root, file)} (${list.length})`,
              );
            }

            server.config.logger.info(
              `\n  ✎ layout saved → ${written.join(", ") || "nothing"}`,
            );
            reply(200, { ok: errors.length === 0, written, errors });
          } catch (err) {
            reply(500, { ok: false, errors: [String(err)] });
          }
        });
      });
    },
  };
}


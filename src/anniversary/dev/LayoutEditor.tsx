/**
 * Anniversary Layout Studio — dev-only drag-to-place editor.
 *
 * Rendered when the anniversary page is loaded with `?edit` in the URL.
 * The real `/anniversary` page renders inside a scaled iframe so every asset,
 * font, and CSS rule is *exactly* as it will appear in production.
 *
 * Changes are persisted directly into `S1Anniversary.tsx` and its CSS module
 * via the Vite dev-server endpoint registered by vite-plugin-layout-save.ts.
 */
import "./layout-editor.css";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Doodle, { type DoodleName } from "../components/Doodle";
import { DOODLES } from "../lib/doodles";

// ─── Types mirroring vite-plugin-layout-save.ts ────────────────────────────

interface Edit {
  base: string;
  local: string;
  media?: string | null;
  decls: Record<string, string>;
}

interface CustomItem {
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
  position?: { left?: string; top?: string; rotate?: string; scale?: string };
}

interface DeletedItem {
  base: string;
  local: string;
  id?: string;
}

interface TextUpdate {
  base: string;
  local: string;
  text: string;
}

// ─── Editor-internal types ──────────────────────────────────────────────────

type Tab = "inspector" | "layers" | "library" | "shortcuts";
type LibTab = "doodles" | "elements" | "text";

interface Selection {
  base: string;
  local: string;
  el: HTMLElement;
}

interface PendingEdit {
  base: string;
  local: string;
  media: string;
  decls: Record<string, string>;
  textContent?: string;
}

type DragKind =
  | "move"
  | "resize-nw"
  | "resize-ne"
  | "resize-se"
  | "resize-sw"
  | "resize-n"
  | "resize-s"
  | "resize-e"
  | "resize-w"
  | "rotate";

interface DragState {
  kind: DragKind;
  pointerId: number;
  startX: number;
  startY: number;
  startLeftPct: number;
  startTopPct: number;
  startW: number;
  startH: number;
  startRotation: number;
  centerX: number;   // parent-frame viewport px (for rotation pivot)
  centerY: number;
  containerW: number;
  containerH: number;
  zoom: number;
  selection: Selection;
}

interface LayerEntry {
  el: HTMLElement;
  base: string;
  local: string;
}

interface SvgAsset {
  id: string;
  filename: string;
  url: string;
  label: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
const CMD_KEY = isMac ? "⌘" : "Ctrl";

export type EditorShortcut = {
  id: string;
  category: string;
  keys: string[];
  action: string;
  description: string;
};

export const SHORTCUTS: EditorShortcut[] = [
  { id: "select", category: "Selection", keys: ["Click"], action: "Select", description: "Select an element on the canvas" },
  { id: "deselect", category: "Selection", keys: ["Esc"], action: "Deselect", description: "Clear the current selection" },
  { id: "move", category: "Movement", keys: ["↑ ↓ ← →"], action: "Move (1%)", description: "Move the selected item" },
  { id: "move-fast", category: "Movement", keys: ["⇧", "+", "Arrows"], action: "Move fast (5%)", description: "Move the selected item by a larger distance" },
  { id: "rotate-q", category: "Movement", keys: ["Q"], action: "Rotate Right (1°)", description: "Rotate the selected item clockwise" },
  { id: "rotate-e", category: "Movement", keys: ["E"], action: "Rotate Left (1°)", description: "Rotate the selected item counter-clockwise" },
  { id: "rotate-fast", category: "Movement", keys: ["⇧", "+", "Q / E"], action: "Fast Rotate (15°)", description: "Rotate the selected item by a larger angle" },
  { id: "delete", category: "Object Editing", keys: ["Del", "/", "Backspace"], action: "Delete", description: "Remove the selected item" },
  { id: "duplicate", category: "Object Editing", keys: [CMD_KEY, "D"], action: "Duplicate", description: "Create another copy of the selected item" },
  { id: "lock", category: "Object Editing", keys: [CMD_KEY, "L"], action: "Lock/Unlock", description: "Protect an item from accidental changes" },
  { id: "rotate-snap", category: "Object Editing", keys: ["⇧", "+", "drag rotate"], action: "Rotate Snap", description: "Rotate the selected item in 15° increments" },
  { id: "resize-free", category: "Object Editing", keys: ["⇧", "+", "drag corner"], action: "Free Resize", description: "Resize the selected item without locking aspect ratio" },
  { id: "undo", category: "History", keys: [CMD_KEY, "Z"], action: "Undo", description: "Undo your last change" },
  { id: "redo", category: "History", keys: [CMD_KEY, "⇧", "Z"], action: "Redo", description: "Redo the change you just undid" },
  { id: "save", category: "Save", keys: [CMD_KEY, "S"], action: "Save", description: "Save the layout to source files" },
];

const SECTION_BASE = "S1Anniversary";

const DEVICES = [
  { label: 'MacBook Air 13" — 1512×817', w: 1512, h: 817 },
  { label: 'MacBook Pro 14" — 1512×982', w: 1512, h: 982 },
  { label: 'iPad Pro 11" — 834×1194', w: 834, h: 1194 },
  { label: 'iPhone 14 Pro — 390×844', w: 390, h: 844 },
] as const;

const SCENES = [
  { id: "S1Anniversary", label: "Scene 1 — Hero" },
  { id: "S2NightWeMet", label: "Scene 2 — Night We Met" },
  { id: "S3Timeline", label: "Scene 3 — Timeline" },
  { id: "S4Memories", label: "Scene 4 — Memories" },
  { id: "S5Reasons", label: "Scene 5 — Reasons" },
  { id: "S6Letter", label: "Scene 6 — Letter" },
  { id: "S7Future", label: "Scene 7 — Future" },
] as const;

const PALETTE = [
  "#a6141e", "#c2182a", "#f9b7bb", "#ffd700",
  "#8a672f", "#2f5a32", "#3b82f6", "#6b7280",
  "#111827", "#f7efe1",
];

const NUDGE = 1;     // % per arrow key
const NUDGE_BIG = 5; // % per shift+arrow

// ─── SVG asset glob ─────────────────────────────────────────────────────────

const _svgGlob = import.meta.glob("../elements/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const SVG_ASSETS: SvgAsset[] = Object.entries(_svgGlob).map(([path, url]) => {
  const filename = path.split("/").pop()!;
  const id = filename.replace(/\.svg$/, "");
  const label = id
    .replace(/_exact$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { id, filename, url, label };
});

const DOODLE_NAMES = Object.keys(DOODLES) as DoodleName[];

// ─── Pure helpers ────────────────────────────────────────────────────────────

/**
 * Dev-mode scoped class names are `Base__local__hash4`.
 * Returns null for infrastructure classes (section, bg) and unrecognised names.
 */
function parseScopedClass(cls: string): { base: string; local: string } | null {
  const m = cls.match(/^([A-Za-z][A-Za-z0-9]*)__([A-Za-z0-9_]+)__[a-z0-9]{1,8}$/);
  if (!m) return null;
  const local = m[2];
  if (local === "section" || local === "bg" || local === "page") return null;
  return { base: m[1], local };
}

/**
 * Walk up from `el` to find the first element in the iframe DOM that carries
 * an editable scoped class name.
 *
 * NOTE: Chrome/Chromium returns `position: static` for SVG elements via
 * getComputedStyle even when the CSS rule sets `position: absolute`. We work
 * around this by also accepting any element that has the `data-doodle` attribute
 * (all <Doodle> components render as <svg data-doodle="true">).
 */
function findEditable(
  el: Element,
  doc: Document,
): { el: HTMLElement; base: string; local: string } | null {
  let node: Element | null = el;
  const win = doc.defaultView;
  while (node && node !== doc.body) {
    for (const cls of Array.from(node.classList)) {
      const p = parseScopedClass(cls);
      if (p) {
        // SVG doodles: Chrome always reports position=static for SVG elements,
        // so we bypass the position check and accept them by their data attribute.
        const isDoodle = node.hasAttribute("data-doodle");
        if (isDoodle) {
          return { el: node as HTMLElement, ...p };
        }
        // For HTML elements, only select the absolutely positioned layout wrappers.
        // This prevents selecting inner elements like <img> or relative containers.
        if (win) {
          const cs = win.getComputedStyle(node);
          if (cs.position === "absolute") {
            return { el: node as HTMLElement, ...p };
          }
        } else {
          return { el: node as HTMLElement, ...p };
        }
      }
    }
    node = node.parentElement;
  }
  return null;
}

/** Read element rotation in degrees from the iframe window's computed style. */
function readRotation(el: HTMLElement, win: Window): number {
  const cs = win.getComputedStyle(el);
  const r = cs.rotate;
  if (r && r !== "none") {
    if (r.endsWith("deg")) return parseFloat(r);
    if (r.endsWith("rad")) return (parseFloat(r) * 180) / Math.PI;
    if (r.endsWith("turn")) return parseFloat(r) * 360;
  }
  const t = cs.transform;
  if (t && t !== "none") {
    const m = new DOMMatrix(t);
    return Math.atan2(m.b, m.a) * (180 / Math.PI);
  }
  return 0;
}

/**
 * Read the element's current center position as percentages of its offset parent.
 * Works with the `left / top + translate: -50% -50%` pattern used by the CSS module.
 */
function readCenterPct(
  el: HTMLElement,
  win: Window,
): { left: number; top: number } {
  // SVGs often have null offsetParent; fallback to closest section or parent
  let parent = el.offsetParent as HTMLElement | null;
  if (!parent && el.parentElement) {
    parent = el.closest("section") || (el.parentElement as HTMLElement);
  }
  if (!parent) return { left: 50, top: 50 };

  const cs = win.getComputedStyle(el);
  const pxL = parseFloat(cs.left);
  const pxT = parseFloat(cs.top);

  // Since all editable items use `translate: -50% -50%`, the `left` and `top`
  // CSS properties already point to the exact center of the element.
  if (!isNaN(pxL) && !isNaN(pxT)) {
    return {
      left: (pxL / parent.offsetWidth) * 100,
      top: (pxT / parent.offsetHeight) * 100,
    };
  }

  // Fallback for 'auto'
  const elRect = el.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const cx = elRect.left - parentRect.left + elRect.width / 2;
  const cy = elRect.top - parentRect.top + elRect.height / 2;
  return {
    left: (cx / parent.offsetWidth) * 100,
    top: (cy / parent.offsetHeight) * 100,
  };
}

function fmtPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

/**
 * Get the unrotated dimensions of an element, even if it has a CSS transform.
 * Fallbacks handle both HTML elements and SVGs correctly.
 */
function getUnrotatedSize(el: Element, win: Window): { width: number; height: number } {
  // 1. If HTML element, offsetWidth/Height is reliable
  if (el instanceof (win as any).HTMLElement && (el as HTMLElement).offsetWidth > 0) {
    return { width: (el as HTMLElement).offsetWidth, height: (el as HTMLElement).offsetHeight };
  }
  
  // 2. If SVG, prioritize inline style or explicit attributes
  if (el instanceof (win as any).SVGElement) {
    const sw = parseFloat((el as SVGElement).style.width);
    const sh = parseFloat((el as SVGElement).style.height);
    if (!isNaN(sw) && !isNaN(sh) && sw > 0 && sh > 0) return { width: sw, height: sh };
    
    const aw = parseFloat(el.getAttribute("width") || "");
    const ah = parseFloat(el.getAttribute("height") || "");
    if (!isNaN(aw) && !isNaN(ah) && aw > 0 && ah > 0) return { width: aw, height: ah };
  }

  // 3. Try getComputedStyle (works for inline styles and CSS rules)
  const cs = win.getComputedStyle(el);
  const cw = parseFloat(cs.width);
  const ch = parseFloat(cs.height);
  if (!isNaN(cw) && !isNaN(ch) && cw > 0 && ch > 0) return { width: cw, height: ch };
  
  // 4. Try clientWidth/clientHeight (unrotated)
  if (el.clientWidth > 0 && el.clientHeight > 0) {
    return { width: el.clientWidth, height: el.clientHeight };
  }

  // 5. Fallback to bounding client rect (will be distorted if rotated)
  const r = el.getBoundingClientRect();
  return { width: r.width, height: r.height };
}
function fmtDeg(n: number): string {
  return `${n.toFixed(1)}deg`;
}
function uid8(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

// ─── SelectionBox sub-component ─────────────────────────────────────────────

interface SelectionBoxProps {
  boxRef: React.RefObject<HTMLDivElement | null>;
  rotation: number;
  locked: boolean;
  onMoveDown: (e: React.PointerEvent) => void;
  onResizeDown: (kind: DragKind) => (e: React.PointerEvent) => void;
  onRotateDown: (e: React.PointerEvent) => void;
  isEditingText?: boolean;
  textValue?: string;
  onTextChange?: (val: string) => void;
  onStopEditing?: () => void;
}

function SelectionBox({
  boxRef,
  rotation,
  locked,
  onMoveDown,
  onResizeDown,
  onRotateDown,
  isEditingText,
  textValue,
  onTextChange,
  onStopEditing,
}: SelectionBoxProps) {
  useEffect(() => {
    if (isEditingText) {
      const ta = boxRef.current?.querySelector("textarea");
      if (ta) {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
      }
    }
  }, [isEditingText, boxRef]);

  return (
    <div
      ref={boxRef}
      className={`amBox${locked ? " amBoxLocked" : ""}${isEditingText ? " amBoxEditingText" : ""}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="amBodyMove" onPointerDown={locked ? undefined : onMoveDown} />

      {isEditingText && (
        <textarea
          className="amInlineTextEditor"
          value={textValue || ""}
          onChange={(e) => onTextChange?.(e.target.value)}
          onBlur={onStopEditing}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            background: "transparent", border: "none", color: "transparent",
            caretColor: "#fff", resize: "none", overflow: "hidden",
            zIndex: 30, padding: 0, margin: 0, outline: "none",
          }}
        />
      )}

      {!locked && !isEditingText && (
        <>
          {/* Corner handles */}
          <div className="amHandle amHandleCorner amHandleNW" onPointerDown={onResizeDown("resize-nw")} />
          <div className="amHandle amHandleCorner amHandleNE" onPointerDown={onResizeDown("resize-ne")} />
          <div className="amHandle amHandleCorner amHandleSE" onPointerDown={onResizeDown("resize-se")} />
          <div className="amHandle amHandleCorner amHandleSW" onPointerDown={onResizeDown("resize-sw")} />

          {/* Edge handles */}
          <div className="amHandle amHandleEdgeH amHandleN" onPointerDown={onResizeDown("resize-n")} />
          <div className="amHandle amHandleEdgeH amHandleS" onPointerDown={onResizeDown("resize-s")} />
          <div className="amHandle amHandleEdgeV amHandleE" onPointerDown={onResizeDown("resize-e")} />
          <div className="amHandle amHandleEdgeV amHandleW" onPointerDown={onResizeDown("resize-w")} />

          {/* Rotation stem + handle */}
          <div className="amRotateStem" />
          <div className="amHandleRotate" onPointerDown={onRotateDown} />
        </>
      )}

      {/* Dimension badge rendered below the box */}
      {!isEditingText && <div className="amDimensionBadge" id="am-dim-badge" />}
    </div>
  );
}

// ─── Shortcuts modal ─────────────────────────────────────────────────────────

function ShortcutsModal({ onClose }: { onClose: () => void }) {
  const categories = Array.from(new Set(SHORTCUTS.map(s => s.category)));

  return (
    <div
      className="amModalOverlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="amModalContent" style={{ maxWidth: 600 }}>
        <div className="amModalHeader">
          <h2 className="amModalTitle">⌨️ Keyboard Shortcuts</h2>
          <button className="amModalClose" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="amShortcutTable" style={{ display: "flex", flexDirection: "column", gap: 24, maxHeight: "60vh", overflowY: "auto", paddingRight: 8 }}>
          {categories.map(cat => (
            <div key={cat}>
              <h4 style={{ margin: "0 0 12px", color: "#8b949e", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SHORTCUTS.filter(s => s.category === cat).map((s) => (
                  <div className="amShortcutRow" key={s.id}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className="amShortcutDesc" style={{ fontWeight: 500, color: "#fff" }}>{s.action}</span>
                      <span style={{ fontSize: 13, color: "#8b949e" }}>{s.description}</span>
                    </div>
                    <span className="amKeyCombo">
                      {s.keys.map((k, j) => (
                        <kbd key={j} style={k === "+" || k === "/" ? { background: "transparent", border: "none", boxShadow: "none", color: "#8b949e", padding: "0 2px" } : {}}>{k}</kbd>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main LayoutEditor component ─────────────────────────────────────────────

export default function LayoutEditor() {
  // ── UI state ──────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>("inspector");
  const [libTab, setLibTab] = useState<LibTab>("doodles");
  const [deviceIdx, setDeviceIdx] = useState(0);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // ── Canvas state ──────────────────────────────────────────────────────────
  const [iframeReady, setIframeReady] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [selRotation, setSelRotation] = useState(0);
  const [layers, setLayers] = useState<LayerEntry[]>([]);
  const [editingTextLocal, setEditingTextLocal] = useState<string | null>(null);

  // ── Edit state ────────────────────────────────────────────────────────────
  const [pendingEdits, setPendingEdits] = useState<Map<string, PendingEdit>>(
    () => new Map(),
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; err: boolean } | null>(null);

  // ── Library state ─────────────────────────────────────────────────────────
  const [searchQ, setSearchQ] = useState("");
  const [doodleColor, setDoodleColor] = useState(PALETTE[0]);
  const [doodleSize, setDoodleSize] = useState(48);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);    // inner div with transform:scale
  const boxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSelectRef = useRef<string | null>(null); // local name to auto-select after HMR
  const undoStack = useRef<Map<string, PendingEdit>[]>([]);
  const redoStack = useRef<Map<string, PendingEdit>[]>([]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const device = DEVICES[deviceIdx];
  const scene = SCENES[sceneIdx];

  /** Safe accessor — returns null if the iframe hasn't loaded yet. */
  const iframeEnv = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument || !iframe?.contentWindow) return null;
    return { iframe, doc: iframe.contentDocument, win: iframe.contentWindow };
  }, []);

  /** Zoom factor so the iframe fits in the available canvas area. */
  const zoom = useMemo(() => {
    const availW = window.innerWidth - 460 - 48;  // sidebar + padding
    const availH = window.innerHeight - 48;
    return Math.min(availW / device.w, availH / device.h, 1);
  }, [device]);

  const mediaRef = useRef(device.w <= 767 ? "(max-width: 767px)" : "(min-width: 768px)");
  useEffect(() => {
    mediaRef.current = DEVICES[deviceIdx].w <= 767 ? "(max-width: 767px)" : "(min-width: 768px)";
    
    // Refresh inline styles for the new device
    const env = iframeEnv();
    if (env) {
      env.doc.querySelectorAll<HTMLElement>('[class*="__"]').forEach((el) => {
        el.style.removeProperty("left");
        el.style.removeProperty("top");
        el.style.removeProperty("rotate");
        el.style.removeProperty("width");
        el.style.removeProperty("height");
        el.style.removeProperty("color");
        el.style.removeProperty("font-weight");
        el.style.removeProperty("font-size");
      });
      pendingEdits.forEach((edit) => {
        if (edit.media === mediaRef.current) {
          const hit = Array.from(env.doc.querySelectorAll<HTMLElement>(`[class*="__${edit.local}__"]`)).find((el) =>
            Array.from(el.classList).some((c) => {
              const p = parseScopedClass(c);
              return p && p.local === edit.local && p.base === edit.base;
            })
          );
          if (hit) {
            for (const [prop, val] of Object.entries(edit.decls)) {
              hit.style.setProperty(prop, val);
            }
          }
        }
      });
    }
  }, [deviceIdx, iframeEnv, pendingEdits]);

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const showToast = useCallback((msg: string, err = false) => {
    setToast({ msg, err });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  }, []);



  /**
   * Convert an element's iframe-viewport rect → parent-frame fixed (viewport) coords.
   *
   * `el.getBoundingClientRect()` called on a same-origin iframe element from the
   * parent frame returns coordinates relative to the **iframe's own viewport** — i.e.
   * unscaled, as if the iframe were full-size.  To get parent-frame fixed coords we:
   *   1. Get the iframe's own visual position via `iframeRef.getBoundingClientRect()`
   *      (this correctly accounts for zoom / transform on the wrapper).
   *   2. Multiply the iframe-local coords by `zoom` (CSS scale factor) and add the
   *      iframe's page offset.
   */
  const elRectToFixed = useCallback(
    (elRect: DOMRect): { left: number; top: number; width: number; height: number } => {
      const iframe = iframeRef.current;
      if (!iframe) return { left: 0, top: 0, width: 0, height: 0 };
      const iframeRect = iframe.getBoundingClientRect();
      return {
        left:   iframeRect.left + elRect.left * zoom,
        top:    iframeRect.top  + elRect.top  * zoom,
        width:  elRect.width  * zoom,
        height: elRect.height * zoom,
      };
    },
    [zoom],
  );

  /** Apply CSS declarations to an iframe element's inline style (live preview). */
  const applyInline = useCallback(
    (sel: Selection, decls: Record<string, string>) => {
      const env = iframeEnv();
      if (!env) return;
      const hit = Array.from(
        env.doc.querySelectorAll<HTMLElement>(`[class*="__${sel.local}__"]`),
      ).find((el) =>
        Array.from(el.classList).some((c) => {
          const p = parseScopedClass(c);
          return p && p.local === sel.local && p.base === sel.base;
        }),
      );
      if (!hit) return;
      for (const [prop, val] of Object.entries(decls)) {
        hit.style.setProperty(prop, val);
      }
    },
    [iframeEnv],
  );

  // ─── Undo / Redo ──────────────────────────────────────────────────────────

  const pushUndo = useCallback((snapshot: Map<string, PendingEdit>) => {
    undoStack.current = [...undoStack.current.slice(-19), new Map(snapshot)];
    redoStack.current = [];
  }, []);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current[undoStack.current.length - 1];
    undoStack.current = undoStack.current.slice(0, -1);
    redoStack.current = [new Map(pendingEdits), ...redoStack.current.slice(0, 19)];
    setPendingEdits(new Map(prev));
  }, [pendingEdits]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current[0];
    redoStack.current = redoStack.current.slice(1);
    undoStack.current = [...undoStack.current.slice(-19), new Map(pendingEdits)];
    setPendingEdits(new Map(next));
  }, [pendingEdits]);

  // ─── Save to disk ─────────────────────────────────────────────────────────

  const persistToServer = useCallback(
    async (
      edits: Edit[] = [],
      customElements: CustomItem[] = [],
      deletedElements: DeletedItem[] = [],
      textUpdates: TextUpdate[] = [],
    ): Promise<boolean> => {
      try {
        const res = await fetch("/__am/save-layout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ edits, customElements, deletedElements, textUpdates }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          written: string[];
          errors: string[];
        };
        if (!data.ok) {
          showToast(`Save failed: ${data.errors.join(", ")}`, true);
          return false;
        }
        return true;
      } catch (e) {
        showToast(`Network error: ${String(e)}`, true);
        return false;
      }
    },
    [showToast],
  );

  /** Flush all pending CSS edits to disk on explicit Save. */
  const handleSave = useCallback(async () => {
    if (saving || pendingEdits.size === 0) return;
    setSaving(true);
    const edits: Edit[] = Array.from(pendingEdits.values()).map((e) => ({
      base: e.base,
      local: e.local,
      media: e.media,
      decls: e.decls,
    }));
    const textUpdates: TextUpdate[] = Array.from(pendingEdits.values())
      .filter(e => e.textContent !== undefined)
      .map((e) => ({
        base: e.base,
        local: e.local,
        text: e.textContent!,
      }));
      
    const ok = await persistToServer(edits, [], [], textUpdates);
    setSaving(false);
    if (ok) {
      showToast(`✓ Saved ${edits.length} edit${edits.length !== 1 ? "s" : ""}`);
      setPendingEdits(new Map());
      undoStack.current = [];
      redoStack.current = [];
    }
  }, [saving, pendingEdits, persistToServer, showToast]);

  // ─── Add elements from library ────────────────────────────────────────────

  const addDoodle = useCallback(
    async (name: DoodleName) => {
      const uuid = crypto.randomUUID();
      const local = `custom_${name.replace(/[^a-zA-Z0-9]/g, "_")}_${uid8()}`;
      const item: CustomItem = {
        id: uuid,
        base: SECTION_BASE,
        local,
        type: "doodle",
        doodleName: name,
        size: doodleSize,
        color: doodleColor,
        position: { left: "50%", top: "50%" },
      };
      setSaving(true);
      const ok = await persistToServer([], [item], []);
      setSaving(false);
      if (ok) {
        showToast(`✚ Added ${name}`);
        autoSelectRef.current = local;
        setTab("inspector");
      }
    },
    [doodleColor, doodleSize, persistToServer, showToast],
  );

  const addSvg = useCallback(
    async (asset: SvgAsset) => {
      const uuid = crypto.randomUUID();
      const local = `custom_${asset.id.replace(/[^a-zA-Z0-9]/g, "_")}_${uid8()}`;
      const item: CustomItem = {
        id: uuid,
        base: SECTION_BASE,
        local,
        type: "svg-element",
        svgSrc: asset.filename,
        size: 120,
        position: { left: "50%", top: "50%" },
      };
      setSaving(true);
      const ok = await persistToServer([], [item], []);
      setSaving(false);
      if (ok) {
        showToast(`✚ Added ${asset.label}`);
        autoSelectRef.current = local;
        setTab("inspector");
      }
    },
    [persistToServer, showToast],
  );

  const addText = useCallback(
    async () => {
      const uuid = crypto.randomUUID();
      const local = `custom_text_${uid8()}`;
      const item: CustomItem = {
        id: uuid,
        base: SECTION_BASE,
        local,
        type: "text",
        text: "New Text",
        fontSize: 24,
        bold: false,
        position: { left: "50%", top: "50%" },
      };
      setSaving(true);
      const ok = await persistToServer([], [item], []);
      setSaving(false);
      if (ok) {
        showToast(`✚ Added Text`);
        autoSelectRef.current = local;
        setTab("inspector");
        
        // Auto-enter edit mode after a short delay for mount
        setTimeout(() => setEditingTextLocal(local), 500);
      }
    },
    [persistToServer, showToast],
  );

  // ─── Delete / Duplicate ───────────────────────────────────────────────────

  const deleteSelected = useCallback(async (target?: { base: string; local: string; el: HTMLElement }) => {
    const s = target ?? selection;
    if (!s) return;
    const ok = await persistToServer([], [], [
      { base: s.base, local: s.local },
    ]);
    if (ok) {
      showToast(`🗑 Deleted .${s.local}`);
      if (selection?.local === s.local) {
        setSelection(null);
      }
    }
  }, [selection, persistToServer, showToast]);

  const duplicateSelected = useCallback(async (target?: { base: string; local: string; el: HTMLElement }) => {
    const s = target ?? selection;
    if (!s) return;
    const env = iframeEnv();
    if (!env) return;

    const pos = readCenterPct(s.el, env.win);
    const rotation = readRotation(s.el, env.win);
    const doodleEl = s.el.querySelector<Element>("[data-doodle-name]");
    const imgEl = s.el.querySelector<HTMLImageElement>("img");
    const uuid = crypto.randomUUID();
    const newLocal = `custom_${s.local.split("_").slice(1, -1).join("_") || s.local}_${uid8()}`;

    let item: CustomItem | null = null;

    if (doodleEl) {
      const name = doodleEl.getAttribute("data-doodle-name") ?? "heart-solid";
      item = {
        id: uuid,
        base: s.base,
        local: newLocal,
        type: "doodle",
        doodleName: name,
        size: doodleSize,
        color: doodleColor,
        position: {
          left: fmtPct(pos.left + 4),
          top: fmtPct(pos.top + 4),
          rotate: fmtDeg(rotation),
        },
      };
    } else if (imgEl) {
      const filename = (imgEl.src ?? "").split("/").pop()?.split("?")[0] ?? "";
      item = {
        id: uuid,
        base: s.base,
        local: newLocal,
        type: "svg-element",
        svgSrc: filename,
        size: 120,
        position: {
          left: fmtPct(pos.left + 4),
          top: fmtPct(pos.top + 4),
          rotate: fmtDeg(rotation),
        },
      };
    }

    if (!item) { showToast("Cannot duplicate this element type", true); return; }
    const ok = await persistToServer([], [item], []);
    if (ok) {
      showToast(`⧉ Duplicated .${s.local}`);
      autoSelectRef.current = newLocal;
    }
  }, [selection, iframeEnv, doodleSize, doodleColor, persistToServer, showToast]);

  // ─── Lock ─────────────────────────────────────────────────────────────────

  const getIsLocked = useCallback(
    (base: string, local: string, el: HTMLElement) => {
      const key = `${base}:${local}:${mediaRef.current}`;
      const prevDecls = pendingEdits.get(key)?.decls ?? {};
      const win = el.ownerDocument.defaultView;
      const computedLocked = win ? win.getComputedStyle(el).getPropertyValue("--am-locked").trim() === "1" : false;
      const pendingLocked = prevDecls["--am-locked"];
      return pendingLocked !== undefined ? pendingLocked === "1" : computedLocked;
    },
    [pendingEdits]
  );

  const toggleLock = useCallback((target?: { base: string; local: string; el: HTMLElement }) => {
    const s = target ?? selection;
    if (!s) return;
    const env = iframeEnv();
    if (!env) return;
    const key = `${s.base}:${s.local}:${mediaRef.current}`;
    const prevDecls = pendingEdits.get(key)?.decls ?? {};
    const isLocked = getIsLocked(s.base, s.local, s.el);
    
    const newDecls = { ...prevDecls, "--am-locked": isLocked ? "0" : "1" };
    
    pushUndo(pendingEdits);
    applyInline(s, { "--am-locked": isLocked ? "0" : "1" });
    setPendingEdits((m) => {
      const n = new Map(m);
      n.set(key, { media: mediaRef.current, base: s.base, local: s.local, decls: newDecls });
      return n;
    });
  }, [selection, iframeEnv, pendingEdits, applyInline, pushUndo, getIsLocked]);

  // ─── Nudge ────────────────────────────────────────────────────────────────

  const nudgeSelected = useCallback(
    (dx: number, dy: number) => {
      if (!selection) return;
      if (getIsLocked(selection.base, selection.local, selection.el)) return;
      const env = iframeEnv();
      if (!env) return;
      const pos = readCenterPct(selection.el, env.win);
      const key = `${selection.base}:${selection.local}:${mediaRef.current}`;
      const prev = pendingEdits.get(key);
      const newLeft = pos.left + dx;
      const newTop  = pos.top  + dy;
      const decls: Record<string, string> = {
        ...(prev?.decls ?? {}),
        left: fmtPct(newLeft),
        top:  fmtPct(newTop),
      };
      applyInline(selection, { left: fmtPct(newLeft), top: fmtPct(newTop) });
      setPendingEdits((m) => {
        const n = new Map(m);
        n.set(key, { media: mediaRef.current, base: selection.base, local: selection.local, decls });
        return n;
      });
    },
    [selection, iframeEnv, pendingEdits, applyInline],
  );

  const rotateSelected = useCallback(
    (delta: number) => {
      if (!selection) return;
      if (getIsLocked(selection.base, selection.local, selection.el)) return;
      const env = iframeEnv();
      if (!env) return;
      
      const currentRotation = readRotation(selection.el, env.win);
      const newRotation = currentRotation + delta;
      
      const key = `${selection.base}:${selection.local}:${mediaRef.current}`;
      const prev = pendingEdits.get(key);
      const decls: Record<string, string> = {
        ...(prev?.decls ?? {}),
        rotate: fmtDeg(newRotation),
      };
      applyInline(selection, { rotate: fmtDeg(newRotation) });
      setSelRotation(newRotation);
      setPendingEdits((m) => {
        const n = new Map(m);
        n.set(key, { media: mediaRef.current, base: selection.base, local: selection.local, decls });
        return n;
      });
    },
    [selection, iframeEnv, pendingEdits, applyInline, getIsLocked],
  );

  // ─── Drag / resize / rotate ───────────────────────────────────────────────

  const startInteraction = useCallback(
    (e: React.PointerEvent, kind: DragKind) => {
      if (!selection) return;
      if (getIsLocked(selection.base, selection.local, selection.el)) return;
      const env = iframeEnv();
      if (!env) return;

      const iframeRect = env.iframe.getBoundingClientRect();
      const pos = readCenterPct(selection.el, env.win);
      const rotation = readRotation(selection.el, env.win);
      const elRect = selection.el.getBoundingClientRect(); // iframe-viewport coords

      // Center in parent frame viewport coordinates
      const centerX = iframeRect.left + (elRect.left + elRect.width  / 2) * zoom;
      const centerY = iframeRect.top  + (elRect.top  + elRect.height / 2) * zoom;

      const parent = selection.el.offsetParent as HTMLElement | null;
      const containerW = parent?.offsetWidth  ?? env.doc.documentElement.offsetWidth;
      const containerH = parent?.offsetHeight ?? env.doc.documentElement.offsetHeight;

      pushUndo(pendingEdits);

      dragRef.current = {
        kind,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startLeftPct: pos.left,
        startTopPct:  pos.top,
        startW: getUnrotatedSize(selection.el, env.win).width,
        startH: getUnrotatedSize(selection.el, env.win).height,
        startRotation: rotation,
        centerX,
        centerY,
        containerW,
        containerH,
        zoom,
        selection,
      };

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      e.stopPropagation();
    },
    [selection, iframeEnv, zoom, pendingEdits, pushUndo],
  );

  const onMoveDown    = useCallback((e: React.PointerEvent) => startInteraction(e, "move"), [startInteraction]);
  const onResizeDown  = useCallback((kind: DragKind) => (e: React.PointerEvent) => startInteraction(e, kind), [startInteraction]);
  const onRotateDown  = useCallback((e: React.PointerEvent) => startInteraction(e, "rotate"), [startInteraction]);

  // ─── Global pointer events ────────────────────────────────────────────────

  useEffect(() => {
    const RESIZE_SIGNS: Partial<Record<DragKind, { dw: number; dh: number }>> = {
      "resize-nw": { dw: -1, dh: -1 },
      "resize-ne": { dw:  1, dh: -1 },
      "resize-se": { dw:  1, dh:  1 },
      "resize-sw": { dw: -1, dh:  1 },
      "resize-n":  { dw:  0, dh: -1 },
      "resize-s":  { dw:  0, dh:  1 },
      "resize-e":  { dw:  1, dh:  0 },
      "resize-w":  { dw: -1, dh:  0 },
    };

    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      const rawDx = (e.clientX - drag.startX) / drag.zoom;
      const rawDy = (e.clientY - drag.startY) / drag.zoom;

      if (drag.kind === "move") {
        const newL = drag.startLeftPct + (rawDx / drag.containerW) * 100;
        const newT = drag.startTopPct  + (rawDy / drag.containerH) * 100;
        applyInline(drag.selection, { left: fmtPct(newL), top: fmtPct(newT) });

        // Update badge
        const badge = document.getElementById("am-dim-badge");
        if (badge) badge.textContent = `${newL.toFixed(1)}% × ${newT.toFixed(1)}%`;

      } else if (drag.kind === "rotate") {
        const ddx = e.clientX - drag.centerX;
        const ddy = e.clientY - drag.centerY;
        const angle = Math.atan2(ddy, ddx) * (180 / Math.PI) + 90;
        const snapped = e.shiftKey ? Math.round(angle / 15) * 15 : angle;
        setSelRotation(snapped);
        applyInline(drag.selection, { rotate: fmtDeg(snapped) });

        const badge = document.getElementById("am-dim-badge");
        if (badge) badge.textContent = `${snapped.toFixed(0)}°`;

      } else {
        const sign = RESIZE_SIGNS[drag.kind];
        if (!sign) return;
        const newW = Math.max(16, drag.startW + rawDx * sign.dw);
        const newH = e.shiftKey || sign.dw === 0 || sign.dh === 0
          ? Math.max(16, drag.startH + rawDy * sign.dh)
          : (drag.startH / drag.startW) * newW;  // keep aspect ratio
        applyInline(drag.selection, { width: `${newW}px`, height: `${newH}px` });

        const badge = document.getElementById("am-dim-badge");
        if (badge) badge.textContent = `${Math.round(newW)} × ${Math.round(newH)}`;
      }
    };

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      dragRef.current = null;

      const key = `${drag.selection.base}:${drag.selection.local}:${mediaRef.current}`;
      const prevDecls = pendingEdits.get(key)?.decls ?? {};

      let newDecls: Record<string, string> = { ...prevDecls };

      const rawDx = (e.clientX - drag.startX) / drag.zoom;
      const rawDy = (e.clientY - drag.startY) / drag.zoom;

      if (drag.kind === "move") {
        newDecls.left = fmtPct(drag.startLeftPct + (rawDx / drag.containerW) * 100);
        newDecls.top  = fmtPct(drag.startTopPct  + (rawDy / drag.containerH) * 100);

      } else if (drag.kind === "rotate") {
        const ddx = e.clientX - drag.centerX;
        const ddy = e.clientY - drag.centerY;
        const angle = Math.atan2(ddy, ddx) * (180 / Math.PI) + 90;
        const snapped = e.shiftKey ? Math.round(angle / 15) * 15 : angle;
        newDecls.rotate = fmtDeg(snapped);
        setSelRotation(snapped);

      } else {
        const sign = RESIZE_SIGNS[drag.kind];
        if (sign) {
          const newW = Math.max(16, drag.startW + rawDx * sign.dw);
          const newH = e.shiftKey || sign.dw === 0 || sign.dh === 0
            ? Math.max(16, drag.startH + rawDy * sign.dh)
            : (drag.startH / drag.startW) * newW;
          newDecls.width  = `${newW}px`;
          newDecls.height = `${newH}px`;
        }
      }

      setPendingEdits((m) => {
        const n = new Map(m);
        n.set(key, { media: mediaRef.current,
          base: drag.selection.base,
          local: drag.selection.local,
          decls: newDecls,
        });
        return n;
      });

      const badge = document.getElementById("am-dim-badge");
      if (badge) badge.textContent = "";
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // pendingEdits is read via closure — the handlers capture fresh state via ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyInline, pendingEdits]);

  // ─── RAF: keep selection box aligned with iframe element ──────────────────

  useEffect(() => {
    if (!selection) return;
    let rafId: number;
    const tick = () => {
      const box = boxRef.current;
      if (!box) { rafId = requestAnimationFrame(tick); return; }

      // If the element was removed from the DOM (e.g., HMR remount)
      if (!selection.el.isConnected) {
        setSelection(null);
        return;
      }

      try {
        const r = elRectToFixed(selection.el.getBoundingClientRect());
        // Use the UNROTATED natural size for the box (then rotate the box itself)
        const win = selection.el.ownerDocument.defaultView;
        if (!win) return;
        const size = getUnrotatedSize(selection.el, win);
        const naturalW = size.width  * zoom;
        const naturalH = size.height * zoom;
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;

        box.style.left   = `${cx - naturalW / 2}px`;
        box.style.top    = `${cy - naturalH / 2}px`;
        box.style.width  = `${naturalW}px`;
        box.style.height = `${naturalH}px`;
      } catch {
        // element may be mid-remount
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [selection, elRectToFixed, zoom]);

  // ─── Canvas click: select element in iframe ───────────────────────────────

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (dragRef.current) return; // ignore click that ended a drag
      const env = iframeEnv();
      if (!env) return;

      // iframeRef.getBoundingClientRect() gives the visual (post-scale) rect of the
      // iframe element in the parent page. Subtracting it and dividing by zoom converts
      // parent-page client coords into iframe-native (unscaled) coordinates that
      // elementFromPoint() expects.
      const iframeRect = env.iframe.getBoundingClientRect();
      const ix = (e.clientX - iframeRect.left) / zoom;
      const iy = (e.clientY - iframeRect.top)  / zoom;

      const hit = env.doc.elementFromPoint(ix, iy);
      if (!hit) { setSelection(null); setEditingTextLocal(null); return; }

      const found = findEditable(hit, env.doc);
      if (!found) { setSelection(null); setEditingTextLocal(null); return; }

      setSelection({ base: found.base, local: found.local, el: found.el });
      if (editingTextLocal !== found.local) {
        setEditingTextLocal(null);
      }
      setTab("inspector");
      setSelRotation(readRotation(found.el, env.win));
    },
    [iframeEnv, zoom, editingTextLocal],
  );

  const handleCanvasDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!selection) return;
      const env = iframeEnv();
      if (!env) return;

      const iframeRect = env.iframe.getBoundingClientRect();
      const ix = (e.clientX - iframeRect.left) / zoom;
      const iy = (e.clientY - iframeRect.top)  / zoom;

      const hit = env.doc.elementFromPoint(ix, iy);
      if (!hit) return;

      const found = findEditable(hit, env.doc);
      if (found && found.local === selection.local) {
        const isText = found.el.querySelector('[data-am-text="true"]') !== null;
        if (isText && !getIsLocked(found.base, found.local, found.el)) {
           setEditingTextLocal(found.local);
        }
      }
    },
    [selection, iframeEnv, zoom, getIsLocked]
  );

  // ─── Iframe load ──────────────────────────────────────────────────────────

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      setIframeReady(true);
      setSelection(null);
      // Auto-scroll to the currently active scene
      const doc = iframe.contentDocument;
      if (doc) {
        const el = doc.getElementById(scene.id);
        el?.scrollIntoView({ behavior: "instant" });
      }
    };
    iframe.addEventListener("load", onLoad);
    // ─── Race-condition guard ───────────────────────────────────────────────
    // The iframe `src` is a static JSX attribute, so the browser starts loading
    // it immediately on mount — before this useEffect runs (which is post-paint).
    // On localhost the iframe often completes before the listener is attached,
    // meaning the `load` event fires into the void and `iframeReady` never
    // becomes true. Checking readyState here catches that case.
    if (iframe.contentDocument?.readyState === "complete") {
      onLoad();
    }
    return () => iframe.removeEventListener("load", onLoad);
  }, [scene.id]);

  // ─── Auto-select after HMR injection ─────────────────────────────────────

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let tries = 0;
    const interval = setInterval(() => {
      const local = autoSelectRef.current;
      if (!local) { clearInterval(interval); return; }
      tries++;
      const doc = iframe.contentDocument;
      if (!doc) return;
      // Scoped class name contains the local segment: Base__local__hash
      const candidates = doc.querySelectorAll<HTMLElement>(
        `[class*="__${local}__"]`,
      );
      for (const el of Array.from(candidates)) {
        for (const cls of Array.from(el.classList)) {
          const p = parseScopedClass(cls);
          if (p && p.local === local) {
            autoSelectRef.current = null;
            setSelection({ base: p.base, local: p.local, el });
            setSelRotation(readRotation(el, iframe.contentWindow!));
            clearInterval(interval);
            return;
          }
        }
      }
      if (tries > 30) { autoSelectRef.current = null; clearInterval(interval); }
    }, 200);
    return () => clearInterval(interval);
  }, []);  // intentionally no deps — uses ref

  // ─── Refresh layers list ──────────────────────────────────────────────────

  useEffect(() => {
    if (!iframeReady) return;
    const env = iframeEnv();
    if (!env) return;
    const section = env.doc.getElementById(scene.id);
    if (!section) return;
    const found: LayerEntry[] = [];
    section.querySelectorAll<HTMLElement>("*").forEach((el) => {
      for (const cls of Array.from(el.classList)) {
        const p = parseScopedClass(cls);
        if (p) {
          found.push({ el, ...p });
          break;
        }
      }
    });
    setLayers(found);
  }, [iframeReady, scene.id, selection, iframeEnv]);

  // ─── Scene jump ───────────────────────────────────────────────────────────

  const jumpToScene = useCallback(
    (idx: number) => {
      setSceneIdx(idx);
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const el = doc.getElementById(SCENES[idx].id);
      el?.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement).isContentEditable) return;
      const cmd = e.metaKey || e.ctrlKey;

      if (e.key === "Escape") {
        if (editingTextLocal) {
          setEditingTextLocal(null);
          return;
        }
        setSelection(null);
        setShowShortcuts(false);
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selection) {
        if (getIsLocked(selection.base, selection.local, selection.el)) return;
        e.preventDefault();
        void deleteSelected();
        return;
      }
      if (cmd && e.key === "d" && selection) {
        if (getIsLocked(selection.base, selection.local, selection.el)) return;
        e.preventDefault();
        void duplicateSelected();
        return;
      }
      if (cmd && e.key === "l" && selection) {
        e.preventDefault();
        toggleLock();
        return;
      }
      if (cmd && e.key === "s") {
        e.preventDefault();
        void handleSave();
        return;
      }
      if (cmd && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (cmd && e.shiftKey && e.key === "z") {
        e.preventDefault();
        redo();
        return;
      }
      
      const keyLower = e.key.toLowerCase();
      if ((keyLower === "q" || keyLower === "e") && selection) {
        if (getIsLocked(selection.base, selection.local, selection.el)) return;
        e.preventDefault();
        const step = e.shiftKey ? 15 : 1;
        const delta = keyLower === "q" ? step : -step;
        rotateSelected(delta);
        return;
      }

      // Arrow key nudge
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key) && selection) {
        if (getIsLocked(selection.base, selection.local, selection.el)) return;
        e.preventDefault();
        const step = e.shiftKey ? NUDGE_BIG : NUDGE;
        const dxMap: Record<string, number> = { ArrowLeft: -step, ArrowRight: step, ArrowUp: 0, ArrowDown: 0 };
        const dyMap: Record<string, number> = { ArrowUp: -step, ArrowDown: step, ArrowLeft: 0, ArrowRight: 0 };
        nudgeSelected(dxMap[e.key] ?? 0, dyMap[e.key] ?? 0);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selection, deleteSelected, duplicateSelected, handleSave, undo, redo, nudgeSelected, rotateSelected, toggleLock, getIsLocked]);

  // ─── Auto-save on window blur ─────────────────────────────────────────────

  useEffect(() => {
    const onBlur = () => {
      void handleSave();
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [handleSave]);

  // ─── Computed inspector values ────────────────────────────────────────────

  const inspectorVals = useMemo(() => {
    if (!selection) return null;
    const env = iframeEnv();
    if (!env) return null;
    const pos = readCenterPct(selection.el, env.win);
    const rotation = readRotation(selection.el, env.win);
    const key = `${selection.base}:${selection.local}:${mediaRef.current}`;
    const pending = pendingEdits.get(key);
    const size = getUnrotatedSize(selection.el, env.win);
    const locked = getIsLocked(selection.base, selection.local, selection.el);
    return {
      left:   pending?.decls.left   ?? fmtPct(pos.left),
      top:    pending?.decls.top    ?? fmtPct(pos.top),
      rotate: pending?.decls.rotate ?? fmtDeg(rotation),
      width:  `${size.width}px`,
      height: `${size.height}px`,
      local:  selection.local,
      base:   selection.base,
      locked,
    };
  }, [selection, iframeEnv, pendingEdits, getIsLocked, deviceIdx]);

  // ─── Filtered library lists ───────────────────────────────────────────────

  const filteredDoodles = useMemo(() => {
    if (!searchQ) return DOODLE_NAMES;
    const q = searchQ.toLowerCase();
    return DOODLE_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [searchQ]);

  const filteredSvgs = useMemo(() => {
    if (!searchQ) return SVG_ASSETS;
    const q = searchQ.toLowerCase();
    return SVG_ASSETS.filter(
      (a) => a.label.toLowerCase().includes(q) || a.id.toLowerCase().includes(q),
    );
  }, [searchQ]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="amShell">

      {/* ══ SIDEBAR PANEL ════════════════════════════════════════════════════ */}
      <aside className="amPanel">

        {/* ── Header ── */}
        <header className="amStudioHeader">
          <div className="amBrandGroup">
            <div className="amLogoBadge">♥</div>
            <div className="amBrandText">
              <span className="amBrandTitle">
                LAYOUT STUDIO
                <span className="amLiveDot" />
              </span>
              <span className="amBrandSubtitle">Cherished Visual Engine</span>
            </div>
          </div>
          <div className="amHeaderActions">
            {pendingEdits.size > 0 && (
              <span className="amPendingBadge">{pendingEdits.size} unsaved</span>
            )}
            <button
              className="amHeaderBtn"
              onClick={() => setShowShortcuts(true)}
              title="Keyboard shortcuts"
            >
              ⌨️
            </button>
          </div>
        </header>

        {/* ── Viewport + Scene toolbar ── */}
        <div className="amViewportToolbar">
          <div className="amDeviceRow">
            <div className="amDeviceSelectWrap">
              <select
                className="amSelect"
                value={deviceIdx}
                onChange={(e) => setDeviceIdx(Number(e.target.value))}
              >
                {DEVICES.map((d, i) => (
                  <option key={i} value={i}>{d.label}</option>
                ))}
              </select>
              <span className="amSelectArrow">▾</span>
            </div>
            <span className="amZoomBadge">{Math.round(zoom * 100)}%</span>
          </div>

          <div className="amScreenJumpRow">
            <span className="amScreenJumpLabel">SCENE</span>
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                className={`amJumpBtn${sceneIdx === i ? " amTabActive" : ""}`}
                onClick={() => jumpToScene(i)}
                title={s.label}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab navigation ── */}
        <nav className="amMainTabs">
          {(
            [
              { id: "inspector" as Tab, icon: "🔍", label: "Inspector" },
              { id: "layers"    as Tab, icon: "📋", label: `Layers ${layers.length}` },
              { id: "library"   as Tab, icon: "📚", label: `Library` },
              { id: "shortcuts" as Tab, icon: "⌨️", label: "Guide" },
            ]
          ).map(({ id, icon, label }) => (
            <button
              key={id}
              className={`amMainTab${tab === id ? " amTabActive" : ""}`}
              onClick={() => setTab(id)}
            >
              {icon} {label}
              {tab === id && <span className="amActiveIndicatorDot" />}
            </button>
          ))}
        </nav>

        {/* ── Panel body ── */}
        <div className="amPanelBody">

          {/* ─ Inspector tab ─ */}
          {tab === "inspector" && (
            <>
              {!selection ? (
                <div className="amEmptyState">
                  <div className="amEmptyIcon">🎨</div>
                  <p className="amEmptyTitle">No Element Selected</p>
                  <p className="amEmptyDesc">
                    Click any element on the canvas to select, move, rotate, or
                    resize it. Open the Library tab to add doodles and stickers.
                  </p>
                  <div className="amEmptyActions">
                    <button className="amBtn" onClick={() => setTab("layers")}>
                      📋 View Layers ({layers.length})
                    </button>
                    <button className="amBtn" onClick={() => setTab("library")}>
                      📚 Open Library
                    </button>
                  </div>
                </div>
              ) : (
                <div className="amCard">
                  {/* Identity */}
                  <div className="amCardHeader">
                    <h3 className="amCardTitle">🎯 Selected Element</h3>
                    <span className={`amKindBadge ${selection.local.startsWith("custom_") ? "amCustom" : "amCss"}`}>
                      {selection.local.startsWith("custom_") ? "custom" : "CSS slot"}
                    </span>
                  </div>
                  <div className="amIdentityHeader">
                    <div className="amIdentityInfo">
                      <span className="amIdentityTarget">.{selection.local}</span>
                      <span className="amIdentityScope">{selection.base}.module.css</span>
                    </div>
                  </div>

                  {/* Transform grid */}
                  {inspectorVals && (
                    <>
                      <div className="amTransformGrid">
                        <div className="amMetricCard">
                          <span className="amMetricLabel">Left</span>
                          <span className="amMetricValue amHighlight">{inspectorVals.left}</span>
                        </div>
                        <div className="amMetricCard">
                          <span className="amMetricLabel">Top</span>
                          <span className="amMetricValue amHighlight">{inspectorVals.top}</span>
                        </div>
                        <div className="amMetricCard">
                          <span className="amMetricLabel">Rotate</span>
                          <span className="amMetricValue">{inspectorVals.rotate}</span>
                        </div>
                        <div className="amMetricCard">
                          <span className="amMetricLabel">W</span>
                          <span className="amMetricValue">{inspectorVals.width}</span>
                        </div>
                        <div className="amMetricCard">
                          <span className="amMetricLabel">H</span>
                          <span className="amMetricValue">{inspectorVals.height}</span>
                        </div>
                        <div className="amMetricCard">
                          <span className="amMetricLabel">Pending</span>
                          <span className="amMetricValue">
                            {pendingEdits.has(`${selection.base}:${selection.local}:${mediaRef.current}`) ? "Yes" : "—"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Color & Text Properties */}
                      {(selection.el.getAttribute('data-am-text') === 'true' || selection.el.getAttribute('data-doodle') === 'true') && (
                        <div className="amNudgeSection" style={{ marginTop: 16 }}>
                          <span className="amNudgeTitle">{selection.el.getAttribute('data-am-text') === 'true' ? "Text Options" : "Color Option"}</span>
                          
                          <div className="amSliderRow" style={{ marginTop: 8 }}>
                            <div className="amSliderHeader">
                              <span>Color</span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {[
                                "#c1121f", // red
                                "#ffb5a7", // pink
                                "#ffd166", // yellow
                                "#9c6644", // brown
                                "#386641", // green
                                "#4361ee", // blue
                                "#6c757d", // grey
                                "#14213d", // dark navy
                                "#fdf0d5", // cream
                                "#000000", // black
                                "#ffffff", // white
                              ].map((c) => (
                                <button
                                  key={c}
                                  disabled={inspectorVals.locked}
                                  style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    backgroundColor: c,
                                    border: (pendingEdits.get(`${selection.base}:${selection.local}:${mediaRef.current}`)?.decls["color"] || iframeEnv()?.win.getComputedStyle(selection.el).color) === c || (c === "#000000" && !pendingEdits.get(`${selection.base}:${selection.local}:${mediaRef.current}`)?.decls["color"] && iframeEnv()?.win.getComputedStyle(selection.el).color === "rgb(0, 0, 0)") ? "2px solid #00f0ff" : (c === "#ffffff" ? "1px solid #ddd" : "none"),
                                    cursor: inspectorVals.locked ? "not-allowed" : "pointer",
                                    padding: 0,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                  }}
                                  onClick={() => {
                                    const key = `${selection.base}:${selection.local}:${mediaRef.current}`;
                                    applyInline(selection, { color: c });
                                    setPendingEdits((m) => {
                                      const n = new Map(m);
                                      n.set(key, { media: mediaRef.current, base: selection.base, local: selection.local, decls: { ...(m.get(key)?.decls ?? {}), color: c }, textContent: m.get(key)?.textContent });
                                      return n;
                                    });
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          {selection.el.getAttribute('data-am-text') === 'true' && (
                            <>
                              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                <textarea
                                  style={{
                                    flex: 1,
                                    background: "#0d1117",
                                    border: "1px solid #30363d",
                                    color: "#c9d1d9",
                                    borderRadius: 4,
                                    padding: 8,
                                    fontFamily: "inherit",
                                    fontSize: 13,
                                    resize: "vertical",
                                    minHeight: 36
                                  }}
                                  disabled={inspectorVals.locked}
                                  placeholder="Enter text..."
                                  value={pendingEdits.get(`${selection.base}:${selection.local}:${mediaRef.current}`)?.textContent ?? selection.el.textContent ?? ""}
                                  onChange={(e) => {
                                    const key = `${selection.base}:${selection.local}:${mediaRef.current}`;
                                    const newVal = e.target.value;
                                    
                                    // Live update on canvas
                                    selection.el.textContent = newVal;
                                    
                                    setPendingEdits((m) => {
                                      const n = new Map(m);
                                      n.set(key, { media: mediaRef.current, 
                                        base: selection.base, 
                                        local: selection.local, 
                                        decls: m.get(key)?.decls ?? {}, 
                                        textContent: newVal 
                                      });
                                      return n;
                                    });
                                  }}
                                />
                                
                                <button
                                  className={`amBtn ${inspectorVals.locked ? "" : (pendingEdits.get(`${selection.base}:${selection.local}:${mediaRef.current}`)?.decls["font-weight"] === "700" || (!pendingEdits.has(`${selection.base}:${selection.local}:${mediaRef.current}`) && iframeEnv()?.win.getComputedStyle(selection.el).fontWeight === "700") ? "amBtnPrimary" : "")}`}
                                  disabled={inspectorVals.locked}
                                  onClick={() => {
                                    const key = `${selection.base}:${selection.local}:${mediaRef.current}`;
                                    const isBold = pendingEdits.get(key)?.decls["font-weight"] === "700" || (!pendingEdits.has(key) && iframeEnv()?.win.getComputedStyle(selection.el).fontWeight === "700");
                                    const newVal = isBold ? "400" : "700";
                                    
                                    pushUndo(pendingEdits);
                                    applyInline(selection, { "font-weight": newVal });
                                    setPendingEdits((m) => {
                                      const n = new Map(m);
                                      n.set(key, { media: mediaRef.current, base: selection.base, local: selection.local, decls: { ...(m.get(key)?.decls ?? {}), "font-weight": newVal }, textContent: m.get(key)?.textContent });
                                      return n;
                                    });
                                  }}
                                >
                                  <b>B</b>
                                </button>
                              </div>
                          
                              <div className="amSliderRow" style={{ marginTop: 12 }}>
                                <div className="amSliderHeader">
                                  <span>Font Size</span>
                                </div>
                                <input
                                  className="amSlider"
                                  type="range"
                                  min={12}
                                  max={120}
                                  disabled={inspectorVals.locked}
                                  value={parseInt(pendingEdits.get(`${selection.base}:${selection.local}:${mediaRef.current}`)?.decls["font-size"] || iframeEnv()?.win.getComputedStyle(selection.el).fontSize || "24", 10)}
                                  onChange={(e) => {
                                    const key = `${selection.base}:${selection.local}:${mediaRef.current}`;
                                    const newVal = `${e.target.value}px`;
                                    applyInline(selection, { "font-size": newVal });
                                    setPendingEdits((m) => {
                                      const n = new Map(m);
                                      n.set(key, { media: mediaRef.current, base: selection.base, local: selection.local, decls: { ...(m.get(key)?.decls ?? {}), "font-size": newVal }, textContent: m.get(key)?.textContent });
                                      return n;
                                    });
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Nudge controls */}
                      <div className="amNudgeSection">
                        <span className="amNudgeTitle">
                          Nudge Position
                          <span>1% / 5% step</span>
                        </span>
                        <div className="amNudgeGrid">
                          <button className="amNudgeBtn" onClick={() => nudgeSelected(-NUDGE, 0)}>← 1%</button>
                          <button className="amNudgeBtn" onClick={() => nudgeSelected(0, -NUDGE)}>↑ 1%</button>
                          <button className="amNudgeBtn" onClick={() => nudgeSelected(0,  NUDGE)}>↓ 1%</button>
                          <button className="amNudgeBtn" onClick={() => nudgeSelected( NUDGE, 0)}>→ 1%</button>
                          <button className="amNudgeBtn" onClick={() => nudgeSelected(-NUDGE_BIG, 0)}>← 5%</button>
                          <button className="amNudgeBtn" onClick={() => nudgeSelected(0, -NUDGE_BIG)}>↑ 5%</button>
                          <button className="amNudgeBtn" onClick={() => nudgeSelected(0,  NUDGE_BIG)}>↓ 5%</button>
                          <button className="amNudgeBtn" onClick={() => nudgeSelected( NUDGE_BIG, 0)}>→ 5%</button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="amActionStack">
                    <div className="amActionRow">
                      <button
                        className="amBtn amBtnPrimary"
                        onClick={() => void handleSave()}
                        disabled={saving || pendingEdits.size === 0}
                        style={{ flex: 1 }}
                      >
                        {saving ? "⏳ Saving…" : `💾 Save Edits (${pendingEdits.size})`}
                      </button>
                    </div>
                    <div className="amActionRow">
                      <button className="amBtn" onClick={() => toggleLock()} disabled={saving}>{inspectorVals?.locked ? "🔓 Unlock" : "🔒 Lock"}</button>
                      <button className="amBtn" onClick={() => void duplicateSelected()} disabled={saving || inspectorVals?.locked}>⧉ Duplicate</button>
                      <button className="amBtn amBtnDanger" onClick={() => void deleteSelected()} disabled={saving || inspectorVals?.locked}>🗑 Delete</button>
                    </div>
                    <div className="amActionRow">
                      <button className="amBtn" onClick={undo} disabled={undoStack.current.length === 0}>↩ Undo</button>
                      <button className="amBtn" onClick={redo} disabled={redoStack.current.length === 0}>↪ Redo</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─ Layers tab ─ */}
          {tab === "layers" && (
            <div className="amCard">
              <div className="amCardHeader">
                <h3 className="amCardTitle">📋 Scene Layers</h3>
                <span className="amKindBadge amCss">{layers.length}</span>
              </div>
              {layers.length === 0 ? (
                <p style={{ color: "#8b949e", fontSize: 12, margin: "8px 0 0" }}>
                  {iframeReady
                    ? "No editable elements found. Add some from the Library."
                    : "Canvas loading…"}
                </p>
              ) : (
                <div className="amLayersList">
                  {[...layers].reverse().map((layer, i) => {
                    const isLayerLocked = getIsLocked(layer.base, layer.local, layer.el);
                    return (
                    <div
                      key={i}
                      className={`amLayerCard${selection?.local === layer.local ? " amActive" : ""}`}
                      onClick={() => {
                        setSelection({ base: layer.base, local: layer.local, el: layer.el });
                        const env = iframeEnv();
                        if (env) setSelRotation(readRotation(layer.el, env.win));
                        setTab("inspector");
                      }}
                    >
                      <div className="amLayerMain">
                        <div className="amLayerIconBox">
                          {isLayerLocked ? "🔒" : (layer.local.startsWith("custom_") ? "✦" : "◈")}
                        </div>
                        <div className="amLayerMeta">
                          <span className="amLayerName">.{layer.local}</span>
                          <span className="amLayerSubtext">{layer.base}</span>
                        </div>
                        <div className="amLayerBadges" onClick={(e) => e.stopPropagation()}>
                          <button
                            title="Toggle Lock"
                            className="amLayerActionBtn"
                            onClick={() => toggleLock(layer)}
                            disabled={saving}
                          >{isLayerLocked ? "🔓" : "🔒"}</button>
                          <button
                            title="Duplicate"
                            className="amLayerActionBtn"
                            onClick={() => void duplicateSelected(layer)}
                            disabled={saving || isLayerLocked}
                          >⧉</button>
                          <button
                            title="Delete"
                            className="amLayerActionBtn"
                            style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}
                            onClick={() => void deleteSelected(layer)}
                            disabled={saving || isLayerLocked}
                          >🗑</button>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          )}

          {/* ─ Library tab ─ */}
          {tab === "library" && (
            <>
              <div className="amCard">
                <div className="amCardHeader">
                  <h3 className="amCardTitle">📚 Asset Library</h3>
                </div>
                <div className="amLibrarySubNav">
                  <button
                    className={`amSubTab${libTab === "doodles" ? " amSubTabActive" : ""}`}
                    onClick={() => setLibTab("doodles")}
                  >
                    ✏️ Doodles ({DOODLE_NAMES.length})
                  </button>
                  <button
                    className={`amSubTab${libTab === "elements" ? " amSubTabActive" : ""}`}
                    onClick={() => setLibTab("elements")}
                  >
                    🖼 Elements ({SVG_ASSETS.length})
                  </button>
                  <button
                    className={`amSubTab${libTab === "text" ? " amSubTabActive" : ""}`}
                    onClick={() => setLibTab("text")}
                  >
                    T Text
                  </button>
                </div>
                <div className="amSearchBox">
                  <input
                    className="amInput"
                    type="text"
                    placeholder={`Search ${libTab}…`}
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                  />
                  {searchQ && (
                    <button className="amSearchClear" onClick={() => setSearchQ("")}>×</button>
                  )}
                </div>
              </div>

              {libTab === "doodles" && (
                <div className="amCard">
                  {/* Color palette */}
                  <div className="amCardHeader">
                    <h3 className="amCardTitle">🎨 Doodle Options</h3>
                  </div>
                  <div className="amColorPalette">
                    {PALETTE.map((c) => (
                      <button
                        key={c}
                        className={`amColorSwatch${doodleColor === c ? " amActive" : ""}`}
                        style={{ background: c }}
                        onClick={() => setDoodleColor(c)}
                        title={c}
                      />
                    ))}
                  </div>
                  <div className="amSliderRow">
                    <div className="amSliderHeader">
                      <span>Size</span>
                      <span>{doodleSize}px</span>
                    </div>
                    <input
                      className="amSlider"
                      type="range"
                      min={16}
                      max={240}
                      value={doodleSize}
                      onChange={(e) => setDoodleSize(Number(e.target.value))}
                    />
                  </div>

                  {/* Doodle grid */}
                  <div className="amDoodleGrid">
                    {filteredDoodles.map((name) => (
                      <div
                        key={name}
                        className="amDoodleItem"
                        onClick={() => !saving && void addDoodle(name)}
                        title={`Add ${name}`}
                        style={{ opacity: saving ? 0.5 : 1 }}
                      >
                        <div className="amDoodleIconWrap" style={{ color: doodleColor }}>
                          <Doodle name={name} size={36} />
                        </div>
                        <span className="amDoodleName">{name}</span>
                      </div>
                    ))}
                    {filteredDoodles.length === 0 && (
                      <div className="amEmptyAssets">No doodles match "{searchQ}"</div>
                    )}
                  </div>
                </div>
              )}

              {libTab === "elements" && (
                <div className="amCard">
                  <div className="amSvgGrid">
                    {filteredSvgs.map((asset) => (
                      <div
                        key={asset.id}
                        className="amSvgItem"
                        onClick={() => !saving && void addSvg(asset)}
                        title={`Add ${asset.label}`}
                        style={{ opacity: saving ? 0.5 : 1 }}
                      >
                        <div className="amSvgThumb">
                          <img src={asset.url} alt={asset.label} />
                        </div>
                        <span className="amDoodleName">{asset.label}</span>
                      </div>
                    ))}
                    {filteredSvgs.length === 0 && (
                      <div className="amEmptyAssets">No elements match "{searchQ}"</div>
                    )}
                  </div>
                </div>
              )}

              {libTab === "text" && (
                <div className="amCard">
                  <div className="amCardHeader">
                    <h3 className="amCardTitle">T Text Elements</h3>
                  </div>
                  <div style={{ padding: "12px 16px" }}>
                    <button
                      className="amBtn amBtnPrimary"
                      style={{ width: "100%", padding: "12px", fontSize: 15 }}
                      onClick={() => !saving && void addText()}
                      disabled={saving}
                    >
                      ➕ Add New Text
                    </button>
                    <p style={{ marginTop: 16, color: "#8b949e", fontSize: 13, lineHeight: 1.5 }}>
                      Text elements can be moved, rotated, and resized just like other elements.
                      <br /><br />
                      Double-click a text element on the canvas to edit its content.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─ Guide & Shortcuts tab ─ */}
          {tab === "shortcuts" && (
            <div className="amGuideCard">
              <h3 className="amGuideHeading">📖 How to Use the Editor</h3>
              <ul className="amGuideList">
                <li className="amGuideItem">
                  <span className="amGuideItemIcon">🖱</span>
                  <span><strong>Click</strong> any element on the canvas to select it</span>
                </li>
                <li className="amGuideItem">
                  <span className="amGuideItemIcon">↔️</span>
                  <span><strong>Drag</strong> the body area to move</span>
                </li>
                <li className="amGuideItem">
                  <span className="amGuideItemIcon">⤡</span>
                  <span><strong>Corner handles</strong> resize (hold <kbd>⇧</kbd> for free scale)</span>
                </li>
                <li className="amGuideItem">
                  <span className="amGuideItemIcon">🔄</span>
                  <span><strong>Top stem handle</strong> rotates (hold <kbd>⇧</kbd> for 15° snaps)</span>
                </li>
                <li className="amGuideItem">
                  <span className="amGuideItemIcon">💾</span>
                  <span><strong>Save</strong> writes directly into <code>S1Anniversary.tsx</code> + <code>.module.css</code></span>
                </li>
                <li className="amGuideItem">
                  <span className="amGuideItemIcon">♻️</span>
                  <span><strong>HMR</strong> automatically refreshes the canvas after every inject</span>
                </li>
              </ul>
              <div className="amShortcutTable">
                {SHORTCUTS.slice(2).map((s) => (
                  <div className="amShortcutRow" key={s.id}>
                    <span className="amShortcutDesc">{s.action}</span>
                    <span className="amKeyCombo">
                      {s.keys.map((k, j) => <kbd key={j} style={k === "+" || k === "/" ? { background: "transparent", border: "none", boxShadow: "none", color: "#8b949e", padding: "0 2px" } : {}}>{k}</kbd>)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom action bar ── */}
        <div
          style={{
            padding: "12px 18px 16px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            className="amBtn amBtnPrimary"
            style={{ flex: 1 }}
            onClick={() => void handleSave()}
            disabled={saving || pendingEdits.size === 0}
          >
            {saving
              ? "⏳ Saving…"
              : pendingEdits.size > 0
              ? `💾 Save (${pendingEdits.size})`
              : "💾 Save Layout"}
          </button>
          <button className="amBtn" onClick={() => setTab("library")} title="Add element">
            ➕
          </button>
          <button className="amBtn" onClick={() => setShowShortcuts(true)}>
            ★
          </button>
        </div>

        {/* ── Toast notification ── */}
        {toast && (
          <div className="amToast" data-err={toast.err ? 1 : 0}>
            {toast.err ? "⚠️" : "✅"} {toast.msg}
          </div>
        )}
      </aside>

      {/* ══ CANVAS AREA ══════════════════════════════════════════════════════ */}
      <div
        className="amCanvas"
        style={{
          position: "relative",
          overflow: "auto",
          display: "grid",
          placeItems: "start center",
          padding: 24,
          background:
            "repeating-conic-gradient(#12161c 0% 25%, #0e1218 0% 50%) 50% / 20px 20px",
        }}
      >
        {/*
          The spacer sets the visual footprint of the scaled frame in the CSS layout.
          Inside it, the wrapRef div carries the actual scale transform.
        */}
        <div
          style={{
            width:  device.w * zoom,
            height: device.h * zoom,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Inner wrap: natural device size, scaled visually */}
          <div
            ref={wrapRef}
            className="amFrameWrap"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: device.w,
              height: device.h,
              transformOrigin: "top left",
              transform: `scale(${zoom})`,
            }}
          >
            <iframe
              ref={iframeRef}
              src="/anniversary"
              width={device.w}
              height={device.h}
              title="Anniversary Layout Canvas"
              style={{ display: "block", border: 0 }}
            />
          </div>

          {/* Transparent click overlay above the iframe — same visual size as spacer, minus 16px on right for scrollbar */}
          <div
            style={{
              position: "absolute",
              inset: "0 16px 0 0",
              zIndex: 10,
              cursor: selection ? "default" : "crosshair",
            }}
            onClick={handleCanvasClick}
            onDoubleClick={handleCanvasDoubleClick}
            onWheel={(e) => {
              const env = iframeEnv();
              if (env) {
                env.win.scrollBy({ top: e.deltaY, left: e.deltaX });
              }
            }}
          />
        </div>

        {/* Loading indicator */}
        {!iframeReady && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8b949e",
              fontSize: 14,
              pointerEvents: "none",
            }}
          >
            ⏳ Loading canvas…
          </div>
        )}

        {/* Selection box — fixed position, rendered above everything */}
        {selection && inspectorVals && (
          <SelectionBox
            boxRef={boxRef}
            rotation={selRotation}
            locked={inspectorVals.locked}
            onMoveDown={onMoveDown}
            onResizeDown={onResizeDown}
            onRotateDown={onRotateDown}
            isEditingText={editingTextLocal === selection.local}
            textValue={pendingEdits.get(`${selection.base}:${selection.local}:${mediaRef.current}`)?.textContent ?? selection.el.querySelector('[data-am-text="true"]')?.textContent ?? ""}
            onTextChange={(val) => {
               const key = `${selection.base}:${selection.local}:${mediaRef.current}`;
               const prev = pendingEdits.get(key);
               setPendingEdits((m) => {
                  const n = new Map(m);
                  n.set(key, { media: mediaRef.current, base: selection.base, local: selection.local, decls: prev?.decls ?? {}, textContent: val });
                  return n;
               });
               const textEl = selection.el.querySelector('[data-am-text="true"]');
               if (textEl) textEl.textContent = val;
            }}
            onStopEditing={() => setEditingTextLocal(null)}
          />
        )}
      </div>

      {/* Shortcuts modal */}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

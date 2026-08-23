import type { CSSProperties } from "react";
import Doodle, { type DoodleName } from "./Doodle";
import customElementsData from "../data/custom-elements.json";

export type CustomElementPosition = {
  left?: string;
  top?: string;
  rotate?: string;
  scale?: string;
};

export type CustomElementItem = {
  id: string;
  base: string;
  local: string;
  type: "doodle" | "svg-element";
  doodleName?: DoodleName;
  /** Relative path for svg-element type, e.g. "/anniversary/elements/cherries_exact.svg" */
  svgSrc?: string;
  size?: number;
  color?: string;
  src?: string;
  width?: number | string;
  /** Persisted position/transform — only for custom-added elements. */
  position?: CustomElementPosition;
};

export default function CustomElements({
  base,
  styles,
}: {
  base: string;
  styles: Record<string, string>;
}) {
  const items = (customElementsData as CustomElementItem[]).filter(
    (item) => item.base === base,
  );

  if (!items.length) return null;

  return (
    <>
      {items.map((item) => {
        const cls = styles[item.local] || item.local;

        // Build inline style: base color + persisted position if present
        const pos = item.position;
        const itemStyle: CSSProperties = {
          ...(item.color ? { color: item.color } : {}),
          ...(pos
            ? {
                position: "absolute" as const,
                left: pos.left ?? "50%",
                top: pos.top ?? "50%",
                ...(pos.rotate
                  ? { rotate: pos.rotate }
                  : {}),
                ...(pos.scale
                  ? { scale: pos.scale }
                  : {}),
                translate: "-50% -50%",
                zIndex: 20,
              }
            : {}),
        };

        return (
          <div key={item.id} className={cls} data-custom-id={item.id} style={itemStyle}>
            {item.type === "doodle" && item.doodleName && (
              <Doodle name={item.doodleName} size={item.size ?? 32} />
            )}
            {item.type === "svg-element" && item.svgSrc && (
              <img
                src={item.svgSrc}
                alt=""
                aria-hidden="true"
                style={{
                  width: item.size ?? 120,
                  height: item.size ?? 120,
                  display: "block",
                  objectFit: "contain",
                }}
              />
            )}
            {/* Legacy image type */}
            {item.type !== "svg-element" && item.type !== "doodle" && item.src && (
              <img
                src={item.src}
                alt=""
                style={{ width: item.width ?? "100%", height: "auto" }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

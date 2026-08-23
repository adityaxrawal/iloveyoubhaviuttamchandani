import type { CSSProperties } from "react";
import { INK, sketch } from "../lib/rough";
import { DOODLES } from "../lib/doodles";
import Marks from "./Marks";
import heartLineExactSvg from "../elements/heart_line_exact.svg";
import tulipBouquetExactSvg from "../elements/tulip_bouquet_exact.svg";
import cherriesExactSvg from "../elements/cherries_exact.svg";

export type DoodleName = keyof typeof DOODLES;

export default function Doodle({
  name,
  size,
  width,
  height,
  className = "",
  style,
}: {
  name: DoodleName;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  if (name === "heart-loop") {
    return (
      <svg
        data-doodle="true"
        data-doodle-name={name}
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1536 1024"
        width={width ?? size}
        height={height ?? size}
        className={className}
        style={style}
        overflow="visible"
      >
        <image
          x="0"
          y="0"
          width="1536"
          height="1024"
          preserveAspectRatio="none"
          href={heartLineExactSvg}
        />
      </svg>
    );
  }

  if (name === "gypsophila") {
    return (
      <svg
        data-doodle="true"
        data-doodle-name={name}
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1024 1536"
        width={width ?? size}
        height={height ?? size}
        className={className}
        style={style}
        overflow="visible"
      >
        <image
          x="0"
          y="0"
          width="1024"
          height="1536"
          preserveAspectRatio="none"
          href={tulipBouquetExactSvg}
        />
      </svg>
    );
  }

  if (name === "cherry") {
    return (
      <svg
        data-doodle="true"
        data-doodle-name={name}
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1254 1254"
        width={width ?? size}
        height={height ?? size}
        className={className}
        style={style}
        overflow="visible"
      >
        <image
          x="0"
          y="0"
          width="1254"
          height="1254"
          preserveAspectRatio="none"
          href={cherriesExactSvg}
        />
      </svg>
    );
  }

  const spec = DOODLES[name];
  if (!spec) return null;
  const marks = sketch(name, spec.box, spec.parts, spec.pen ?? INK);

  return (
    <svg
      data-doodle="true"
      data-doodle-name={name}
      aria-hidden="true"
      focusable="false"
      viewBox={spec.box}
      width={width ?? size}
      height={height ?? size}
      className={className}
      style={style}
      overflow="visible"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Marks marks={marks} />
    </svg>
  );
}

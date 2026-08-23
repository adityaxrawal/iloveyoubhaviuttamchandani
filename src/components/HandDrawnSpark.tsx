import { useId } from "react";
import "./HandDrawnSpark.css";

export interface HandDrawnSparkProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function HandDrawnSpark({
  size = 220,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn red celebration spark",
}: HandDrawnSparkProps) {
  const id = useId();
  const textureId = `spark-paper-${id.replace(/:/g, "")}`;

  return (
    <svg
      className={`hand-drawn-spark ${className}`}
      viewBox="0 0 160 270"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* Fixed seed = deterministic texture */}
        <filter
          id={textureId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.08"
            numOctaves="2"
            seed="17"
            result="noise"
          />

          <feColorMatrix
            in="noise"
            type="saturate"
            values="0"
          />

          <feComponentTransfer>
            <feFuncA
              type="table"
              tableValues="0 0.035"
            />
          </feComponentTransfer>
        </filter>
      </defs>

      {/* =====================================================
          PAPER
      ===================================================== */}

      {showPaper && (
        <>
          <rect
            className="spark-paper"
            x="0"
            y="0"
            width="160"
            height="270"
          />

          <rect
            className="spark-paper-texture"
            x="0"
            y="0"
            width="160"
            height="270"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          FOUR HAND-DRAWN RADIAL STROKES

          Each stroke is deliberately asymmetric and manually
          authored. They are NOT generated from angles.
      ===================================================== */}

      {/* Top stroke */}

      <path
        className="spark-stroke spark-stroke-top"
        d="
          M 84 57
          C 82 52, 79 46, 76 40
          C 73 34, 70 29, 69 25
        "
      />

      {/* Upper-left / horizontal stroke */}

      <path
        className="spark-stroke spark-stroke-left"
        d="
          M 73 113
          C 65 111, 57 109, 49 106
          C 41 103, 35 101, 30 99
        "
      />

      {/* Middle-left / horizontal stroke */}

      <path
        className="spark-stroke spark-stroke-middle"
        d="
          M 72 150
          C 64 151, 55 153, 46 155
          C 39 157, 33 159, 29 160
        "
      />

      {/* Lower diagonal stroke */}

      <path
        className="spark-stroke spark-stroke-bottom"
        d="
          M 84 177
          C 80 184, 76 190, 72 196
          C 68 202, 64 207, 60 212
        "
      />

      {/* =====================================================
          SUBTLE SECOND TRACES

          These are intentionally incomplete rather than
          perfectly parallel.
      ===================================================== */}

      <path
        className="spark-trace spark-trace-top"
        d="
          M 86 56
          C 84 50, 81 44, 78 38
        "
      />

      <path
        className="spark-trace spark-trace-left"
        d="
          M 72 116
          C 63 114, 55 112, 47 109
        "
      />

      <path
        className="spark-trace spark-trace-middle"
        d="
          M 71 153
          C 63 154, 55 156, 47 158
        "
      />

      <path
        className="spark-trace spark-trace-bottom"
        d="
          M 87 178
          C 83 185, 78 192, 74 198
        "
      />
    </svg>
  );
}

export default HandDrawnSpark;

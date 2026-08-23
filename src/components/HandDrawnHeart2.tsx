import { useId } from "react";
import "./HandDrawnHeart2.css";

export interface HandDrawnHeart2Props {
  size?: number | string;
  className?: string;
  ariaLabel?: string;
  showPaper?: boolean;
}

export function HandDrawnHeart2({
  size = 320,
  className = "",
  ariaLabel = "Hand drawn heart",
  showPaper = true,
}: HandDrawnHeart2Props) {
  // Makes the clipPath safe when multiple hearts are rendered
  // while remaining deterministic for React's rendering model.
  const id = useId();
  const clipId = `heart-clip-2-${id.replace(/:/g, "")}`;
  const textureId = `heart-paper-2-${id.replace(/:/g, "")}`;

  /*
   * The heart geometry is intentionally asymmetric.
   *
   * Top-left lobe:
   *   - narrower
   *   - taller
   *
   * Top-right lobe:
   *   - wider
   *   - rounder
   *
   * Bottom point:
   *   - slightly left of center
   */
  const heartPath = `
    M 161 222

    C 150 212, 128 200, 111 184
    C 94 168, 83 149, 82 127

    C 81 106, 91 88, 107 81
    C 123 73, 141 78, 150 91
    C 157 101, 158 112, 157 124

    C 160 109, 167 94, 178 86
    C 192 75, 210 75, 222 84
    C 237 96, 239 115, 234 133

    C 229 153, 218 169, 206 184
    C 192 201, 175 214, 161 222

    Z
  `;

  return (
    <svg
      className={`hand-drawn-heart-2 ${className}`}
      viewBox="0 0 320 320"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* -------------------------------------------------------
            HEART CLIP
            The heart geometry itself is never created with CSS.
            Every interior stroke is clipped against this SVG path.
        ------------------------------------------------------- */}
        <clipPath id={clipId}>
          <path d={heartPath} />
        </clipPath>

        {/* -------------------------------------------------------
            SUBTLE PAPER TEXTURE
            Fixed seed = deterministic.
        ------------------------------------------------------- */}
        <filter
          id={textureId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.08"
            numOctaves="2"
            seed="23"
            result="noise"
          />

          <feColorMatrix
            in="noise"
            type="saturate"
            values="0"
            result="grayNoise"
          />

          <feComponentTransfer in="grayNoise">
            <feFuncA
              type="table"
              tableValues="0 0.055"
            />
          </feComponentTransfer>
        </filter>
      </defs>

      {/* =========================================================
          PAPER
      ========================================================= */}

      {showPaper && (
        <>
          <rect
            className="heart-paper"
            x="0"
            y="0"
            width="320"
            height="320"
          />

          <rect
            className="heart-paper-texture"
            x="0"
            y="0"
            width="320"
            height="320"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =========================================================
          VERY LIGHT HEART INTERIOR
      ========================================================= */}

      <path
        className="heart-fill"
        d={heartPath}
      />

      {/* =========================================================
          INTERIOR HATCHING
          All geometry is explicitly written.
          No random/procedural generation.
      ========================================================= */}

      <g
        className="heart-hatching"
        clipPath={`url(#${clipId})`}
      >
        {/* Left lobe */}

        <path d="M 92 91 L 129 139" />
        <path d="M 87 104 L 135 165" />
        <path d="M 86 119 L 139 180" />
        <path d="M 89 137 L 143 190" />
        <path d="M 96 153 L 146 201" />

        {/* Central area */}

        <path d="M 111 86 L 151 131" />
        <path d="M 122 82 L 155 119" />
        <path d="M 137 89 L 160 119" />

        <path d="M 132 136 L 166 174" />
        <path d="M 128 150 L 169 193" />
        <path d="M 134 168 L 169 204" />

        {/* Right lobe */}

        <path d="M 181 88 L 221 128" />
        <path d="M 174 99 L 229 148" />
        <path d="M 168 112 L 224 165" />
        <path d="M 166 128 L 216 177" />
        <path d="M 166 145 L 207 185" />

        {/* Small broken strokes */}

        <path d="M 196 82 L 220 105" />
        <path d="M 207 87 L 230 112" />
        <path d="M 182 111 L 202 131" />

        {/* Lower heart */}

        <path d="M 103 166 L 151 215" />
        <path d="M 115 181 L 157 218" />
        <path d="M 133 194 L 160 221" />

        <path d="M 179 170 L 207 194" />
        <path d="M 175 184 L 194 202" />
      </g>

      {/* =========================================================
          PRIMARY HAND-DRAWN OUTLINE
      ========================================================= */}

      <path
        className="heart-outline heart-outline-primary"
        d="
          M 161 222

          C 150 212, 128 200, 111 184
          C 94 168, 83 149, 82 127

          C 81 106, 91 88, 107 81
          C 123 73, 141 78, 150 91
          C 157 101, 158 112, 157 124

          C 160 109, 167 94, 178 86
          C 192 75, 210 75, 222 84
          C 237 96, 239 115, 234 133

          C 229 153, 218 169, 206 184
          C 192 201, 175 214, 161 222
        "
      />

      {/* =========================================================
          SECOND TRACE
          Slightly different manually drawn path.
      ========================================================= */}

      <path
        className="heart-outline heart-outline-secondary"
        d="
          M 158 220

          C 148 210, 126 198, 109 181
          C 93 165, 81 146, 80 126

          C 79 105, 89 86, 106 79
          C 122 72, 140 76, 149 89
          C 156 99, 158 111, 156 122

          C 159 107, 166 92, 177 84
          C 191 74, 209 73, 222 82
          C 238 94, 240 113, 235 132

          C 230 151, 220 168, 207 183
          C 193 200, 174 214, 158 220
        "
      />

      {/* =========================================================
          SMALL INNER TRACE
          Gives the outline the slightly worn pencil/ink quality.
      ========================================================= */}

      <path
        className="heart-outline heart-outline-inner"
        d="
          M 164 218
          C 151 207, 132 195, 116 180
          C 100 164, 91 146, 89 127
          C 87 109, 95 94, 108 87
          C 121 80, 136 83, 145 94
          C 151 102, 153 112, 152 123

          C 156 108, 164 97, 176 90
          C 188 83, 203 82, 214 90
          C 227 100, 230 116, 226 132

          C 221 151, 211 166, 199 181
          C 187 196, 173 209, 164 218
        "
      />

      {/* =========================================================
          CHARACTERISTIC BOTTOM CROSSING STROKE
      ========================================================= */}

      <path
        className="heart-bottom-stroke"
        d="M 160 218 C 158 224, 157 228, 153 232"
      />

      <path
        className="heart-bottom-stroke heart-bottom-stroke-secondary"
        d="M 161 219 C 164 223, 168 226, 172 228"
      />

      <path
        className="heart-bottom-stroke-small"
        d="M 158 221 C 157 224, 156 226, 155 228"
      />

      {/* =========================================================
          RADIAL HAND-DRAWN ACCENTS
      ========================================================= */}

      <g className="heart-accent-strokes">
        {/* Top */}
        <path d="M 139 58 L 139 42" />

        {/* Upper-left */}
        <path d="M 104 71 L 92 62" />

        {/* Left */}
        <path d="M 76 106 L 61 100" />
        <path d="M 72 128 L 56 128" />

        {/* Lower-left */}
        <path d="M 80 151 L 68 158" />
        <path d="M 102 180 L 96 190" />

        {/* Upper-right */}
        <path d="M 171 65 L 179 56" />

        {/* Right */}
        <path d="M 234 106 L 249 101" />
        <path d="M 238 128 L 254 127" />

        {/* Lower-right */}
        <path d="M 226 153 L 239 159" />
        <path d="M 209 181 L 215 191" />
      </g>

      {/* A few very small, faded accent fragments */}
      <g className="heart-accent-fragments">
        <path d="M 64 88 L 59 86" />
        <path d="M 88 194 L 84 199" />
        <path d="M 246 88 L 251 84" />
        <path d="M 220 201 L 225 207" />
      </g>
    </svg>
  );
}

export default HandDrawnHeart2;

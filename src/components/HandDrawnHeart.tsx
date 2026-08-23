import { useId } from "react";
import "./HandDrawnHeart.css";

export interface HandDrawnHeartProps {
  className?: string;
  size?: number | string;
  ariaLabel?: string;
}

export function HandDrawnHeart({
  className = "",
  size = 320,
  ariaLabel = "Hand drawn heart",
}: HandDrawnHeartProps) {
  const id = useId();
  const clipId = `heart-clip-${id.replace(/:/g, "")}`;
  const grainId = `paper-grain-${id.replace(/:/g, "")}`;

  return (
    <svg
      className={`hand-drawn-heart ${className}`}
      width={size}
      height={size}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* Heart interior clipping region */}
        <clipPath id={clipId}>
          <path
            d="
              M 183 342

              C 174 329, 143 299, 119 270
              C 96 242, 77 212, 67 179

              C 54 137, 66 99, 93 76
              C 115 57, 143 55, 165 67
              C 184 77, 195 94, 199 117

              C 208 92, 224 72, 247 63
              C 273 53, 302 61, 318 84
              C 337 111, 329 147, 315 176

              C 298 212, 274 246, 247 276
              C 225 301, 201 324, 183 342

              Z
            "
          />
        </clipPath>

        {/* Extremely subtle paper grain */}
        <filter
          id={grainId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="17"
            result="noise"
          />

          <feColorMatrix
            in="noise"
            type="saturate"
            values="0"
            result="grayNoise"
          />

          <feComponentTransfer in="grayNoise" result="softNoise">
            <feFuncA type="table" tableValues="0 0.035" />
          </feComponentTransfer>

          <feBlend
            in="SourceGraphic"
            in2="softNoise"
            mode="multiply"
          />
        </filter>
      </defs>

      {/* =========================================================
          PAPER
          ========================================================= */}

      <rect
        className="heart-paper"
        x="0"
        y="0"
        width="400"
        height="400"
        filter={`url(#${grainId})`}
      />

      {/* =========================================================
          HEART BASE
          ========================================================= */}

      <path
        className="heart-fill"
        d="
          M 183 342

          C 174 329, 143 299, 119 270
          C 96 242, 77 212, 67 179

          C 54 137, 66 99, 93 76
          C 115 57, 143 55, 165 67
          C 184 77, 195 94, 199 117

          C 208 92, 224 72, 247 63
          C 273 53, 302 61, 318 84
          C 337 111, 329 147, 315 176

          C 298 212, 274 246, 247 276
          C 225 301, 201 324, 183 342

          Z
        "
      />

      {/* =========================================================
          HATCHING
          All strokes are clipped to the heart.
          ========================================================= */}

      <g className="heart-hatching" clipPath={`url(#${clipId})`}>
        {/* Left lobe */}
        <path d="M 72 87 L 143 181" />
        <path d="M 67 103 L 148 211" />
        <path d="M 64 122 L 145 231" />
        <path d="M 65 142 L 137 237" />
        <path d="M 69 161 L 130 242" />
        <path d="M 75 178 L 128 245" />
        <path d="M 82 194 L 139 260" />
        <path d="M 89 211 L 149 276" />
        <path d="M 98 227 L 158 289" />
        <path d="M 109 241 L 168 302" />
        <path d="M 119 256 L 174 315" />

        {/* Left-lobe shorter strokes */}
        <path d="M 92 78 L 125 122" />
        <path d="M 107 68 L 144 116" />
        <path d="M 126 65 L 159 109" />
        <path d="M 81 134 L 113 174" />
        <path d="M 83 157 L 120 204" />

        {/* Central crossing / deeper hatching */}
        <path d="M 151 79 L 199 142" />
        <path d="M 161 75 L 207 135" />
        <path d="M 174 82 L 218 137" />
        <path d="M 179 101 L 225 160" />
        <path d="M 169 118 L 218 181" />
        <path d="M 156 137 L 210 205" />
        <path d="M 145 157 L 202 225" />
        <path d="M 139 179 L 194 245" />
        <path d="M 140 202 L 190 262" />
        <path d="M 146 224 L 187 274" />

        {/* Right lobe */}
        <path d="M 255 67 L 319 136" />
        <path d="M 241 72 L 315 154" />
        <path d="M 228 84 L 306 168" />
        <path d="M 218 98 L 296 181" />
        <path d="M 212 116 L 285 192" />
        <path d="M 207 137 L 278 207" />
        <path d="M 208 157 L 268 218" />
        <path d="M 211 178 L 258 227" />
        <path d="M 216 198 L 250 233" />

        {/* Short, broken right-lobe strokes */}
        <path d="M 275 72 L 310 106" />
        <path d="M 291 82 L 322 113" />
        <path d="M 265 101 L 302 140" />
        <path d="M 257 124 L 294 162" />
        <path d="M 250 148 L 285 184" />

        {/* Lower heart */}
        <path d="M 118 247 L 177 325" />
        <path d="M 129 258 L 180 328" />
        <path d="M 143 273 L 181 330" />
        <path d="M 157 287 L 182 332" />
        <path d="M 205 220 L 244 269" />
        <path d="M 202 242 L 231 279" />
        <path d="M 196 263 L 218 291" />
        <path d="M 190 285 L 204 303" />
      </g>

      {/* =========================================================
          PRIMARY HAND-DRAWN OUTLINE
          ========================================================= */}

      <path
        className="heart-outline heart-outline-main"
        d="
          M 183 342

          C 174 329, 143 299, 119 270
          C 96 242, 77 212, 67 179

          C 54 137, 66 99, 93 76
          C 115 57, 143 55, 165 67
          C 184 77, 195 94, 199 117

          C 208 92, 224 72, 247 63
          C 273 53, 302 61, 318 84
          C 337 111, 329 147, 315 176

          C 298 212, 274 246, 247 276
          C 225 301, 201 324, 183 342
        "
      />

      {/* =========================================================
          SECOND IMPERFECT TRACE
          Deliberately slightly offset from the first outline.
          ========================================================= */}

      <path
        className="heart-outline heart-outline-secondary"
        d="
          M 180 338

          C 169 325, 140 295, 116 267
          C 93 239, 75 207, 64 175

          C 52 135, 64 96, 91 73
          C 113 54, 142 53, 164 65
          C 183 75, 194 93, 198 116

          C 207 90, 223 69, 246 61
          C 273 51, 303 59, 320 82
          C 339 109, 332 145, 318 175

          C 301 211, 276 245, 249 275
          C 226 301, 201 324, 180 338
        "
      />

      {/* =========================================================
          EXTRA LOOSE INNER TRACE
          ========================================================= */}

      <path
        className="heart-outline heart-outline-inner"
        d="
          M 188 335
          C 177 319, 148 293, 124 264
          C 101 237, 83 207, 73 176
          C 63 139, 73 105, 96 82
          C 116 63, 142 61, 161 72
          C 180 82, 190 98, 195 120

          C 204 97, 220 78, 245 68
          C 269 58, 294 65, 309 87
          C 326 111, 320 142, 307 171
          C 291 207, 268 239, 242 270
          C 220 295, 199 318, 188 335
        "
      />

      {/* =========================================================
          CHARACTERISTIC BOTTOM CROSSING STROKES
          ========================================================= */}

      <path
        className="heart-bottom-stroke"
        d="M 183 337 C 179 344, 175 349, 171 353"
      />

      <path
        className="heart-bottom-stroke heart-bottom-stroke-right"
        d="M 184 338 C 188 343, 190 347, 194 350"
      />

      <path
        className="heart-bottom-stroke"
        d="M 181 340 C 178 343, 176 346, 173 348"
      />

      {/* =========================================================
          DECORATIVE SIDE STROKES
          ========================================================= */}

      <g className="heart-accent-strokes">
        {/* Left */}
        <path d="M 48 112 L 29 104" />
        <path d="M 44 135 L 22 135" />
        <path d="M 48 157 L 29 165" />

        {/* Right */}
        <path d="M 326 108 L 346 99" />
        <path d="M 332 132 L 354 129" />
        <path d="M 327 154 L 347 163" />
      </g>
    </svg>
  );
}

export default HandDrawnHeart;

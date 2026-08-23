import { useId } from "react";
import "./LoveRingsIllustration.css";

export interface LoveRingsIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function LoveRingsIllustration({
  size = 320,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn heart above two interlocking rings",
}: LoveRingsIllustrationProps) {
  const id = useId();

  const textureId = `love-rings-texture-${id.replace(/:/g, "")}`;

  return (
    <svg
      className={`love-rings-illustration ${className}`}
      width={size}
      height={size}
      viewBox="0 0 400 460"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* =====================================================
            SUBTLE PAPER TEXTURE

            Fixed seed makes the texture deterministic.
        ===================================================== */}
        <filter
          id={textureId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.075"
            numOctaves="2"
            seed="31"
            result="paperNoise"
          />

          <feColorMatrix
            in="paperNoise"
            type="saturate"
            values="0"
            result="grayNoise"
          />

          <feComponentTransfer in="grayNoise">
            <feFuncA
              type="table"
              tableValues="0 0.045"
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
            className="love-rings-paper"
            x="0"
            y="0"
            width="400"
            height="460"
          />

          <rect
            className="love-rings-paper-texture"
            x="0"
            y="0"
            width="400"
            height="460"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          GROUND SHADOW

          Very subtle irregular pencil/paint shadow underneath
          the rings.
      ===================================================== */}

      <path
        className="love-rings-shadow"
        d="
          M 87 337
          C 111 328, 151 329, 190 332
          C 230 329, 276 330, 303 337
          C 292 347, 255 351, 205 350
          C 154 351, 107 348, 87 337
          Z
        "
      />

      {/* =====================================================
          HEART

          Manually drawn rather than using a standard heart
          symbol. The heart is intentionally small and slightly
          irregular like the reference.
      ===================================================== */}

      <path
        className="love-rings-heart"
        d="
          M 201 142

          C 194 136, 181 126, 177 116
          C 173 106, 176 96, 184 91
          C 192 86, 201 90, 205 98

          C 209 89, 218 86, 226 90
          C 235 95, 237 105, 233 115

          C 229 125, 216 136, 201 150

          C 199 148, 199 145, 201 142

          Z
        "
      />

      {/* Slight darker hand-drawn edge around the heart */}

      <path
        className="love-rings-heart-edge"
        d="
          M 201 148
          C 195 140, 181 130, 176 118
          C 171 107, 175 96, 184 90
          C 192 85, 201 89, 205 97

          C 210 89, 219 86, 227 91
          C 236 96, 238 106, 233 117
          C 228 128, 215 139, 201 151
        "
      />

      {/* =====================================================
          HEART ACCENT MARKS
      ===================================================== */}

      <g className="love-rings-heart-accents">
        {/* upper-left */}
        <path d="M 162 111 L 149 102" />

        {/* left */}
        <path d="M 153 137 L 138 135" />

        {/* upper-right */}
        <path d="M 242 106 L 254 98" />

        {/* right */}
        <path d="M 249 132 L 264 130" />

        {/* small lower-right fragment */}
        <path d="M 238 148 L 246 154" />
      </g>

      {/* =====================================================
          LEFT RING — BACK / PRIMARY TRACE

          Not a perfect circle. The path is intentionally
          asymmetric and hand-drawn.
      ===================================================== */}

      <path
        className="ring ring-left-back"
        d="
          M 178 185

          C 138 184, 108 205, 103 242
          C 98 278, 113 311, 142 326
          C 171 341, 207 334, 224 307
          C 243 277, 239 237, 220 211
          C 210 195, 195 186, 178 185
        "
      />

      {/* Left ring second tracing */}

      <path
        className="ring ring-left-back-secondary"
        d="
          M 176 181

          C 136 180, 105 203, 100 241
          C 95 279, 111 314, 141 330
          C 171 346, 209 337, 228 308
          C 247 278, 242 236, 222 208
          C 211 192, 195 182, 176 181
        "
      />

      {/* =====================================================
          RIGHT RING — BACK / PRIMARY TRACE
      ===================================================== */}

      <path
        className="ring ring-right-back"
        d="
          M 225 184

          C 265 183, 296 204, 301 241
          C 306 277, 291 311, 262 326
          C 233 341, 198 333, 180 306
          C 161 277, 165 237, 184 210
          C 195 194, 209 185, 225 184
        "
      />

      {/* Right ring second tracing */}

      <path
        className="ring ring-right-back-secondary"
        d="
          M 227 181

          C 268 180, 299 202, 304 240
          C 309 278, 293 314, 263 330
          C 233 345, 195 337, 176 307
          C 157 277, 161 235, 181 208
          C 192 192, 208 182, 227 181
        "
      />

      {/* =====================================================
          OVERLAPPING INNER RING LINES

          These create the characteristic double-ring effect.
      ===================================================== */}

      {/* Left ring inner trace */}

      <path
        className="ring ring-left-inner"
        d="
          M 176 197

          C 145 196, 121 214, 117 244
          C 113 274, 125 299, 148 311
          C 171 323, 198 316, 211 294
          C 226 270, 222 238, 207 217
          C 198 204, 187 197, 176 197
        "
      />

      <path
        className="ring ring-left-inner-secondary"
        d="
          M 174 193

          C 143 192, 118 212, 114 243
          C 110 274, 123 302, 147 315
          C 171 328, 201 320, 215 296
          C 230 270, 226 237, 210 214
          C 201 201, 188 193, 174 193
        "
      />

      {/* Right ring inner trace */}

      <path
        className="ring ring-right-inner"
        d="
          M 227 197

          C 258 196, 282 214, 286 244
          C 290 274, 278 299, 255 311
          C 232 323, 205 316, 191 294
          C 176 270, 180 238, 196 217
          C 205 204, 216 197, 227 197
        "
      />

      <path
        className="ring ring-right-inner-secondary"
        d="
          M 229 193

          C 260 192, 285 212, 289 243
          C 293 274, 280 302, 256 315
          C 232 328, 202 320, 188 296
          C 173 270, 177 237, 193 214
          C 202 201, 215 193, 229 193
        "
      />

      {/* =====================================================
          CROSSING / INTERLOCKING STROKES

          These are important because the reference isn't simply
          two circles placed next to each other. The rings pass
          through each other at the center.
      ===================================================== */}

      <path
        className="ring-crossing"
        d="
          M 183 211
          C 171 227, 168 250, 175 270
          C 181 286, 192 299, 205 307
        "
      />

      <path
        className="ring-crossing-secondary"
        d="
          M 188 207
          C 177 224, 174 248, 181 269
          C 187 285, 198 297, 210 304
        "
      />

      <path
        className="ring-crossing"
        d="
          M 216 210
          C 228 226, 231 250, 224 270
          C 218 286, 207 298, 194 306
        "
      />

      <path
        className="ring-crossing-secondary"
        d="
          M 211 207
          C 222 224, 225 248, 218 269
          C 212 285, 201 297, 189 304
        "
      />
    </svg>
  );
}

export default LoveRingsIllustration;

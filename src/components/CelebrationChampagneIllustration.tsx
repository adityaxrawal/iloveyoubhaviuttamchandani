import { useId } from "react";
import "./CelebrationChampagneIllustration.css";

export interface CelebrationChampagneIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function CelebrationChampagneIllustration({
  size = 320,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn champagne glasses with hearts and celebration marks",
}: CelebrationChampagneIllustrationProps) {
  const id = useId();

  const textureId = `champagne-paper-${id.replace(/:/g, "")}`;
  const heartId = `champagne-heart-${id.replace(/:/g, "")}`;

  /*
   * Main heart geometry.
   *
   * It is deliberately:
   * - narrow
   * - vertically oriented
   * - slightly asymmetric
   * - manually drawn with cubic Bézier curves
   */
  const heartPath = `
    M 200 76

    C 196 72, 189 67, 188 62
    C 187 57, 190 53, 195 53
    C 199 53, 202 56, 202 60

    C 204 56, 208 53, 213 54
    C 218 55, 220 59, 219 64

    C 218 69, 211 75, 201 83

    C 200 81, 200 78, 200 76

    Z
  `;

  return (
    <svg
      className={`celebration-champagne ${className}`}
      viewBox="0 0 320 430"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* =====================================================
            PAPER TEXTURE

            Fixed SVG noise seed keeps the rendering
            deterministic.
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
            seed="41"
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
              tableValues="0 0.04"
            />
          </feComponentTransfer>
        </filter>

        {/* Main heart geometry defined exactly once */}
        <path
          id={heartId}
          d={heartPath}
        />
      </defs>

      {/* =====================================================
          PAPER
      ===================================================== */}

      {showPaper && (
        <>
          <rect
            className="celebration-paper"
            x="0"
            y="0"
            width="320"
            height="430"
          />

          <rect
            className="celebration-paper-texture"
            x="0"
            y="0"
            width="320"
            height="430"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          TOP HEART
      ===================================================== */}

      <use
        href={`#${heartId}`}
        className="celebration-heart"
      />

      {/* Imperfect second trace around heart */}

      <path
        className="celebration-heart-trace"
        d="
          M 199 78
          C 194 74, 187 68, 187 62
          C 187 57, 190 53, 195 53
          C 199 53, 202 56, 203 60
          C 205 56, 209 53, 214 54
          C 219 55, 221 59, 220 64
          C 219 70, 211 76, 201 84
        "
      />

      {/* =====================================================
          LEFT CELEBRATION MARKS
      ===================================================== */}

      <g className="celebration-rays">
        <path d="M 166 82 L 159 73" />
        <path d="M 154 101 L 143 96" />
        <path d="M 150 118 L 138 116" />

        <path d="M 170 104 L 166 95" />
      </g>

      {/* =====================================================
          RIGHT CELEBRATION MARKS
      ===================================================== */}

      <g className="celebration-rays">
        <path d="M 235 82 L 242 72" />
        <path d="M 246 99 L 257 94" />
        <path d="M 249 116 L 261 114" />

        <path d="M 231 103 L 235 94" />
      </g>

      {/* =====================================================
          LEFT CHAMPAGNE GLASS
      ===================================================== */}

      <g className="champagne-glass champagne-glass-left">
        {/* Bowl outer contour */}

        <path
          className="glass-outline"
          d="
            M 78 137

            C 78 151, 76 169, 72 185
            C 68 201, 64 217, 63 232

            C 62 248, 68 259, 80 266

            C 91 273, 103 267, 109 256

            C 114 247, 115 235, 115 222

            C 115 204, 110 185, 107 170

            C 104 155, 102 144, 101 137

            Z
          "
        />

        {/* Bowl rim */}

        <path
          className="glass-outline"
          d="
            M 78 137
            C 84 133, 92 133, 101 137
            C 94 141, 85 141, 78 137
          "
        />

        {/* Second rim trace */}

        <path
          className="glass-secondary"
          d="
            M 79 139
            C 86 136, 94 136, 100 139
          "
        />

        {/* Champagne surface */}

        <path
          className="glass-liquid"
          d="
            M 73 184
            C 84 188, 97 188, 110 185
          "
        />

        {/* Stem */}

        <path
          className="glass-outline"
          d="
            M 88 266
            C 87 283, 83 307, 78 327
          "
        />

        <path
          className="glass-secondary"
          d="
            M 92 266
            C 91 285, 87 307, 82 328
          "
        />

        {/* Foot */}

        <path
          className="glass-outline"
          d="
            M 78 327

            C 68 328, 57 328, 48 327
            C 43 326, 40 327, 43 331

            C 51 339, 65 342, 80 341

            C 85 340, 87 338, 84 335
          "
        />

        <path
          className="glass-secondary"
          d="
            M 47 330
            C 58 335, 70 337, 82 337
          "
        />

        {/* Bowl interior contour */}

        <path
          className="glass-detail"
          d="
            M 81 145
            C 80 162, 76 180, 72 196
            C 69 211, 67 227, 67 239
            C 67 251, 72 258, 80 262
          "
        />
      </g>

      {/* =====================================================
          RIGHT CHAMPAGNE GLASS
      ===================================================== */}

      <g className="champagne-glass champagne-glass-right">
        {/* Bowl outer contour */}

        <path
          className="glass-outline"
          d="
            M 219 137

            C 219 151, 221 169, 225 185
            C 229 201, 233 217, 234 232

            C 235 248, 229 259, 217 266

            C 206 273, 194 267, 188 256

            C 183 247, 182 235, 182 222

            C 182 204, 187 185, 190 170

            C 193 155, 195 144, 196 137

            Z
          "
        />

        {/* Rim */}

        <path
          className="glass-outline"
          d="
            M 219 137
            C 213 133, 205 133, 196 137
            C 203 141, 212 141, 219 137
          "
        />

        {/* Second rim trace */}

        <path
          className="glass-secondary"
          d="
            M 218 139
            C 211 136, 203 136, 197 139
          "
        />

        {/* Champagne surface */}

        <path
          className="glass-liquid"
          d="
            M 224 184
            C 213 188, 200 188, 187 185
          "
        />

        {/* Stem */}

        <path
          className="glass-outline"
          d="
            M 209 266
            C 210 283, 214 307, 219 327
          "
        />

        <path
          className="glass-secondary"
          d="
            M 205 266
            C 206 285, 210 307, 215 328
          "
        />

        {/* Foot */}

        <path
          className="glass-outline"
          d="
            M 219 327

            C 229 328, 240 328, 249 327
            C 254 326, 257 327, 254 331

            C 246 339, 232 342, 217 341

            C 212 340, 210 338, 213 335
          "
        />

        <path
          className="glass-secondary"
          d="
            M 251 330
            C 240 335, 228 337, 216 337
          "
        />

        {/* Bowl interior contour */}

        <path
          className="glass-detail"
          d="
            M 216 145
            C 217 162, 221 180, 225 196
            C 228 211, 230 227, 230 239
            C 230 251, 225 258, 217 262
          "
        />
      </g>

      {/* =====================================================
          CENTER CONTACT / CLINK
      ===================================================== */}

      <g className="clink-heart">
        {/* Small heart formed above the touching rims */}

        <path
          d="
            M 158 111

            C 155 108, 151 105, 151 102
            C 151 99, 153 98, 155 99
            C 157 99, 159 101, 159 103

            C 160 101, 162 99, 164 100
            C 167 101, 167 103, 166 105

            C 165 108, 162 110, 159 113

            Z
          "
        />

        <path
          className="clink-heart-trace"
          d="
            M 158 111
            C 155 108, 151 106, 151 102
            C 151 99, 153 98, 155 99
            C 157 99, 159 101, 159 103
            C 160 101, 162 99, 164 100
            C 167 101, 167 103, 166 105
          "
        />
      </g>

      {/* =====================================================
          LOWER CELEBRATION MARKS
      ===================================================== */}

      <g className="celebration-rays celebration-rays-lower">
        <path d="M 151 282 L 147 296" />
        <path d="M 160 288 L 160 304" />
        <path d="M 171 283 L 175 296" />

        <path d="M 143 276 L 136 284" />
        <path d="M 181 276 L 188 284" />
      </g>

      {/* =====================================================
          SMALL LOOSE GLASS MARKS

          These help avoid a perfectly vector-clean appearance.
      ===================================================== */}

      <path
        className="loose-ink"
        d="M 79 143 C 84 145, 91 145, 97 143"
      />

      <path
        className="loose-ink"
        d="M 200 143 C 206 145, 213 145, 218 143"
      />

      <path
        className="loose-ink-light"
        d="M 68 210 C 72 213, 74 214, 78 215"
      />

      <path
        className="loose-ink-light"
        d="M 229 211 C 225 214, 223 214, 219 215"
      />
    </svg>
  );
}

export default CelebrationChampagneIllustration;

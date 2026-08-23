import { useId } from "react";
import "./LoveCoffeeMugsIllustration.css";

export interface LoveCoffeeMugsIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function LoveCoffeeMugsIllustration({
  size = 320,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn coffee mugs with smiling faces and a heart",
}: LoveCoffeeMugsIllustrationProps) {
  const id = useId();

  const textureId = `coffee-mugs-paper-${id.replace(/:/g, "")}`;

  /*
   * Hand-authored heart.
   *
   * Deliberately asymmetric:
   * - left lobe slightly narrower
   * - right lobe slightly rounder
   * - deep central indentation
   * - bottom point extends downward
   */
  const heartPath = `
    M 160 78

    C 151 67, 136 55, 136 42
    C 136 28, 146 18, 158 19
    C 169 19, 177 27, 179 38

    C 182 27, 191 18, 203 19
    C 217 20, 226 31, 224 44

    C 222 57, 208 69, 190 82

    L 176 98

    C 171 93, 166 86, 160 78

    Z
  `;

  return (
    <svg
      className={`love-coffee-mugs ${className}`}
      viewBox="0 0 400 350"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* =====================================================
            FIXED PAPER TEXTURE
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
            seed="47"
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
              tableValues="0 0.04"
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
            className="coffee-mugs-paper"
            x="0"
            y="0"
            width="400"
            height="350"
          />

          <rect
            className="coffee-mugs-paper-texture"
            x="0"
            y="0"
            width="400"
            height="350"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          HEART ABOVE MUGS
      ===================================================== */}

      <path
        className="mug-love-heart"
        d={heartPath}
      />

      {/* Imperfect second trace */}

      <path
        className="mug-love-heart-secondary"
        d="
          M 158 80

          C 149 68, 134 56, 134 42
          C 134 28, 144 17, 157 18
          C 169 18, 177 26, 180 37

          C 183 26, 192 17, 204 18
          C 218 19, 228 30, 226 44

          C 224 58, 209 70, 191 83

          L 176 101

          C 170 94, 164 86, 158 80
        "
      />

      {/* Characteristic long crossing point */}

      <path
        className="mug-love-heart-point"
        d="
          M 177 94
          C 174 99, 172 103, 169 107
        "
      />

      {/* =====================================================
          STEAM — LEFT
      ===================================================== */}

      <g className="coffee-steam">
        <path
          d="
            M 103 102
            C 97 94, 104 87, 102 80
            C 100 74, 95 70, 99 63
          "
        />

        <path
          d="
            M 119 101
            C 113 94, 120 88, 118 82
            C 116 76, 112 72, 116 66
          "
        />
      </g>

      {/* =====================================================
          STEAM — RIGHT
      ===================================================== */}

      <g className="coffee-steam">
        <path
          d="
            M 267 101
            C 261 94, 268 88, 266 81
            C 264 75, 260 71, 264 64
          "
        />

        <path
          d="
            M 282 102
            C 276 94, 283 88, 281 82
            C 279 76, 275 72, 279 66
          "
        />
      </g>

      {/* =====================================================
          LEFT MUG
      ===================================================== */}

      <g className="coffee-mug coffee-mug-left">
        {/* -----------------------------------------------------
            MAIN BODY
        ----------------------------------------------------- */}

        <path
          className="mug-body"
          d="
            M 78 126

            C 79 143, 79 169, 80 193
            L 82 242

            C 83 252, 91 257, 111 258

            C 129 258, 139 254, 140 245

            L 143 127

            Z
          "
        />

        {/* -----------------------------------------------------
            TOP RIM
        ----------------------------------------------------- */}

        <path
          className="mug-rim"
          d="
            M 78 126

            C 82 117, 95 113, 111 113
            C 128 113, 140 117, 143 126

            C 128 132, 94 132, 78 126

            Z
          "
        />

        {/* Second top trace */}

        <path
          className="mug-rim-secondary"
          d="
            M 83 122
            C 97 118, 126 118, 138 122
          "
        />

        {/* Coffee surface */}

        <path
          className="coffee-surface"
          d="
            M 85 124
            C 99 128, 124 128, 137 124
          "
        />

        {/* -----------------------------------------------------
            LEFT HANDLE
        ----------------------------------------------------- */}

        <path
          className="mug-handle"
          d="
            M 80 139

            C 66 132, 51 136, 48 150
            C 44 164, 51 179, 66 181

            C 71 182, 76 180, 80 177

            L 80 166

            C 73 171, 66 171, 62 168

            C 56 163, 57 153, 62 149

            C 66 146, 73 147, 79 151
          "
        />

        {/* -----------------------------------------------------
            CUP BOTTOM
        ----------------------------------------------------- */}

        <path
          className="mug-bottom"
          d="
            M 83 242
            C 98 247, 125 247, 139 242
          "
        />

        <path
          className="mug-bottom-secondary"
          d="
            M 87 249
            C 101 253, 124 253, 136 249
          "
        />

        {/* -----------------------------------------------------
            FACE
        ----------------------------------------------------- */}

        {/* Left eye */}

        <path
          className="face-line"
          d="
            M 96 174
            C 98 172, 100 172, 102 174
          "
        />

        {/* Right eye */}

        <path
          className="face-line"
          d="
            M 120 174
            C 122 172, 124 172, 126 174
          "
        />

        {/* Smile */}

        <path
          className="face-smile"
          d="
            M 99 183
            C 104 192, 115 194, 122 184
          "
        />

        {/* Cheek marks */}

        <path
          className="face-cheek"
          d="M 91 181 L 94 182"
        />

        <path
          className="face-cheek"
          d="M 128 182 L 131 181"
        />
      </g>

      {/* =====================================================
          RIGHT MUG
      ===================================================== */}

      <g className="coffee-mug coffee-mug-right">
        {/* -----------------------------------------------------
            MAIN BODY
        ----------------------------------------------------- */}

        <path
          className="mug-body"
          d="
            M 222 126

            C 223 143, 223 169, 224 193
            L 226 242

            C 227 252, 235 257, 255 258

            C 273 258, 283 254, 284 245

            L 287 127

            Z
          "
        />

        {/* -----------------------------------------------------
            TOP RIM
        ----------------------------------------------------- */}

        <path
          className="mug-rim"
          d="
            M 222 126

            C 226 117, 239 113, 255 113
            C 272 113, 284 117, 287 126

            C 272 132, 238 132, 222 126

            Z
          "
        />

        {/* Second rim trace */}

        <path
          className="mug-rim-secondary"
          d="
            M 227 122
            C 241 118, 270 118, 282 122
          "
        />

        {/* Coffee surface */}

        <path
          className="coffee-surface"
          d="
            M 229 124
            C 243 128, 268 128, 281 124
          "
        />

        {/* -----------------------------------------------------
            RIGHT HANDLE
        ----------------------------------------------------- */}

        <path
          className="mug-handle"
          d="
            M 284 139

            C 298 132, 313 136, 316 150
            C 320 164, 313 179, 298 181

            C 293 182, 288 180, 284 177

            L 284 166

            C 291 171, 298 171, 302 168

            C 308 163, 307 153, 302 149

            C 298 146, 291 147, 285 151
          "
        />

        {/* -----------------------------------------------------
            CUP BOTTOM
        ----------------------------------------------------- */}

        <path
          className="mug-bottom"
          d="
            M 227 242
            C 242 247, 269 247, 283 242
          "
        />

        <path
          className="mug-bottom-secondary"
          d="
            M 231 249
            C 245 253, 268 253, 280 249
          "
        />

        {/* -----------------------------------------------------
            FACE
        ----------------------------------------------------- */}

        <path
          className="face-line"
          d="
            M 240 174
            C 242 172, 244 172, 246 174
          "
        />

        <path
          className="face-line"
          d="
            M 264 174
            C 266 172, 268 172, 270 174
          "
        />

        <path
          className="face-smile"
          d="
            M 243 183
            C 248 192, 259 194, 266 184
          "
        />

        <path
          className="face-cheek"
          d="M 235 181 L 238 182"
        />

        <path
          className="face-cheek"
          d="M 272 182 L 275 181"
        />
      </g>

      {/* =====================================================
          CUP SEAM / IMPERFECTION LINES
      ===================================================== */}

      <path
        className="mug-loose-line"
        d="
          M 82 137
          C 99 140, 125 140, 140 136
        "
      />

      <path
        className="mug-loose-line"
        d="
          M 226 137
          C 243 140, 269 140, 284 136
        "
      />

      {/* Small worn marks */}

      <path
        className="mug-loose-light"
        d="M 88 216 L 91 217"
      />

      <path
        className="mug-loose-light"
        d="M 274 215 L 277 214"
      />

      {/* =====================================================
          SUBTLE GROUND SHADOW
      ===================================================== */}

      <path
        className="coffee-ground-shadow"
        d="
          M 72 263
          C 105 258, 137 260, 162 263
          C 188 259, 220 259, 250 262
          C 275 260, 301 261, 322 265

          C 299 273, 266 274, 231 272
          C 194 275, 146 275, 109 273
          C 91 272, 78 269, 72 263
          Z
        "
      />
    </svg>
  );
}

export default LoveCoffeeMugsIllustration;

import { useId } from "react";
import "./LoveCoffeeCupsIllustration.css";

export interface LoveCoffeeCupsIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function LoveCoffeeCupsIllustration({
  size = 320,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn coffee cups with floating hearts",
}: LoveCoffeeCupsIllustrationProps) {
  const id = useId();

  const textureId = `coffee-paper-texture-${id.replace(/:/g, "")}`;

  return (
    <svg
      className={`love-coffee-cups ${className}`}
      viewBox="0 0 320 390"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* =====================================================
            FIXED PAPER TEXTURE

            The fixed seed keeps the texture deterministic.
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
            seed="27"
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
            className="coffee-paper"
            x="0"
            y="0"
            width="320"
            height="390"
          />

          <rect
            className="coffee-paper-texture"
            x="0"
            y="0"
            width="320"
            height="390"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          VERY SUBTLE GROUND SHADOW
      ===================================================== */}

      <path
        className="coffee-ground-shadow"
        d="
          M 58 326
          C 82 319, 113 319, 143 322
          C 173 319, 208 319, 242 324
          C 256 326, 263 330, 254 333
          C 219 340, 91 340, 61 332
          C 56 330, 54 328, 58 326
          Z
        "
      />

      {/* =====================================================
          FLOATING HEART #1 — LEFT
      ===================================================== */}

      <path
        className="floating-heart"
        d="
          M 108 88

          C 103 84, 96 79, 96 73
          C 96 68, 99 65, 103 65
          C 107 65, 110 68, 110 72

          C 112 68, 116 66, 120 68
          C 124 70, 125 74, 123 78

          C 121 83, 115 87, 109 92

          Z
        "
      />

      {/* =====================================================
          FLOATING HEART #2 — TOP RIGHT
      ===================================================== */}

      <path
        className="floating-heart floating-heart-large"
        d="
          M 154 60

          C 148 55, 140 49, 140 42
          C 140 36, 144 32, 149 33
          C 154 33, 157 37, 157 42

          C 159 37, 164 34, 169 36
          C 174 38, 175 43, 173 48

          C 170 54, 163 59, 155 64

          Z
        "
      />

      {/* =====================================================
          FLOATING HEART #3 — CENTER
      ===================================================== */}

      <path
        className="floating-heart floating-heart-small"
        d="
          M 135 90

          C 131 87, 126 83, 126 79
          C 126 75, 129 73, 132 74
          C 135 74, 137 77, 137 80

          C 138 77, 141 75, 144 76
          C 147 77, 148 80, 147 83

          C 145 87, 141 90, 136 94

          Z
        "
      />

      {/* =====================================================
          LEFT TAKEAWAY CUP
      ===================================================== */}

      <g className="coffee-cup coffee-cup-left">
        {/* -----------------------------------------------------
            CUP BODY
        ----------------------------------------------------- */}

        <path
          className="cup-body"
          d="
            M 50 151

            L 127 151
            L 124 275

            C 123 282, 118 286, 109 287
            L 69 287

            C 60 286, 56 282, 55 275

            Z
          "
        />

        {/* -----------------------------------------------------
            TOP LID / RIM
        ----------------------------------------------------- */}

        <path
          className="cup-outline"
          d="
            M 50 151

            C 48 147, 49 143, 53 140
            L 57 137

            L 119 137
            L 124 141

            C 128 144, 128 148, 127 151

            Z
          "
        />

        {/* Lid upper contour */}

        <path
          className="cup-outline"
          d="
            M 57 137

            C 57 132, 60 128, 65 127

            C 79 125, 99 125, 113 127

            C 118 128, 120 132, 119 137
          "
        />

        {/* Lid top surface */}

        <path
          className="cup-detail"
          d="
            M 61 130

            C 76 128, 99 128, 115 130

            C 108 134, 71 134, 61 130
          "
        />

        {/* Lid lower band */}

        <path
          className="cup-detail"
          d="
            M 50 151
            C 69 154, 108 154, 127 151
          "
        />

        <path
          className="cup-detail-light"
          d="
            M 53 158
            C 72 160, 107 160, 125 158
          "
        />

        {/* -----------------------------------------------------
            CUP SIDE DETAILS
        ----------------------------------------------------- */}

        <path
          className="cup-detail"
          d="M 57 174 C 77 177, 106 177, 124 174"
        />

        <path
          className="cup-detail-light"
          d="M 58 239 C 78 241, 106 241, 123 239"
        />

        {/* Bottom contour */}

        <path
          className="cup-outline"
          d="
            M 55 275
            C 74 279, 105 279, 124 275
          "
        />

        {/* -----------------------------------------------------
            CUP PRINTED HEART
        ----------------------------------------------------- */}

        <path
          className="cup-heart"
          d="
            M 91 218

            C 85 213, 75 205, 75 198
            C 75 192, 79 188, 84 189
            C 89 189, 92 193, 92 198

            C 94 193, 99 189, 104 191
            C 109 193, 110 198, 108 203

            C 106 209, 99 215, 92 221

            Z
          "
        />

        {/* -----------------------------------------------------
            SMALL CUP IMPERFECTIONS
        ----------------------------------------------------- */}

        <path
          className="cup-loose-stroke"
          d="M 58 165 C 68 167, 78 167, 87 166"
        />

        <path
          className="cup-loose-stroke"
          d="M 108 167 C 114 167, 119 166, 123 165"
        />

        <path
          className="cup-loose-stroke-light"
          d="M 61 248 C 66 250, 72 250, 77 250"
        />
      </g>

      {/* =====================================================
          RIGHT TAKEAWAY CUP
      ===================================================== */}

      <g className="coffee-cup coffee-cup-right">
        {/* -----------------------------------------------------
            CUP BODY
        ----------------------------------------------------- */}

        <path
          className="cup-body"
          d="
            M 164 151

            L 242 151
            L 239 275

            C 238 282, 233 286, 224 287
            L 183 287

            C 174 286, 170 282, 169 275

            Z
          "
        />

        {/* -----------------------------------------------------
            TOP LID
        ----------------------------------------------------- */}

        <path
          className="cup-outline"
          d="
            M 164 151

            C 162 147, 163 143, 167 140
            L 171 137

            L 235 137
            L 239 141

            C 243 144, 243 148, 242 151

            Z
          "
        />

        {/* Lid upper contour */}

        <path
          className="cup-outline"
          d="
            M 171 137

            C 171 132, 174 128, 179 127

            C 193 125, 214 125, 229 127

            C 234 128, 236 132, 235 137
          "
        />

        {/* Lid top surface */}

        <path
          className="cup-detail"
          d="
            M 175 130

            C 190 128, 216 128, 231 130

            C 223 134, 185 134, 175 130
          "
        />

        {/* Lid lower band */}

        <path
          className="cup-detail"
          d="
            M 164 151
            C 184 154, 223 154, 242 151
          "
        />

        <path
          className="cup-detail-light"
          d="
            M 167 158
            C 186 160, 222 160, 240 158
          "
        />

        {/* -----------------------------------------------------
            CUP SIDE DETAILS
        ----------------------------------------------------- */}

        <path
          className="cup-detail"
          d="M 169 174 C 190 177, 221 177, 239 174"
        />

        <path
          className="cup-detail-light"
          d="M 170 239 C 191 241, 221 241, 238 239"
        />

        {/* Bottom contour */}

        <path
          className="cup-outline"
          d="
            M 169 275
            C 188 279, 220 279, 239 275
          "
        />

        {/* -----------------------------------------------------
            CUP PRINTED HEART
        ----------------------------------------------------- */}

        <path
          className="cup-heart"
          d="
            M 205 218

            C 199 213, 189 205, 189 198
            C 189 192, 193 188, 198 189
            C 203 189, 206 193, 206 198

            C 208 193, 213 189, 218 191
            C 223 193, 224 198, 222 203

            C 220 209, 213 215, 206 221

            Z
          "
        />

        {/* Small irregular side marks */}

        <path
          className="cup-loose-stroke"
          d="M 172 165 C 181 167, 190 167, 199 166"
        />

        <path
          className="cup-loose-stroke"
          d="M 220 167 C 228 167, 234 166, 239 165"
        />

        <path
          className="cup-loose-stroke-light"
          d="M 174 248 C 179 250, 186 250, 191 250"
        />
      </g>

      {/* =====================================================
          VERY SUBTLE CUP SHADOW FRAGMENTS
      ===================================================== */}

      <path
        className="cup-shadow-fragment"
        d="M 46 289 C 57 292, 68 292, 78 291"
      />

      <path
        className="cup-shadow-fragment"
        d="M 216 290 C 229 292, 242 291, 253 289"
      />
    </svg>
  );
}

export default LoveCoffeeCupsIllustration;

import { useId } from "react";
import "./LoveHouseIllustration.css";

export interface LoveHouseIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function LoveHouseIllustration({
  size = 320,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn house with hearts and tree",
}: LoveHouseIllustrationProps) {
  const id = useId();
  const textureId = `love-house-paper-${id.replace(/:/g, "")}`;

  /*
   * The heart geometry is deliberately asymmetric and manually
   * authored. It is used for the heart inside the roof.
   */
  const heartPath = `
    M 127 111

    C 123 107, 117 103, 117 98
    C 117 94, 120 91, 124 92
    C 127 92, 129 95, 129 98

    C 131 94, 134 92, 138 93
    C 142 94, 143 98, 142 102

    C 140 107, 134 111, 128 116

    C 128 114, 128 112, 127 111

    Z
  `;

  return (
    <svg
      className={`love-house-illustration ${className}`}
      viewBox="0 0 400 300"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* =====================================================
            DETERMINISTIC PAPER TEXTURE
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
            seed="37"
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
            className="house-paper"
            x="0"
            y="0"
            width="400"
            height="300"
          />

          <rect
            className="house-paper-texture"
            x="0"
            y="0"
            width="400"
            height="300"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          FLOATING HEART — LEFT
      ===================================================== */}

      <path
        className="floating-heart"
        d="
          M 128 51

          C 123 47, 116 42, 116 36
          C 116 31, 120 28, 124 29
          C 128 29, 131 33, 131 37

          C 133 33, 137 30, 141 32
          C 146 34, 147 38, 145 42

          C 143 47, 137 51, 129 57

          Z
        "
      />

      {/* =====================================================
          FLOATING HEART — TOP
      ===================================================== */}

      <path
        className="floating-heart floating-heart-top"
        d="
          M 198 28

          C 192 23, 184 17, 184 10
          C 184 5, 188 1, 193 2
          C 198 2, 201 6, 201 11

          C 203 6, 208 3, 213 5
          C 218 7, 220 12, 218 17

          C 216 23, 208 28, 199 34

          Z
        "
      />

      {/* =====================================================
          FLOATING HEART — RIGHT
      ===================================================== */}

      <path
        className="floating-heart floating-heart-right"
        d="
          M 260 67

          C 254 62, 246 56, 246 49
          C 246 44, 250 40, 255 41
          C 260 41, 263 45, 263 50

          C 265 45, 270 42, 275 44
          C 280 46, 281 51, 279 56

          C 277 62, 269 68, 261 73

          Z
        "
      />

      {/* =====================================================
          HOUSE SHADOW
      ===================================================== */}

      <path
        className="house-ground-shadow"
        d="
          M 82 251
          C 115 246, 158 247, 193 249
          C 225 246, 260 247, 284 252
          C 273 258, 236 260, 192 259
          C 147 261, 104 258, 82 253
          Z
        "
      />

      {/* =====================================================
          HOUSE BODY
      ===================================================== */}

      <path
        className="house-body"
        d="
          M 93 112

          L 94 223

          C 94 231, 98 235, 105 236

          L 229 235

          C 235 234, 238 230, 238 223

          L 237 111

          L 169 51

          Z
        "
      />

      {/* =====================================================
          ROOF — MAIN OUTLINE
      ===================================================== */}

      <path
        className="house-roof"
        d="
          M 75 118
          L 168 45
          L 253 115
        "
      />

      {/* Second imperfect roof trace */}

      <path
        className="house-roof-secondary"
        d="
          M 78 121
          L 169 49
          L 249 117
        "
      />

      {/* Roof lower edge */}

      <path
        className="house-roof-detail"
        d="
          M 94 112
          L 169 53
          L 237 112
        "
      />

      {/* =====================================================
          CHIMNEY
      ===================================================== */}

      <path
        className="chimney"
        d="
          M 194 70
          L 194 45
          L 211 48
          L 211 82
        "
      />

      <path
        className="chimney-secondary"
        d="
          M 197 68
          L 197 48
          L 208 50
          L 208 79
        "
      />

      {/* =====================================================
          HEART INSIDE HOUSE
      ===================================================== */}

      <path
        className="house-heart"
        d={heartPath}
      />

      <path
        className="house-heart-secondary"
        d="
          M 128 114

          C 123 109, 115 104, 115 98
          C 115 93, 119 90, 123 91
          C 127 91, 130 94, 130 98

          C 132 94, 135 91, 139 92
          C 143 93, 145 97, 144 102

          C 142 107, 135 112, 128 118
        "
      />

      {/* =====================================================
          LEFT WINDOW
      ===================================================== */}

      <path
        className="house-window"
        d="
          M 110 142
          L 133 142
          L 133 166
          L 110 166
          Z
        "
      />

      <path
        className="window-detail"
        d="M 121 142 L 121 166"
      />

      <path
        className="window-detail"
        d="M 110 154 L 133 154"
      />

      {/* =====================================================
          RIGHT WINDOW
      ===================================================== */}

      <path
        className="house-window"
        d="
          M 190 141
          L 213 141
          L 213 165
          L 190 165
          Z
        "
      />

      <path
        className="window-detail"
        d="M 201 141 L 201 165"
      />

      <path
        className="window-detail"
        d="M 190 153 L 213 153"
      />

      {/* =====================================================
          FRONT DOOR
      ===================================================== */}

      <path
        className="house-door"
        d="
          M 151 235
          L 151 192

          C 151 184, 157 180, 165 180
          C 173 180, 179 184, 179 192

          L 179 235
          Z
        "
      />

      {/* Door second trace */}

      <path
        className="house-door-secondary"
        d="
          M 155 233
          L 155 193
          C 155 187, 159 184, 165 184
          C 171 184, 175 187, 175 193
          L 175 234
        "
      />

      {/* Door handle */}

      <path
        className="door-handle"
        d="M 171 209 L 171 211"
      />

      {/* =====================================================
          TREE — TRUNK
      ===================================================== */}

      <path
        className="tree-trunk"
        d="
          M 282 225
          C 281 209, 281 192, 282 175
          C 282 166, 283 159, 285 151
        "
      />

      <path
        className="tree-trunk-secondary"
        d="
          M 287 225
          C 286 205, 286 188, 287 173
          C 287 164, 288 157, 290 151
        "
      />

      {/* =====================================================
          TREE CROWN — MAIN OUTLINE
      ===================================================== */}

      <path
        className="tree-crown"
        d="
          M 285 154

          C 275 151, 268 143, 269 134
          C 270 126, 276 122, 282 120

          C 278 111, 283 102, 291 99

          C 298 96, 305 101, 307 108

          C 314 108, 320 113, 321 121

          C 322 128, 318 134, 313 138

          C 316 145, 312 153, 305 156

          C 299 159, 292 157, 285 154

          Z
        "
      />

      {/* Second crown trace */}

      <path
        className="tree-crown-secondary"
        d="
          M 284 157
          C 274 153, 266 146, 267 136
          C 268 127, 274 122, 280 119
          C 277 110, 282 101, 290 97
          C 298 94, 306 100, 308 107
          C 316 107, 322 113, 323 121
          C 324 129, 319 135, 315 139
          C 318 147, 313 155, 306 158
        "
      />

      {/* =====================================================
          TREE INTERNAL BRANCHES
      ===================================================== */}

      <path
        className="tree-detail"
        d="
          M 285 151
          C 290 142, 291 133, 290 123

          M 289 140
          C 297 136, 301 130, 303 123

          M 288 143
          C 282 138, 278 132, 277 126
        "
      />

      {/* =====================================================
          GROUND LINE
      ===================================================== */}

      <path
        className="ground-line"
        d="
          M 6 246

          C 30 247, 48 246, 67 244
          C 84 242, 96 244, 111 245

          C 137 248, 161 247, 186 246
          C 211 245, 236 245, 258 246

          C 281 247, 302 246, 323 245
        "
      />

      {/* Second loose ground trace */}

      <path
        className="ground-line-secondary"
        d="
          M 5 250
          C 28 251, 45 249, 62 247
          C 82 244, 98 247, 114 248
        "
      />

      {/* =====================================================
          LEFT GROUND GRASS / SCRIBBLES
      ===================================================== */}

      <g className="ground-details">
        <path d="M 28 247 L 20 241" />
        <path d="M 42 247 L 34 239" />
        <path d="M 54 246 L 47 240" />
        <path d="M 67 245 L 61 238" />

        <path d="M 24 252 L 13 255" />
        <path d="M 40 251 L 31 256" />
        <path d="M 57 249 L 49 254" />
      </g>

      {/* Right loose grass */}

      <g className="ground-details">
        <path d="M 313 246 L 324 241" />
        <path d="M 329 246 L 338 243" />
        <path d="M 344 247 L 356 246" />
      </g>

      {/* =====================================================
          HOUSE LOOSE INK DETAILS
      ===================================================== */}

      <path
        className="house-loose-stroke"
        d="M 99 126 C 119 129, 140 128, 155 126"
      />

      <path
        className="house-loose-stroke"
        d="M 181 126 C 198 129, 220 128, 234 126"
      />
    </svg>
  );
}

export default LoveHouseIllustration;

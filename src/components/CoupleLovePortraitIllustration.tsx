import { useId } from "react";
import "./CoupleLovePortraitIllustration.css";

export interface CoupleLovePortraitIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function CoupleLovePortraitIllustration({
  size = 320,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn couple facing each other with a heart",
}: CoupleLovePortraitIllustrationProps) {
  const id = useId();
  const textureId = `couple-paper-${id.replace(/:/g, "")}`;

  return (
    <svg
      className={`couple-love-portrait ${className}`}
      viewBox="0 0 400 300"
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
            baseFrequency="0.035 0.075"
            numOctaves="2"
            seed="53"
            result="paperNoise"
          />

          <feColorMatrix
            in="paperNoise"
            type="saturate"
            values="0"
          />

          <feComponentTransfer>
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
            className="couple-paper"
            x="0"
            y="0"
            width="400"
            height="300"
          />

          <rect
            className="couple-paper-texture"
            x="0"
            y="0"
            width="400"
            height="300"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          HEART ABOVE THE COUPLE
      ===================================================== */}

      <path
        className="couple-heart"
        d="
          M 198 51

          C 192 45, 183 37, 183 29
          C 183 22, 188 17, 194 18
          C 200 18, 203 23, 203 29

          C 205 23, 210 18, 216 19
          C 223 20, 227 26, 225 33

          C 223 40, 214 47, 203 56

          Z
        "
      />

      {/* Heart secondary imperfect trace */}

      <path
        className="couple-heart-secondary"
        d="
          M 196 53

          C 190 46, 181 38, 181 30
          C 181 22, 186 16, 193 17
          C 200 17, 204 23, 204 29

          C 206 22, 211 17, 217 18
          C 224 19, 229 25, 227 33

          C 225 41, 216 48, 204 58
        "
      />

      {/* =====================================================
          LEFT PERSON — NECK / SHOULDER
      ===================================================== */}

      <path
        className="person-outline"
        d="
          M 61 283

          C 66 264, 75 244, 89 228
          C 96 220, 105 214, 116 211
        "
      />

      <path
        className="person-outline-secondary"
        d="
          M 65 283
          C 70 264, 79 245, 92 230
          C 100 221, 108 216, 118 213
        "
      />

      {/* Left neck */}

      <path
        className="person-outline"
        d="
          M 116 211
          C 119 200, 120 190, 119 179
        "
      />

      <path
        className="person-outline-secondary"
        d="
          M 121 211
          C 123 199, 124 189, 123 180
        "
      />

      {/* =====================================================
          LEFT FACE PROFILE
      ===================================================== */}

      <path
        className="left-face"
        d="
          M 76 103

          C 68 115, 64 132, 66 149

          C 68 166, 77 180, 92 190

          C 104 198, 117 202, 129 198

          C 140 194, 148 185, 151 176

          C 154 168, 155 159, 153 152

          C 150 148, 147 144, 146 140

          C 145 137, 147 134, 150 132

          C 153 130, 155 126, 153 123

          C 151 119, 148 118, 144 118

          C 143 106, 137 96, 126 90

          C 112 83, 94 86, 82 96

          C 79 98, 77 100, 76 103
        "
      />

      {/* Left face secondary contour */}

      <path
        className="face-secondary"
        d="
          M 80 104
          C 72 118, 69 134, 71 150
          C 73 165, 81 177, 94 187
          C 106 195, 119 198, 130 194
          C 141 190, 148 181, 150 171
        "
      />

      {/* =====================================================
          LEFT HAIR MASS
      ===================================================== */}

      <path
        className="left-hair"
        d="
          M 77 108

          C 67 105, 68 98, 77 94
          C 81 84, 92 75, 106 72
          C 122 68, 137 74, 148 84

          C 153 88, 157 94, 160 100

          C 154 100, 149 99, 144 96

          C 139 101, 134 103, 127 101

          C 119 100, 112 96, 106 91

          C 101 99, 94 104, 87 107

          C 83 109, 80 110, 77 108

          Z
        "
      />

      {/* Hair swept upper contour */}

      <path
        className="hair-detail"
        d="
          M 78 95
          C 91 88, 103 82, 114 81
          C 127 80, 140 85, 151 94
        "
      />

      <path
        className="hair-detail"
        d="
          M 83 101
          C 91 94, 98 88, 104 83
        "
      />

      <path
        className="hair-detail"
        d="
          M 90 105
          C 99 96, 105 89, 109 82
        "
      />

      <path
        className="hair-detail"
        d="
          M 101 103
          C 108 94, 112 87, 114 81
        "
      />

      <path
        className="hair-detail"
        d="
          M 114 100
          C 120 92, 123 86, 123 81
        "
      />

      <path
        className="hair-detail"
        d="
          M 126 101
          C 133 95, 136 89, 136 84
        "
      />

      {/* Loose hair strand at left */}

      <path
        className="hair-detail"
        d="
          M 79 99
          C 72 105, 70 112, 72 120
        "
      />

      <path
        className="hair-secondary"
        d="
          M 75 108
          C 70 113, 69 120, 71 128
        "
      />

      {/* =====================================================
          LEFT EAR / SIDE DETAIL
      ===================================================== */}

      <path
        className="person-detail"
        d="
          M 75 137
          C 71 135, 69 138, 71 142
          C 73 146, 77 147, 80 145
        "
      />

      {/* =====================================================
          LEFT EYE
      ===================================================== */}

      <path
        className="eye-line"
        d="
          M 107 136
          C 111 134, 116 134, 119 137
        "
      />

      <path
        className="eye-dot"
        d="M 114 136 L 114 138"
      />

      {/* Left nose / profile detail */}

      <path
        className="person-detail"
        d="
          M 143 141
          C 147 143, 151 145, 153 149
          C 155 152, 153 154, 150 154
        "
      />

      {/* Left mouth */}

      <path
        className="person-detail"
        d="
          M 136 165
          C 139 166, 142 166, 145 164
        "
      />

      {/* =====================================================
          RIGHT PERSON — NECK / SHOULDER
      ===================================================== */}

      <path
        className="person-outline"
        d="
          M 226 282

          C 229 262, 234 242, 244 226
          C 249 218, 255 212, 263 207
        "
      />

      <path
        className="person-outline-secondary"
        d="
          M 231 283
          C 234 263, 239 244, 248 228
          C 253 220, 258 215, 266 211
        "
      />

      {/* Right neck */}

      <path
        className="person-outline"
        d="
          M 263 208
          C 267 197, 268 187, 267 177
        "
      />

      <path
        className="person-outline-secondary"
        d="
          M 268 208
          C 272 197, 273 187, 272 177
        "
      />

      {/* =====================================================
          RIGHT FACE PROFILE
      ===================================================== */}

      <path
        className="right-face"
        d="
          M 267 94

          C 279 99, 288 111, 290 126

          C 293 142, 291 157, 286 169

          C 282 179, 276 188, 267 194

          C 257 199, 246 197, 238 190

          C 232 184, 228 176, 226 168

          C 225 162, 225 155, 228 150

          C 231 146, 233 142, 232 138

          C 230 135, 226 133, 224 130

          C 221 127, 222 123, 225 121

          C 228 119, 231 119, 235 120

          C 239 108, 248 98, 257 94

          C 261 92, 264 92, 267 94

          Z
        "
      />

      {/* Right face secondary trace */}

      <path
        className="face-secondary"
        d="
          M 264 98
          C 276 103, 284 113, 287 128
          C 290 143, 288 157, 283 168
          C 278 180, 272 187, 264 191
          C 254 196, 245 193, 238 187
        "
      />

      {/* =====================================================
          RIGHT HAIR
      ===================================================== */}

      <path
        className="right-hair"
        d="
          M 236 116

          C 237 100, 245 87, 258 80
          C 274 72, 292 75, 304 86

          C 313 95, 315 107, 315 120

          C 315 136, 320 149, 327 160

          C 333 171, 335 185, 332 198

          C 329 210, 322 219, 316 227

          C 315 211, 316 198, 312 185

          C 309 173, 303 163, 298 151

          C 295 142, 294 133, 295 123

          C 286 125, 276 124, 267 120

          C 256 116, 247 110, 241 103

          C 239 108, 238 112, 236 116

          Z
        "
      />

      {/* Hair swept front */}

      <path
        className="hair-detail"
        d="
          M 239 103
          C 250 110, 262 115, 275 117
          C 285 119, 292 119, 297 117
        "
      />

      <path
        className="hair-detail"
        d="
          M 244 94
          C 254 103, 266 108, 279 111
          C 287 113, 293 113, 298 111
        "
      />

      {/* Long right hair strands */}

      <path
        className="hair-detail"
        d="
          M 299 91
          C 310 103, 306 121, 311 139
          C 316 156, 324 166, 326 181
          C 329 197, 324 211, 318 223
        "
      />

      <path
        className="hair-detail"
        d="
          M 307 89
          C 319 102, 314 123, 319 142
          C 323 158, 332 171, 333 187
          C 335 202, 330 215, 324 227
        "
      />

      <path
        className="hair-detail"
        d="
          M 289 93
          C 298 104, 293 119, 297 134
          C 300 149, 307 159, 310 174
          C 313 189, 310 202, 305 213
        "
      />

      {/* Hair tied section */}

      <path
        className="hair-tie"
        d="
          M 272 143
          C 276 140, 282 141, 286 145
          C 290 149, 289 155, 285 159
          C 281 162, 275 160, 271 156
        "
      />

      <path
        className="hair-tie-secondary"
        d="
          M 275 144
          C 280 142, 285 145, 286 149
          C 287 153, 284 157, 281 158
        "
      />

      {/* =====================================================
          RIGHT EYE
      ===================================================== */}

      <path
        className="eye-line"
        d="
          M 249 137
          C 253 134, 258 134, 262 137
        "
      />

      <path
        className="eye-dot"
        d="M 255 136 L 255 138"
      />

      {/* Right nose */}

      <path
        className="person-detail"
        d="
          M 230 140
          C 226 142, 224 145, 225 148
          C 226 151, 229 153, 232 153
        "
      />

      {/* Right mouth */}

      <path
        className="person-detail"
        d="
          M 238 165
          C 241 166, 244 166, 247 164
        "
      />

      {/* =====================================================
          NOSE-TO-NOSE SMALL IMPERFECT MARK
      ===================================================== */}

      <path
        className="nose-contact"
        d="
          M 153 149
          C 161 148, 168 148, 176 150
        "
      />

      {/* =====================================================
          LOOSE INK / SKETCH MARKS
      ===================================================== */}

      <path
        className="loose-ink"
        d="M 87 83 C 91 80, 95 78, 99 77"
      />

      <path
        className="loose-ink"
        d="M 289 82 C 294 84, 298 87, 301 91"
      />

      <path
        className="loose-ink-light"
        d="M 116 183 C 119 185, 121 186, 124 186"
      />

      <path
        className="loose-ink-light"
        d="M 259 190 C 262 189, 264 187, 266 185"
      />
    </svg>
  );
}

export default CoupleLovePortraitIllustration;

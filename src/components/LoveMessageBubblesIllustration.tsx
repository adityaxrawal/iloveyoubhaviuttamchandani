import { useId } from "react";
import "./LoveMessageBubblesIllustration.css";

export interface LoveMessageBubblesIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function LoveMessageBubblesIllustration({
  size = 320,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn love message bubbles with a heart",
}: LoveMessageBubblesIllustrationProps) {
  const id = useId();
  const textureId = `message-paper-${id.replace(/:/g, "")}`;

  return (
    <svg
      className={`love-message-bubbles ${className}`}
      viewBox="0 0 400 220"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* Fixed seed keeps the paper texture deterministic. */}
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
            className="message-paper"
            x="0"
            y="0"
            width="400"
            height="220"
          />

          <rect
            className="message-paper-texture"
            x="0"
            y="0"
            width="400"
            height="220"
            filter={`url(#${textureId})`}
          />

          {/* Very subtle paper grid from the reference */}
          <g className="paper-grid">
            <path d="M 48 0 V 220" />
            <path d="M 116 0 V 220" />
            <path d="M 184 0 V 220" />
            <path d="M 252 0 V 220" />
            <path d="M 320 0 V 220" />
            <path d="M 388 0 V 220" />

            <path d="M 0 34 H 400" />
            <path d="M 0 94 H 400" />
            <path d="M 0 154 H 400" />
            <path d="M 0 214 H 400" />
          </g>
        </>
      )}

      {/* =====================================================
          LOWER MESSAGE BUBBLE
          This sits behind the upper bubble.
      ===================================================== */}

      <path
        className="bubble-fill lower-bubble-fill"
        d="
          M 102 72

          C 91 72, 79 76, 70 84
          C 61 92, 57 104, 57 119

          L 57 164

          C 57 177, 62 184, 73 186

          C 84 188, 98 187, 111 186

          L 107 207

          L 131 185

          L 205 184

          C 218 183, 225 175, 225 163

          L 225 112

          C 225 99, 220 88, 211 81

          C 202 74, 190 72, 177 72

          Z
        "
      />

      {/* Main lower bubble outline */}

      <path
        className="bubble-outline lower-bubble-outline"
        d="
          M 102 72

          C 91 72, 79 76, 70 84
          C 61 92, 57 104, 57 119

          L 57 164

          C 57 177, 62 184, 73 186

          C 84 188, 98 187, 111 186

          L 107 207

          L 131 185

          L 205 184

          C 218 183, 225 175, 225 163

          L 225 112

          C 225 99, 220 88, 211 81

          C 202 74, 190 72, 177 72
        "
      />

      {/* Secondary imperfect trace */}

      <path
        className="bubble-outline-secondary"
        d="
          M 101 75

          C 89 75, 79 79, 71 87
          C 64 95, 61 105, 61 118

          L 61 161

          C 61 173, 65 180, 75 182

          C 87 185, 99 184, 114 183

          L 111 199

          L 132 182

          L 202 181

          C 214 180, 221 173, 221 161
        "
      />

      {/* =====================================================
          LOWER BUBBLE INNER IMPERFECTIONS
      ===================================================== */}

      <path
        className="bubble-loose-mark"
        d="
          M 65 160
          C 65 166, 67 172, 72 175
        "
      />

      <path
        className="bubble-loose-mark"
        d="
          M 184 179
          C 195 180, 204 178, 211 174
        "
      />

      {/* =====================================================
          LOWER BUBBLE MESSAGE DOTS
      ===================================================== */}

      <g className="message-dots">
        {/* Row 1 */}
        <path d="M 94 113 C 98 112, 101 112, 104 113" />
        <path d="M 120 113 C 124 112, 127 112, 130 113" />
        <path d="M 146 113 C 150 112, 153 112, 156 113" />

        {/* Row 2 */}
        <path d="M 94 131 C 98 130, 101 130, 104 131" />
        <path d="M 120 131 C 124 130, 127 130, 130 131" />
        <path d="M 146 131 C 150 130, 153 130, 156 131" />

        {/* Row 3 */}
        <path d="M 94 149 C 98 148, 101 148, 104 149" />
        <path d="M 120 149 C 124 148, 127 148, 130 149" />
        <path d="M 146 149 C 150 148, 153 148, 156 149" />
      </g>

      {/* =====================================================
          UPPER LOVE MESSAGE BUBBLE
          This overlaps the lower bubble.
      ===================================================== */}

      <path
        className="bubble-fill upper-bubble-fill"
        d="
          M 163 12

          C 151 12, 145 18, 145 30

          L 145 105

          C 145 116, 151 122, 162 122

          L 236 122

          L 238 143

          L 254 123

          L 274 123

          C 286 123, 292 117, 292 105

          L 292 31

          C 292 18, 286 12, 274 12

          Z
        "
      />

      {/* Main upper bubble outline */}

      <path
        className="bubble-outline upper-bubble-outline"
        d="
          M 163 12

          C 151 12, 145 18, 145 30

          L 145 105

          C 145 116, 151 122, 162 122

          L 236 122

          L 238 143

          L 254 123

          L 274 123

          C 286 123, 292 117, 292 105

          L 292 31

          C 292 18, 286 12, 274 12

          Z
        "
      />

      {/* Secondary upper-bubble trace */}

      <path
        className="bubble-outline-secondary upper-bubble-secondary"
        d="
          M 165 16

          C 154 16, 149 21, 149 31

          L 149 103

          C 149 112, 154 118, 164 118

          L 239 118

          L 241 136

          L 254 119

          L 273 119

          C 282 119, 288 113, 288 104

          L 288 32

          C 288 22, 283 16, 273 16

          Z
        "
      />

      {/* =====================================================
          HEART INSIDE UPPER BUBBLE
      ===================================================== */}

      <path
        className="bubble-heart"
        d="
          M 218 73

          C 211 66, 199 54, 199 44

          C 199 35, 205 29, 212 29

          C 219 29, 224 34, 225 41

          C 227 34, 233 29, 240 30

          C 248 31, 253 38, 252 46

          C 251 56, 238 67, 225 78

          Z
        "
      />

      {/* Heart secondary ink edge */}

      <path
        className="bubble-heart-secondary"
        d="
          M 220 74

          C 212 66, 202 55, 202 45
          C 202 37, 207 32, 213 32
          C 220 32, 224 37, 225 43

          C 227 37, 232 32, 239 33
          C 246 34, 250 40, 249 47

          C 247 56, 237 66, 225 75
        "
      />

      {/* Small worn highlight inside heart */}

      <path
        className="heart-worn-mark"
        d="M 208 39 C 209 37, 211 36, 213 36"
      />

      {/* =====================================================
          UPPER BUBBLE LOOSE INK DETAILS
      ===================================================== */}

      <path
        className="bubble-loose-mark"
        d="
          M 153 23
          C 157 18, 165 16, 173 16
        "
      />

      <path
        className="bubble-loose-mark"
        d="
          M 264 118
          C 271 118, 278 115, 282 110
        "
      />
    </svg>
  );
}

export default LoveMessageBubblesIllustration;

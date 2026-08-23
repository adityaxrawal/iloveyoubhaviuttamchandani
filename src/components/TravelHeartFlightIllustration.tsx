import { useId } from "react";
import "./TravelHeartFlightIllustration.css";

export interface TravelHeartFlightIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function TravelHeartFlightIllustration({
  size = 360,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn heart flight path and airplane",
}: TravelHeartFlightIllustrationProps) {
  const id = useId();

  const textureId = `travel-heart-paper-${id.replace(/:/g, "")}`;
  const heartClipId = `travel-heart-clip-${id.replace(/:/g, "")}`;

  /*
   * IMPORTANT:
   *
   * This is intentionally NOT a mathematical heart.
   * The left lobe is narrower/taller and the right lobe is
   * slightly wider. The bottom point is displaced left.
   */
  const heartPath = `
    M 118 135

    C 104 125, 89 111, 82 96
    C 75 81, 78 65, 89 57
    C 100 49, 113 52, 120 62

    C 125 52, 137 47, 148 52
    C 161 58, 164 72, 160 85

    C 155 102, 142 116, 128 128
    C 123 132, 120 134, 118 135

    Z
  `;

  return (
    <svg
      className={`travel-heart-flight ${className}`}
      width={size}
      height={size}
      viewBox="0 0 400 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* =====================================================
            PAPER TEXTURE

            Fixed seed makes this deterministic.
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
            seed="43"
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

        {/* =====================================================
            HEART INTERIOR CLIP
        ===================================================== */}

        <clipPath id={heartClipId}>
          <path d={heartPath} />
        </clipPath>
      </defs>

      {/* =====================================================
          PAPER
      ===================================================== */}

      {showPaper && (
        <>
          <rect
            className="travel-paper"
            x="0"
            y="0"
            width="400"
            height="260"
          />

          <rect
            className="travel-paper-texture"
            x="0"
            y="0"
            width="400"
            height="260"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          HEART
      ===================================================== */}

      {/* Very subtle interior */}
      <path
        className="travel-heart-fill"
        d={heartPath}
      />

      {/* Main imperfect heart outline */}
      <path
        className="travel-heart-outline"
        d={heartPath}
      />

      {/* Secondary imperfect trace */}
      <path
        className="travel-heart-outline-secondary"
        d="
          M 116 137

          C 101 127, 87 113, 79 98
          C 72 82, 75 66, 87 56
          C 99 47, 113 51, 121 61

          C 126 51, 138 46, 150 51
          C 163 57, 166 71, 162 86

          C 157 103, 143 118, 128 130
          C 122 134, 118 136, 116 137
        "
      />

      {/* =====================================================
          HEART HATCHING
          Kept very subtle because the reference heart is
          primarily an outline/flight-path motif.
      ===================================================== */}

      <g
        className="travel-heart-hatching"
        clipPath={`url(#${heartClipId})`}
      >
        <path d="M 83 69 L 121 111" />
        <path d="M 80 82 L 125 124" />
        <path d="M 87 98 L 116 127" />

        <path d="M 112 58 L 143 91" />
        <path d="M 124 55 L 154 87" />
        <path d="M 130 72 L 153 96" />
        <path d="M 126 91 L 145 110" />
      </g>

      {/* =====================================================
          HEART / FLIGHT-PATH CONNECTION
      ===================================================== */}

      <path
        className="flight-path flight-path-heart"
        d="
          M 118 135
          C 130 140, 145 143, 159 139
          C 171 136, 181 129, 191 121
        "
      />

      {/* =====================================================
          DASHED FLIGHT PATH BEFORE HEART
      ===================================================== */}

      <path
        className="flight-path"
        d="
          M 19 194
          C 43 206, 67 207, 88 199
          C 103 193, 113 184, 118 171
          C 121 161, 119 151, 112 145
        "
      />

      {/* Explicit irregular dashed segments */}

      <g className="flight-dashes">
        <path d="M 19 194 L 31 199" />
        <path d="M 42 203 L 54 205" />
        <path d="M 64 204 L 76 202" />
        <path d="M 83 198 L 92 194" />
        <path d="M 98 190 L 105 184" />
        <path d="M 110 176 L 114 168" />

        {/* Tiny continuation around the heart */}
        <path d="M 112 145 L 117 141" />
        <path d="M 124 137 L 132 140" />
        <path d="M 143 142 L 152 141" />
        <path d="M 160 138 L 168 134" />
        <path d="M 176 130 L 183 125" />
      </g>

      {/* =====================================================
          AIRPLANE
          Main fuselage
      ===================================================== */}

      <g className="airplane">
        {/* Main fuselage */}

        <path
          className="airplane-outline"
          d="
            M 184 119

            C 199 116, 215 112, 231 106
            C 248 100, 265 94, 279 91

            C 291 89, 300 90, 304 94
            C 307 98, 303 103, 296 106

            C 285 111, 268 113, 251 114
            C 234 115, 218 115, 204 116

            L 188 123

            C 185 124, 182 122, 184 119

            Z
          "
        />

        {/* Secondary fuselage trace */}

        <path
          className="airplane-secondary"
          d="
            M 185 121
            C 202 117, 218 113, 233 108
            C 250 102, 267 97, 280 94
            C 291 92, 298 93, 302 96
            C 299 101, 289 104, 281 106
            C 263 110, 246 112, 228 112
            L 203 114
            L 188 122
          "
        />

        {/* =====================================================
            UPPER WING
        ===================================================== */}

        <path
          className="airplane-outline"
          d="
            M 231 106

            L 208 75

            C 205 72, 207 69, 211 70

            L 223 73
            L 248 101
          "
        />

        <path
          className="airplane-secondary"
          d="
            M 229 108
            L 210 77
            L 220 76
            L 244 102
          "
        />

        {/* =====================================================
            LOWER WING
        ===================================================== */}

        <path
          className="airplane-outline"
          d="
            M 238 115

            L 222 157

            C 220 162, 216 164, 214 161

            L 217 117
          "
        />

        <path
          className="airplane-secondary"
          d="
            M 235 116
            L 220 158
            L 219 118
          "
        />

        {/* =====================================================
            TAIL / LEFT FIN
        ===================================================== */}

        <path
          className="airplane-outline"
          d="
            M 190 119

            L 172 108
            C 168 106, 165 108, 168 111

            L 179 121

            L 168 132

            C 165 135, 168 137, 172 135

            L 190 124
          "
        />

        {/* Tail secondary trace */}

        <path
          className="airplane-secondary"
          d="
            M 188 121
            L 171 111
            L 181 122
            L 171 132
            L 188 123
          "
        />

        {/* =====================================================
            COCKPIT
        ===================================================== */}

        <path
          className="airplane-detail"
          d="
            M 280 95
            C 286 94, 292 94, 296 96
          "
        />

        <path
          className="airplane-detail"
          d="M 292 99 L 296 98"
        />

        {/* Small fuselage mark */}

        <path
          className="airplane-detail"
          d="
            M 258 110
            C 265 108, 272 107, 278 105
          "
        />

        {/* Tiny imperfect line */}

        <path
          className="airplane-loose-mark"
          d="M 244 113 L 249 111"
        />
      </g>

      {/* =====================================================
          SMALL LOOSE INK FRAGMENTS
      ===================================================== */}

      <path
        className="loose-ink"
        d="M 151 135 C 155 136, 158 136, 161 135"
      />

      <path
        className="loose-ink-light"
        d="M 185 126 L 190 123"
      />
    </svg>
  );
}

export default TravelHeartFlightIllustration;

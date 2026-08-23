import { useId } from "react";
import "./TravelLoveIllustration.css";

export interface TravelLoveIllustrationProps {
  size?: number | string;
  className?: string;
  showPaper?: boolean;
  ariaLabel?: string;
}

export function TravelLoveIllustration({
  size = 320,
  className = "",
  showPaper = true,
  ariaLabel = "Hand-drawn airplane flying toward travel tickets with a heart",
}: TravelLoveIllustrationProps) {
  const id = useId();
  const textureId = `travel-paper-${id.replace(/:/g, "")}`;

  /*
   * Small heart above the airplane.
   *
   * Deliberately asymmetric:
   * - left lobe slightly narrower
   * - right lobe slightly rounder
   * - point slightly left of centre
   */
  const heartPath = `
    M 197 83

    C 193 79, 187 74, 186 69
    C 185 65, 188 61, 192 61
    C 196 61, 199 64, 199 68

    C 201 64, 205 61, 209 62
    C 213 63, 215 67, 214 71

    C 213 76, 207 81, 198 88

    C 198 87, 198 85, 197 83

    Z
  `;

  return (
    <svg
      className={`travel-love-illustration ${className}`}
      viewBox="0 0 400 430"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* =====================================================
            FIXED PAPER TEXTURE
            No external image and deterministic because the
            turbulence seed is fixed.
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
            seed="19"
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
            className="travel-paper"
            x="0"
            y="0"
            width="400"
            height="430"
          />

          <rect
            className="travel-paper-texture"
            x="0"
            y="0"
            width="400"
            height="430"
            filter={`url(#${textureId})`}
          />
        </>
      )}

      {/* =====================================================
          FLIGHT PATH
      ===================================================== */}

      <path
        className="flight-path"
        d="
          M 13 260
          C 40 269, 63 266, 82 253
          C 101 240, 107 221, 98 208
          C 90 196, 76 194, 69 203
          C 62 212, 67 224, 76 230
          C 87 238, 103 237, 118 228
          C 133 219, 143 207, 151 195
        "
      />

      {/* Slightly imperfect second fragment */}

      <path
        className="flight-path flight-path-secondary"
        d="
          M 12 264
          C 38 273, 63 270, 83 257
          C 102 244, 110 225, 101 211
        "
      />

      {/* =====================================================
          FLIGHT-PATH DASHES
          Explicitly authored rather than generated.
      ===================================================== */}

      <g className="flight-path-dashes">
        <path d="M 12 260 L 25 264" />
        <path d="M 34 266 L 47 267" />
        <path d="M 57 265 L 68 261" />

        <path d="M 80 254 L 87 248" />
        <path d="M 96 238 L 101 229" />

        <path d="M 68 203 L 72 199" />

        <path d="M 77 230 L 87 233" />
        <path d="M 100 235 L 111 232" />

        <path d="M 119 227 L 128 221" />
        <path d="M 136 212 L 143 204" />

        <path d="M 146 198 L 152 190" />
      </g>

      {/* =====================================================
          HEART ABOVE AIRPLANE
      ===================================================== */}

      <path
        className="travel-heart"
        d={heartPath}
      />

      <path
        className="travel-heart-edge"
        d="
          M 197 84
          C 192 79, 185 74, 185 69
          C 184 64, 188 60, 192 60
          C 196 60, 199 63, 200 67
          C 202 63, 206 60, 210 61
          C 215 62, 217 66, 216 71
          C 214 77, 207 82, 198 89
        "
      />

      {/* =====================================================
          AIRPLANE
          Hand-drawn silhouette made from explicit paths.
      ===================================================== */}

      <g className="airplane">
        {/* Main fuselage */}

        <path
          className="airplane-outline"
          d="
            M 177 137

            C 193 133, 211 127, 229 121
            C 247 115, 265 110, 281 111

            C 293 111, 302 114, 303 119
            C 304 124, 295 128, 284 130

            C 266 133, 246 134, 228 134

            L 203 136

            L 181 145

            C 176 147, 171 144, 169 141

            Z
          "
        />

        {/* Nose contour */}

        <path
          className="airplane-detail"
          d="
            M 281 111
            C 289 112, 297 114, 301 117
            C 304 120, 301 123, 296 125
          "
        />

        {/* Upper wing */}

        <path
          className="airplane-outline"
          d="
            M 228 126
            L 207 96
            C 205 93, 207 91, 211 92

            L 220 94
            L 247 119
          "
        />

        {/* Lower wing */}

        <path
          className="airplane-outline"
          d="
            M 234 134
            L 218 170
            C 216 175, 211 177, 209 174

            L 213 136
          "
        />

        {/* Tail fin */}

        <path
          className="airplane-outline"
          d="
            M 181 137
            L 166 125
            C 162 122, 159 124, 161 128

            L 170 140

            L 159 151
            C 156 154, 159 156, 163 154

            L 181 145
          "
        />

        {/* Small horizontal stabilizer */}

        <path
          className="airplane-outline"
          d="
            M 179 136
            L 164 132
            C 160 131, 158 133, 161 136

            L 173 142
          "
        />

        {/* Cockpit */}

        <path
          className="airplane-detail"
          d="
            M 283 116
            C 286 115, 290 115, 292 117
          "
        />

        {/* Tiny window */}

        <path
          className="airplane-window"
          d="M 294 117 L 297 117"
        />

        {/* Small body detail */}

        <path
          className="airplane-detail"
          d="M 244 132 C 252 130, 261 129, 270 128"
        />
      </g>

      {/* =====================================================
          AIRPLANE SECOND TRACE
      ===================================================== */}

      <path
        className="airplane-secondary"
        d="
          M 176 139
          C 194 135, 212 129, 230 123
          C 248 117, 266 112, 281 113

          C 291 113, 299 115, 301 119

          C 297 124, 287 127, 279 128

          C 260 131, 243 132, 226 132

          L 202 135

          L 181 143
        "
      />

      {/* =====================================================
          TICKET STACK SHADOW
      ===================================================== */}

      <path
        className="ticket-shadow"
        d="
          M 145 337
          C 169 330, 220 329, 273 337
          C 286 339, 292 345, 285 349
          C 257 357, 196 357, 153 350
          C 142 348, 137 343, 145 337
          Z
        "
      />

      {/* =====================================================
          BACK TICKET
      ===================================================== */}

      <path
        className="ticket ticket-back"
        d="
          M 151 273

          L 278 267
          L 281 284

          C 276 286, 276 291, 281 294

          L 284 333

          L 157 339

          L 154 321

          C 159 319, 158 314, 153 311

          Z
        "
      />

      {/* Back ticket inner border */}

      <path
        className="ticket-detail"
        d="
          M 163 284
          L 270 279
          L 274 324
          L 166 330
          Z
        "
      />

      {/* Back ticket divider */}

      <path
        className="ticket-detail"
        d="M 174 282 L 178 331"
      />

      <path
        className="ticket-detail"
        d="M 252 279 L 256 326"
      />

      {/* =====================================================
          FRONT TICKET
      ===================================================== */}

      <path
        className="ticket ticket-front"
        d="
          M 143 232

          L 274 219
          L 278 237

          C 272 239, 273 245, 278 248

          L 281 293

          C 276 295, 277 300, 282 303

          L 284 319

          L 154 329

          L 151 311

          C 156 309, 155 304, 150 301

          L 146 256

          C 151 254, 150 249, 145 247

          Z
        "
      />

      {/* Front ticket inner border */}

      <path
        className="ticket-detail"
        d="
          M 154 245
          L 266 234
          L 271 303
          L 160 313
          Z
        "
      />

      {/* Ticket left perforation */}

      <path
        className="ticket-detail"
        d="
          M 170 242
          L 175 313
        "
      />

      {/* Ticket right perforation */}

      <path
        className="ticket-detail"
        d="
          M 252 237
          L 257 305
        "
      />

      {/* =====================================================
          TICKET PRINTING / DETAILS
      ===================================================== */}

      <g className="ticket-print">
        {/* top-left tiny text-like marks */}
        <path d="M 180 248 L 194 247" />
        <path d="M 181 252 L 190 251" />
        <path d="M 194 247 L 201 246" />

        {/* top-right marks */}
        <path d="M 236 241 L 244 240" />
        <path d="M 239 245 L 249 244" />

        {/* bottom-left marks */}
        <path d="M 183 303 L 197 302" />
        <path d="M 183 307 L 192 306" />

        {/* bottom-right marks */}
        <path d="M 235 296 L 247 295" />
        <path d="M 239 300 L 251 299" />
      </g>

      {/* =====================================================
          HEART PRINTED ON FRONT TICKET
      ===================================================== */}

      <path
        className="ticket-heart"
        d="
          M 208 274

          C 203 270, 196 264, 196 259
          C 196 255, 199 252, 203 253
          C 207 253, 209 256, 209 259

          C 211 255, 214 253, 218 254
          C 222 255, 224 259, 223 263

          C 222 268, 216 273, 209 279

          Z
        "
      />

      {/* =====================================================
          SECOND SMALL HEART ON LOWER TICKET
      ===================================================== */}

      <path
        className="ticket-heart ticket-heart-lower"
        d="
          M 208 308

          C 204 305, 198 301, 198 297
          C 198 294, 201 292, 204 293
          C 207 293, 209 296, 209 298

          C 210 295, 213 293, 216 294
          C 220 295, 221 298, 220 301

          C 219 304, 214 308, 209 312

          Z
        "
      />

      {/* =====================================================
          LOOSE TICKET STROKES
      ===================================================== */}

      <path
        className="ticket-loose-stroke"
        d="M 143 235 C 141 239, 142 244, 146 247"
      />

      <path
        className="ticket-loose-stroke"
        d="M 281 293 C 285 296, 284 301, 281 303"
      />

      <path
        className="ticket-loose-stroke"
        d="M 154 327 C 169 330, 185 329, 198 328"
      />
    </svg>
  );
}

export default TravelLoveIllustration;

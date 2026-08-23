import { memo, useId, type CSSProperties, type FC } from "react";

/**
 * A drawn rose — five outer petals, five inner, a spiral heart and a
 * leafed stem. Replaces the old box-shadow pixel sprite: same idea, but
 * it stays crisp at any size and actually reads as a rose.
 */

const OUTER = [0, 72, 144, 216, 288];
const INNER = [36, 108, 180, 252, 324];
/** teardrop petal: pointed at the base, full and slightly squared at the tip */
const PETAL =
  "M0 0C-2.2-3.4-7.4-5-7.4-8.6-7.4-12.2-4.2-14.8 0-14.8S7.4-12.2 7.4-8.6C7.4-5 2.2-3.4 0 0Z";
/** the coiled bud at the heart of the flower */
const BUD =
  "M-5.6-1.2C-5.6-4.6-2.9-7-.2-7 2.9-7 5.2-4.6 5.2-1.6 5.2 1 3.2 2.8.8 2.8-1.5 2.8-3.2 1.2-3.2-.8-3.2-2.6-1.8-3.8-.2-3.8 1.2-3.8 2.2-2.9 2.4-1.7";

interface RoseProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const Rose: FC<RoseProps> = memo(
  ({ size = 34, className = "", style }) => {
    // unique gradient ids so several roses on screen don't collide
    const reactId = useId();
    const id = `rose-${reactId.replace(/:/g, "")}`;

    return (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="-18 -21 36 47"
        width={size}
        height={(size * 47) / 36}
        className={className}
        style={style}
      >
        <defs>
          <radialGradient id={`${id}-p`} cx="50%" cy="74%" r="72%">
            <stop offset="0%" stopColor="#D6394A" />
            <stop offset="58%" stopColor="#B01526" />
            <stop offset="100%" stopColor="#7E0A18" />
          </radialGradient>
          <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5B8A4E" />
            <stop offset="100%" stopColor="#2F5A32" />
          </linearGradient>
        </defs>

        {/* stem + leaves */}
        {/* the bloom's lower petals reach to y≈11, so the stem and leaves
            start below that or they vanish behind the flower */}
        <path
          d="M0 9c.7 6 .5 11-.4 15"
          fill="none"
          stroke="#3C6B3B"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M-.6 19C-5.4 18.4-9 15.4-10 11.4-5.4 10.8-1.4 13.2-.6 19z"
          fill={`url(#${id}-l)`}
        />
        <path
          d="M.6 24.2C5.4 23.6 9 20.6 10 16.6 5.4 16 1.4 18.4.6 24.2z"
          fill={`url(#${id}-l)`}
          opacity=".9"
        />

        {/* bloom */}
        <g transform="translate(0 -4)">
          {OUTER.map((a) => (
            <path
              key={a}
              transform={`rotate(${a})`}
              d={PETAL}
              fill={`url(#${id}-p)`}
            />
          ))}
          {INNER.map((a) => (
            <path
              key={a}
              transform={`rotate(${a}) scale(.66)`}
              d={PETAL}
              fill="#96101F"
            />
          ))}
          {/* coiled bud at the heart */}
          <path d={BUD} fill="#7E0A18" transform="translate(0 -1)" />
          <path
            d={BUD}
            fill="none"
            stroke="#DE6070"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity=".55"
            transform="translate(0 -1)"
          />
        </g>
      </svg>
    );
  },
);

Rose.displayName = "Rose";

/** A single loose petal — what falls away from the bloom on click. */
export const Petal: FC<RoseProps> = memo(
  ({ size = 12, className = "", style }) => (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="-8.5 -15.5 17 17"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      <path d={PETAL} fill="#B01526" />
      <path
        d="M0-13.8C0-9 0-4.6 0-.9"
        fill="none"
        stroke="#7E0A18"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  ),
);

Petal.displayName = "Petal";

export default Rose;

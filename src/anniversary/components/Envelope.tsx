import { FINE, sketch } from "../lib/rough";
import Marks from "./Marks";
import s from "./Envelope.module.css";

const VIEW_BOX = "0 0 340 232";

/**
 * Cream envelope, flap open, sealed with red wax.
 *
 * The paper edges are sketched so the folds read as creased card rather than
 * vector; the wax stays smooth, because poured wax is smooth and the mockup
 * photographs it that way.
 */
export default function Envelope({ className = "" }: { className?: string }) {
  const paper = sketch(
    "envelope",
    VIEW_BOX,
    [
      /* open flap, standing up behind the body */
      {
        d: "M40 96 168 6 300 96 300 104 168 40 40 104Z",
        fill: "url(#am-env-flap)",
        fillStyle: "solid",
        stroke: "#D6C4A2",
        strokeWidth: 1.4,
      },
      { d: "M40 96 168 6 300 96", stroke: "#DACAA9", strokeWidth: 1.2 },
      /* body */
      {
        d: "M34 92h272a6 6 0 0 1 6 6v122a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V98a6 6 0 0 1 6-6z",
        fill: "url(#am-env-body)",
        fillStyle: "solid",
        stroke: "#D2BF9C",
        strokeWidth: 1.5,
      },
      /* the two folds meeting in the middle of the front */
      { d: "M28 100 170 176 312 100M28 220 132 152M312 220 208 152", stroke: "#D8C7A6", strokeWidth: 1.4 },
    ],
    { ...FINE, wobble: 0.7 },
  );

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={VIEW_BOX}
      className={`${s.env} ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="am-env-body" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#FBF3E4" />
          <stop offset="100%" stopColor="#E8D9BC" />
        </linearGradient>
        <linearGradient id="am-env-flap" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#FDF8ED" />
          <stop offset="100%" stopColor="#F0E3CA" />
        </linearGradient>
        <radialGradient id="am-wax" cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#B8202C" />
          <stop offset="55%" stopColor="#8E1119" />
          <stop offset="100%" stopColor="#5E0810" />
        </radialGradient>
        <filter id="am-wax-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="2.5"
            stdDeviation="3"
            floodColor="#3B0710"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      <Marks marks={paper} />

      {/* wax seal */}
      <g filter="url(#am-wax-shadow)" transform="translate(170 150)">
        <path
          d="M-1.4-31c9-1.6 17 1 23.8 5.6 6 4 10.4 7.4 12.6 13.6 2.2 6.2 1 12-1.4 18.4-2.4 6.4-4 12.6-9.6 17-5.8 4.6-13 6.6-20.6 6.2-8-.4-15.6-2.4-21.4-7.6-5.6-5-8-12.2-9.2-19.4-1.2-7.6-1.4-15 2.4-21.4C-20.6-25-11.4-29.2-1.4-31z"
          fill="url(#am-wax)"
        />
        {/* pressed rim: a lighter lip catching the light */}
        <path
          d="M-1.4-31c9-1.6 17 1 23.8 5.6 6 4 10.4 7.4 12.6 13.6 2.2 6.2 1 12-1.4 18.4-2.4 6.4-4 12.6-9.6 17-5.8 4.6-13 6.6-20.6 6.2-8-.4-15.6-2.4-21.4-7.6-5.6-5-8-12.2-9.2-19.4-1.2-7.6-1.4-15 2.4-21.4C-20.6-25-11.4-29.2-1.4-31z"
          fill="none"
          stroke="#D4525C"
          strokeWidth="1.3"
          opacity=".45"
        />
        {/* stamped inset: a slightly smaller ring reading as depth */}
        <path
          d="M-1-24c7-1.2 13.4.8 18.8 4.4 4.8 3.2 8.2 5.8 10 10.8 1.7 4.9.8 9.5-1.1 14.6-1.9 5-3.2 10-7.6 13.4-4.6 3.6-10.3 5.2-16.3 4.9-6.3-.3-12.3-1.9-16.9-6-4.4-4-6.3-9.6-7.3-15.3C-22.3-3-22.4-8.8-19.4-14c3.1-5.3 10.4-8.6 18.4-10z"
          fill="none"
          stroke="#4E060E"
          strokeWidth="2"
          opacity=".35"
        />
        {/* the heart pressed into the wax */}
        <path
          d="M0 16C-11.4 6.6-17.6.6-17.6-6.8c0-4.6 3.6-8.2 8.2-8.2 3.2 0 6 1.8 9.4 5.4 3.4-3.6 6.2-5.4 9.4-5.4 4.6 0 8.2 3.6 8.2 8.2C17.6.6 11.4 6.6 0 16z"
          fill="#5E0810"
          opacity=".55"
        />
        <path
          d="M0 13.4C-9.6 5.6-15-.2-15-6.6c0-3.8 3-6.8 6.8-6.8 2.7 0 5 1.5 8.2 4.7 3.2-3.2 5.5-4.7 8.2-4.7 3.8 0 6.8 3 6.8 6.8C15-.2 9.6 5.6 0 13.4z"
          fill="#A6141E"
          opacity=".85"
        />
      </g>
    </svg>
  );
}

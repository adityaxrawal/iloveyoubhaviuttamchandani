import React from 'react';

export function Postmark() {
  return (
    <svg
      viewBox="0 0 90 80"
      width="76"
      height="68"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.72 }}
    >
      {/* Outer circle */}
      <circle cx="40" cy="40" r="36" fill="none" stroke="#c0392b" strokeWidth="2.2" />

      {/* Cancellation wavy lines — extending right through and beyond circle */}
      <clipPath id="pmclip">
        <rect x="36" y="2" width="54" height="76" />
      </clipPath>

      <g>
        <path
          d="M 36 20 Q 50 25 62 20 Q 74 15 88 20"
          fill="none"
          stroke="#c0392b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 36 29 Q 50 34 62 29 Q 74 24 88 29"
          fill="none"
          stroke="#c0392b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 36 38 Q 50 43 62 38 Q 74 33 88 38"
          fill="none"
          stroke="#c0392b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 36 47 Q 50 52 62 47 Q 74 42 88 47"
          fill="none"
          stroke="#c0392b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 36 56 Q 50 61 62 56 Q 74 51 88 56"
          fill="none"
          stroke="#c0392b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>

      {/* Second outer ring for classic postmark look */}
      <circle cx="40" cy="40" r="30" fill="none" stroke="#c0392b" strokeWidth="1" strokeDasharray="2 3" />
    </svg>
  );
}

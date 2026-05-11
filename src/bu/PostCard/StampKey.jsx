import React from 'react';

export function StampKey() {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        viewBox="0 0 90 105"
        width="90"
        height="105"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Stamp background */}
        <rect x="1" y="1" width="88" height="103" fill="#fdf3e7" rx="1" />

        {/* Perforated border effect - top edge holes */}
        {[6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86].map((x) => (
          <circle key={`t${x}`} cx={x} cy={1} r={3.5} fill="#d6c9b6" />
        ))}
        {/* Bottom edge holes */}
        {[6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86].map((x) => (
          <circle key={`b${x}`} cx={x} cy={104} r={3.5} fill="#d6c9b6" />
        ))}
        {/* Left edge holes */}
        {[6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94].map((y) => (
          y <= 104 ? <circle key={`l${y}`} cx={1} cy={y} r={3.5} fill="#d6c9b6" /> : null
        ))}
        {/* Right edge holes */}
        {[6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94].map((y) => (
          y <= 104 ? <circle key={`r${y}`} cx={89} cy={y} r={3.5} fill="#d6c9b6" /> : null
        ))}

        {/* Red border inside perforations */}
        <rect x="5" y="5" width="80" height="95" fill="none" stroke="#c0392b" strokeWidth="2" rx="1" />

        {/* Art area background */}
        <rect x="6" y="6" width="78" height="82" fill="#fdf3e7" />

        {/* Left sprig */}
        <path d="M 22 70 Q 16 57 18 44" stroke="#8faa7a" strokeWidth="1.5" fill="none" />
        <ellipse cx="14" cy="50" rx="6" ry="3.5" fill="#8faa7a" transform="rotate(-35 14 50)" />
        <ellipse cx="12" cy="60" rx="5.5" ry="3" fill="#8faa7a" transform="rotate(-20 12 60)" />
        <ellipse cx="15" cy="67" rx="5" ry="3" fill="#8faa7a" transform="rotate(-10 15 67)" />

        {/* Right sprig */}
        <path d="M 68 70 Q 74 57 72 44" stroke="#8faa7a" strokeWidth="1.5" fill="none" />
        <ellipse cx="76" cy="50" rx="6" ry="3.5" fill="#8faa7a" transform="rotate(35 76 50)" />
        <ellipse cx="78" cy="60" rx="5.5" ry="3" fill="#8faa7a" transform="rotate(20 78 60)" />
        <ellipse cx="75" cy="67" rx="5" ry="3" fill="#8faa7a" transform="rotate(10 75 67)" />

        {/* Skeleton key — vertical, centered */}
        {/* Key bow (circle at top) */}
        <circle cx="45" cy="30" r="13" fill="none" stroke="#c0392b" strokeWidth="3" />
        {/* Key bow inner hole */}
        <circle cx="45" cy="30" r="5.5" fill="#fdf3e7" stroke="#c0392b" strokeWidth="2" />
        {/* Key stem */}
        <rect x="43" y="42" width="4" height="28" fill="#c0392b" rx="1" />
        {/* Key teeth */}
        <rect x="47" y="53" width="7" height="3.5" fill="#c0392b" rx="1" />
        <rect x="47" y="61" width="6" height="3.5" fill="#c0392b" rx="1" />
        <rect x="47" y="68" width="5" height="3" fill="#c0392b" rx="1" />

        {/* Heart-shaped padlock overlapping the key bow */}
        <path
          d="M 45 48 C 45 48 33 41 33 32 C 33 26 38 23 41 27 C 42.5 28.5 44 31 45 32 C 46 31 47.5 28.5 49 27 C 52 23 57 26 57 32 C 57 41 45 48 45 48 Z"
          fill="#e57373"
          opacity="0.92"
        />
        {/* Shackle (U-arch on top of padlock) */}
        <path
          d="M 40 29 C 40 23 50 23 50 29"
          fill="none"
          stroke="#c0392b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Tiny corner hearts - top left */}
        <path
          d="M 17 17 C 17 14.5 13.5 14.5 13.5 17 C 13.5 19.5 17 22 17 22 C 17 22 20.5 19.5 20.5 17 C 20.5 14.5 17 14.5 17 17 Z"
          fill="#f48fb1"
        />
        {/* Tiny corner hearts - top right */}
        <path
          d="M 73 17 C 73 14.5 69.5 14.5 69.5 17 C 69.5 19.5 73 22 73 22 C 73 22 76.5 19.5 76.5 17 C 76.5 14.5 73 14.5 73 17 Z"
          fill="#f48fb1"
        />

        {/* POSTAGE label */}
        <text
          x="45"
          y="96"
          fontFamily="'Playfair Display', serif"
          fontSize="7.5"
          fill="#c0392b"
          textAnchor="middle"
          letterSpacing="1.8"
          fontWeight="400"
        >
          POSTAGE
        </text>
      </svg>
    </div>
  );
}

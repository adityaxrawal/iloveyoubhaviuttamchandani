import React from 'react';

export function StampHeart() {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Perforated stamp border using SVG */}
      <svg
        viewBox="0 0 90 105"
        width="90"
        height="105"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Stamp background with border */}
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

        {/* Left sprig — curved stem + leaves */}
        <path d="M 24 68 Q 17 55 19 42" stroke="#8faa7a" strokeWidth="1.5" fill="none" />
        <ellipse cx="15" cy="48" rx="6" ry="3.5" fill="#8faa7a" transform="rotate(-35 15 48)" />
        <ellipse cx="13" cy="58" rx="6" ry="3.5" fill="#8faa7a" transform="rotate(-20 13 58)" />
        <ellipse cx="17" cy="65" rx="5" ry="3" fill="#8faa7a" transform="rotate(-10 17 65)" />

        {/* Right sprig — mirror */}
        <path d="M 66 68 Q 73 55 71 42" stroke="#8faa7a" strokeWidth="1.5" fill="none" />
        <ellipse cx="75" cy="48" rx="6" ry="3.5" fill="#8faa7a" transform="rotate(35 75 48)" />
        <ellipse cx="77" cy="58" rx="6" ry="3.5" fill="#8faa7a" transform="rotate(20 77 58)" />
        <ellipse cx="73" cy="65" rx="5" ry="3" fill="#8faa7a" transform="rotate(10 73 65)" />

        {/* Back-left small pink heart */}
        <path
          d="M 27 50 C 27 43 20 43 20 50 C 20 56 27 62 27 62 C 27 62 34 56 34 50 C 34 43 27 43 27 50 Z"
          fill="#f48fb1"
          opacity="0.85"
        />

        {/* Back-right small pink heart */}
        <path
          d="M 63 50 C 63 43 56 43 56 50 C 56 56 63 62 63 62 C 63 62 70 56 70 50 C 70 43 63 43 63 50 Z"
          fill="#f48fb1"
          opacity="0.85"
        />

        {/* Main large deep-red heart (front center) */}
        <path
          d="M 45 68 C 45 68 22 52 22 38 C 22 27 32 23 38 30 C 40 32 43 36 45 38 C 47 36 50 32 52 30 C 58 23 68 27 68 38 C 68 52 45 68 45 68 Z"
          fill="#c0392b"
        />

        {/* Small floating hearts above */}
        <path
          d="M 30 28 C 30 25.5 26.5 25.5 26.5 28 C 26.5 30.5 30 33 30 33 C 30 33 33.5 30.5 33.5 28 C 33.5 25.5 30 25.5 30 28 Z"
          fill="#f48fb1"
        />
        <path
          d="M 60 24 C 60 21.5 56.5 21.5 56.5 24 C 56.5 26.5 60 29 60 29 C 60 29 63.5 26.5 63.5 24 C 63.5 21.5 60 21.5 60 24 Z"
          fill="#f48fb1"
        />
        <path
          d="M 45 19 C 45 16.5 41.5 16.5 41.5 19 C 41.5 21.5 45 24 45 24 C 45 24 48.5 21.5 48.5 19 C 48.5 16.5 45 16.5 45 19 Z"
          fill="#e57373"
        />
        <path
          d="M 38 22 C 38 20.5 35.5 20.5 35.5 22 C 35.5 23.5 38 25 38 25 C 38 25 40.5 23.5 40.5 22 C 40.5 20.5 38 20.5 38 22 Z"
          fill="#f48fb1"
          opacity="0.7"
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

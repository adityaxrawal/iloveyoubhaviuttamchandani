import React from 'react';
import './ILY.css';

const lettersData = [
  { char: 'i', top: '5%', left: '42%', rotate: -5, size: '8vmin' },
  { char: 'l', top: '22%', left: '8%', rotate: -8, size: '13vmin' },
  { char: 'o', top: '32%', left: '35%', rotate: 3, size: '14vmin' },
  { char: 'v', top: '28%', left: '58%', rotate: -4, size: '13vmin' },
  { char: 'e', top: '18%', left: '76%', rotate: 6, size: '10vmin' },
  { char: 'y', top: '62%', left: '6%', rotate: -10, size: '13vmin' },
  { char: 'o', top: '65%', left: '38%', rotate: 5, size: '13vmin' },
  { char: 'u', top: '64%', left: '68%', rotate: -3, size: '13vmin' },
];

/**
 * LetterCutout Component
 * Represents a single hand-cut letter piece on notebook paper.
 * @param {string} letter - The character to display.
 * @param {string} top - Vertical position (e.g., '10%').
 * @param {string} left - Horizontal position (e.g., '10%').
 * @param {number} rotate - Rotation degrees.
 * @param {string} size - Font size in vmin.
 */
const LetterCutout = ({ letter, top, left, rotate, size }) => {
  return (
    <div
      className="letter-cutout"
      style={{
        top,
        left,
        transform: `rotate(${rotate}deg)`,
        fontSize: size,
      }}
    >
      <span aria-hidden="true">{letter}</span>
    </div>
  );
};

/**
 * ScatteredLettersCanvas Component
 * Orchestrates the "i love you" composition with a textured crayon feel.
 */
const ILY = () => {
  return (
    <div className="ily-canvas">
      {/* SVG Definitions for textures and rough edges */}
      <svg className="ily-svg-filters" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Crayon/Pencil Grain Filter */}
          {/* Crayon/Pencil Grain Filter */}
          <filter
            id="crayon-texture"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
          >
            {/* Edge displacement for roughness */}
            <feTurbulence
              type="turbulence"
              baseFrequency="0.65"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" result="roughEdges" />
            
            {/* Inner grain texture */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              result="grain"
            />
            <feComposite operator="in" in="grain" in2="roughEdges" result="grainedLetter" />
            
            {/* Blend grain with color to keep it deep red but textured */}
            <feColorMatrix
              in="grainedLetter"
              type="matrix"
              values="0 0 0 0 0.75
                      0 0 0 0 0.16
                      0 0 0 0 0.17
                      0 0 0 1 0"
              result="coloredGrain"
            />
            <feBlend in="coloredGrain" in2="roughEdges" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Render each letter cutout */}
      {lettersData.map((data, index) => (
        <LetterCutout
          key={`${data.char}-${index}`}
          letter={data.char}
          top={data.top}
          left={data.left}
          rotate={data.rotate}
          size={data.size}
        />
      ))}
    </div>
  );
};

export default ILY;
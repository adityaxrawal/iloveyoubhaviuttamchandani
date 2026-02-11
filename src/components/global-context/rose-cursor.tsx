import React, { useMemo } from "react";

interface RoseCursorProps {
  scale?: number;
  className?: string;
}

const RoseCursor: React.FC<RoseCursorProps> = React.memo(
  ({ scale = 1, className = "" }) => {
    const pixelSize = 4 * scale;

    const boxShadow = useMemo(
      () => `
    /* Row 1 */
    ${3 * pixelSize}px ${1 * pixelSize}px 0 #D32F2F, 
    ${4 * pixelSize}px ${1 * pixelSize}px 0 #D32F2F,
    ${7 * pixelSize}px ${1 * pixelSize}px 0 #D32F2F,
    ${8 * pixelSize}px ${1 * pixelSize}px 0 #D32F2F,
    
    /* Row 2 */
    ${2 * pixelSize}px ${2 * pixelSize}px 0 #D32F2F,
    ${5 * pixelSize}px ${2 * pixelSize}px 0 #D32F2F,
    ${6 * pixelSize}px ${2 * pixelSize}px 0 #D32F2F,
    ${9 * pixelSize}px ${2 * pixelSize}px 0 #D32F2F,
    
    /* Row 3 */
    ${2 * pixelSize}px ${3 * pixelSize}px 0 #D32F2F,
    ${3 * pixelSize}px ${3 * pixelSize}px 0 #FFCDD2, /* highlight */
    ${4 * pixelSize}px ${3 * pixelSize}px 0 #D32F2F,
    ${5 * pixelSize}px ${3 * pixelSize}px 0 #D32F2F,
    ${6 * pixelSize}px ${3 * pixelSize}px 0 #D32F2F,
    ${7 * pixelSize}px ${3 * pixelSize}px 0 #FFCDD2, /* highlight */
    ${8 * pixelSize}px ${3 * pixelSize}px 0 #D32F2F,
    ${9 * pixelSize}px ${3 * pixelSize}px 0 #D32F2F,

    /* Row 4 */
    ${1 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${2 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${3 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${4 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${5 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${6 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${7 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${8 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${9 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,
    ${10 * pixelSize}px ${4 * pixelSize}px 0 #D32F2F,

    /* Row 5 */
    ${2 * pixelSize}px ${5 * pixelSize}px 0 #D32F2F,
    ${3 * pixelSize}px ${5 * pixelSize}px 0 #D32F2F,
    ${4 * pixelSize}px ${5 * pixelSize}px 0 #D32F2F,
    ${5 * pixelSize}px ${5 * pixelSize}px 0 #D32F2F,
    ${6 * pixelSize}px ${5 * pixelSize}px 0 #D32F2F,
    ${7 * pixelSize}px ${5 * pixelSize}px 0 #D32F2F,
    ${8 * pixelSize}px ${5 * pixelSize}px 0 #D32F2F,
    ${9 * pixelSize}px ${5 * pixelSize}px 0 #D32F2F,

    /* Row 6 */
    ${3 * pixelSize}px ${6 * pixelSize}px 0 #D32F2F,
    ${4 * pixelSize}px ${6 * pixelSize}px 0 #D32F2F,
    ${5 * pixelSize}px ${6 * pixelSize}px 0 #D32F2F,
    ${6 * pixelSize}px ${6 * pixelSize}px 0 #D32F2F,
    ${7 * pixelSize}px ${6 * pixelSize}px 0 #D32F2F,
    ${8 * pixelSize}px ${6 * pixelSize}px 0 #D32F2F,

    /* Stem Row 7 */
    ${5 * pixelSize}px ${7 * pixelSize}px 0 #388E3C,
    ${6 * pixelSize}px ${7 * pixelSize}px 0 #388E3C,

    /* Stem Row 8 + Leaf */
    ${4 * pixelSize}px ${8 * pixelSize}px 0 #388E3C, /* leaf L */
    ${5 * pixelSize}px ${8 * pixelSize}px 0 #1B5E20,
    ${6 * pixelSize}px ${8 * pixelSize}px 0 #1B5E20,
    ${7 * pixelSize}px ${8 * pixelSize}px 0 #388E3C, /* leaf R */

    /* Stem Row 9 */
    ${3 * pixelSize}px ${9 * pixelSize}px 0 #388E3C, /* leaf L tip */
    ${5 * pixelSize}px ${9 * pixelSize}px 0 #1B5E20,
    ${6 * pixelSize}px ${9 * pixelSize}px 0 #1B5E20,
    ${8 * pixelSize}px ${9 * pixelSize}px 0 #388E3C, /* leaf R tip */

    /* Stem Row 10 */
    ${5 * pixelSize}px ${10 * pixelSize}px 0 #1B5E20,
    ${6 * pixelSize}px ${10 * pixelSize}px 0 #1B5E20
  `,
      [pixelSize],
    );

    return (
      <div
        className={className}
        style={{
          width: pixelSize,
          height: pixelSize,
          boxShadow: boxShadow,
          backgroundColor: "transparent",
          display: "inline-block",
          marginRight: `${11 * pixelSize}px`, // reserve space for the shadow
          marginBottom: `${11 * pixelSize}px`,
        }}
      />
    );
  },
);

RoseCursor.displayName = "RoseCursor";

export default RoseCursor;

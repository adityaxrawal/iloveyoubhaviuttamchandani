import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';

function draw(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rc = rough.canvas(canvas);

  // Clear canvas
  ctx.clearRect(0, 0, 300, 265);

  const B = { 
    stroke: '#2d2d2d', 
    strokeWidth: 2.8, 
    roughness: 1.8, 
    bowing: 1.4, 
  };
  const L = { 
    stroke: '#2a2a2a', 
    strokeWidth: 2.8, 
    roughness: 2.0, 
    bowing: 1.6 
  };
  const E = {
    stroke: '#2d2d2d', // White eyes for contrast on dark head
    strokeWidth: 1.2,
    roughness: 0.5,
    fill: '#2d2d2d',
    fillStyle: 'solid',
  };

  function smile(cx, cy) {
    ctx.beginPath();
    ctx.arc(cx, cy + 4, 9, 0.4, Math.PI - 0.4);
    ctx.strokeStyle = '#2d2d2d'; // White smile for contrast
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function drawBoy(cx) {
    // Head
    rc.circle(cx, 51, 48, B);
    // Eyes
    rc.circle(cx - 8, 44, 4, E);
    rc.circle(cx + 8, 44, 4, E);
    smile(cx, 51);
    // Torso - bold straight line like the original
    rc.line(cx, 75, cx, 168, { ...L, strokeWidth: 4.8 });
  }

  function drawGirl(cx) {
    // Head
    rc.circle(cx, 51, 48, B);
    
    // Hair - fuller and "more beautiful" wavy style
    const hairStyle = { stroke: '#222222', strokeWidth: 1.5, roughness: 1.2 };
    // Left side hair
    rc.curve([[cx - 24, 30], [cx - 35, 50], [cx - 32, 85]], hairStyle);
    rc.curve([[cx - 18, 20], [cx - 28, 45], [cx - 25, 80]], hairStyle);
    // Right side hair
    rc.curve([[cx + 24, 30], [cx + 35, 50], [cx + 32, 85]], hairStyle);
    rc.curve([[cx + 18, 20], [cx + 28, 45], [cx + 25, 80]], hairStyle);
    // Top wisps
    rc.line(cx - 10, 18, cx - 12, 10, hairStyle);
    rc.line(cx, 16, cx, 8, hairStyle);
    rc.line(cx + 10, 18, cx + 12, 10, hairStyle);

    // Eyes
    rc.circle(cx - 8, 44, 4, E);
    rc.circle(cx + 8, 44, 4, E);
    smile(cx, 51);
    // Torso - straight line body same as original (boy and girl format same)
    rc.line(cx, 75, cx, 168, { ...L, strokeWidth: 4.2 });
  }

  // Draw Figure 1 (Boy)
  drawBoy(82);
  rc.line(94, 116, 148, 158, L); // Arm holding heart
  rc.line(70, 116, 38, 156, L); // Outer arm
  rc.line(76, 168, 53, 232, L); // Leg
  rc.line(88, 168, 111, 232, L); // Leg

  // Draw Figure 2 (Girl)
  drawGirl(218);
  rc.line(206, 116, 152, 158, L); // Arm holding heart
  rc.line(230, 116, 262, 156, L); // Outer arm
  rc.line(212, 168, 189, 232, L); // Leg
  rc.line(224, 168, 247, 232, L); // Leg

  // Heart
  const hx = 150, hy = 142, hs = 15;
  ctx.beginPath();
  ctx.moveTo(hx, hy + hs * 0.38);
  ctx.bezierCurveTo(hx - 0.05 * hs, hy - 0.1 * hs, hx - hs, hy - 0.15 * hs, hx - hs, hy + 0.22 * hs);
  ctx.bezierCurveTo(hx - hs, hy + 0.8 * hs, hx, hy + 1.32 * hs, hx, hy + 1.42 * hs);
  ctx.bezierCurveTo(hx, hy + 1.32 * hs, hx + hs, hy + 0.8 * hs, hx + hs, hy + 0.22 * hs);
  ctx.bezierCurveTo(hx + hs, hy - 0.15 * hs, hx + 0.05 * hs, hy - 0.38 * hs, hx, hy + hs * 0.38);
  ctx.fillStyle = '#ff3d3d'; // Bold soft red heart
  ctx.fill();
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 1.6;
  ctx.stroke();
}

/**
 * StickFigures
 * Two rough-drawn stick figures holding a heart between them.
 */
export default function StickFigures({ style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current);
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}>
      <canvas
        ref={canvasRef}
        width={300}
        height={265}
        style={{ 
          borderRadius: 6, 
          display: 'block',
          backgroundColor: 'transparent' 
        }}
      />
    </div>
  );
}

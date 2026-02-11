import React, { useEffect, useRef } from "react";
import pixelDataRaw from "./pixel-data.json";
import "./pixel-rose.css";

// Type assertion for the imported JSON data
const pixelData = pixelDataRaw as string[][];

const PixelRose: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize for no transparency if possible, but rose might have it?
    // The data seems to have colors. If no alpha needed, alpha: false is faster.
    // However, the original might have relied on body background.
    // Let's assume standard alpha is fine.

    if (!ctx) return;

    if (pixelData.length === 0) return;

    const rows = pixelData.length;
    const cols = pixelData[0].length;

    // Set canvas dimensions to the actual data size
    canvas.width = cols;
    canvas.height = rows;

    // Draw the pixels
    // We can disable anti-aliasing for crisp pixel art, though fillRect 1x1 aligns with pixels anyway.
    ctx.imageSmoothingEnabled = false;

    // Rendering loop
    // To avoid blocking the main thread for too long, we can do this in one go as it's likely fast enough (512x512).
    // If it janks, we can chunk it.

    // Clear canvas first
    ctx.clearRect(0, 0, cols, rows);

    // Performance optimization: Batch fillRects of same color?
    // For now, simple iteration.

    pixelData.forEach((row, y) => {
      row.forEach((color, x) => {
        // Optimization: Don't draw if transparent? (if color is null/empty, but here they are hex strings)
        // We assume valid colors.
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      });
    });
  }, []);

  return (
    <div className="pixel-rose-container">
      <canvas ref={canvasRef} className="pixel-rose-canvas" />
    </div>
  );
};

export default PixelRose;

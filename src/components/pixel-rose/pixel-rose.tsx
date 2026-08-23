import { useEffect, useRef, type FC } from "react";
import pixelDataRaw from "./pixel-data.json";
import "./pixel-rose.css";

// Type assertion for the imported JSON data
const pixelData = pixelDataRaw as string[][];

const PixelRose: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    if (!pixelData || pixelData.length === 0 || !pixelData[0]?.length) return;

    const rows = pixelData.length;
    const cols = pixelData[0].length;

    // Set canvas dimensions to the actual data size
    canvas.width = cols;
    canvas.height = rows;
    ctx.imageSmoothingEnabled = false;

    // Direct buffer write using ImageData for instant rendering without main-thread jank
    const imgData = ctx.createImageData(cols, rows);
    const buf32 = new Uint32Array(imgData.data.buffer);

    for (let y = 0; y < rows; y++) {
      const row = pixelData[y];
      if (!row) continue;
      const rowOffset = y * cols;
      for (let x = 0; x < cols; x++) {
        const hex = row[x];
        if (hex && hex.charCodeAt(0) === 35) {
          const num = parseInt(hex.slice(1), 16);
          const r = (num >> 16) & 255;
          const g = (num >> 8) & 255;
          const b = num & 255;
          // In little-endian ABGR: (A << 24) | (B << 16) | (G << 8) | R
          buf32[rowOffset + x] = 0xff000000 | (b << 16) | (g << 8) | r;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, []);

  return (
    <div className="pixel-rose-container">
      <canvas ref={canvasRef} className="pixel-rose-canvas" />
    </div>
  );
};

export default PixelRose;

import { useState, useCallback, useRef, useEffect } from "react";
import RoseCursor from "./rose-cursor";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  type: "heart" | "rose";
  scale: number;
  drift: number;
  delay: number;
}

const STYLES = `

/* ===== FLOATING ELEMENTS ===== */
.floating-element {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  animation: float-up-fade 4s ease-out forwards;
  will-change: transform, opacity;
}

.pixel-heart-particle {
  width: 4px;
  height: 4px;
  background-color: #FF1744;
  box-shadow: 0 0 4px #FF1744;
  position: absolute;
}
.pixel-heart-particle::before {
  content: '';
  position: absolute;
  left: -2px; top: -2px;
  width: 2px; height: 2px;
  box-shadow: 2px 0 0 #FF1744, 4px 0 0 #FF1744, 6px 0 0 #FF1744, 0 2px 0 #FF1744, 8px 2px 0 #FF1744, 2px 4px 0 #FF1744, 4px 4px 0 #FF1744, 6px 4px 0 #FF1744, 4px 6px 0 #FF1744;
  background: transparent;
}


@keyframes float-up-fade {
  0%   { opacity: 1; transform: translate(0, 0) scale(0.8); }
  20%  { opacity: 1; transform: translate(var(--dx, 0), -50px) scale(1); }
  100% { opacity: 0; transform: translate(var(--dx, 0), -400px) scale(1); }
}

/* ===== GLOBAL CURSOR ===== */
body, a, button, .clickable {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewport="0 0 24 24" fill="%23FF1744"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>') 12 12, auto !important;
}
`;

const GlobalCursor = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>(
    [],
  );
  const elementIdRef = useRef(0);

  const spawnInteractiveElements = useCallback((e: MouseEvent) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    const newElements: FloatingElement[] = [];

    // 1. Spawn a Floating Rose
    const roseId = elementIdRef.current++;
    newElements.push({
      id: roseId,
      x: clickX,
      y: clickY,
      type: "rose",
      scale: 1,
      drift: 0,
      delay: 0,
    });

    // 2. Spawn small pixel heart particles
    for (let i = 0; i < 3; i++) {
      const heartId = elementIdRef.current++;
      newElements.push({
        id: heartId,
        x: clickX + (Math.random() - 0.5) * 40,
        y: clickY + (Math.random() - 0.5) * 40,
        type: "heart",
        scale: 0.5 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 50,
        delay: Math.random() * 0.2,
      });
    }

    setFloatingElements((prev) => [...prev, ...newElements]);

    // Cleanup
    setTimeout(() => {
      setFloatingElements((prev) =>
        prev.filter((el) => !newElements.some((ne) => ne.id === el.id)),
      );
    }, 4000);
  }, []);

  useEffect(() => {
    window.addEventListener("click", spawnInteractiveElements);
    return () => {
      window.removeEventListener("click", spawnInteractiveElements);
    };
  }, [spawnInteractiveElements]);

  return (
    <>
      <style>{STYLES}</style>
      {floatingElements.map((el) => (
        <div
          key={el.id}
          className="floating-element"
          style={
            {
              left: el.x,
              top: el.y,
              "--dx": `${el.drift}px`,
              animationDelay: `${el.delay}s`,
            } as React.CSSProperties
          }
        >
          {el.type === "rose" ? (
            <div style={{ transform: "translate(-50%, -50%)" }}>
              <RoseCursor scale={0.6} />
            </div>
          ) : (
            <div
              className="pixel-heart-particle"
              style={{
                transform: `scale(${el.scale})`,
                backgroundColor: "#FF1744",
                boxShadow: "1px 1px 0 #880e4f",
              }}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default GlobalCursor;

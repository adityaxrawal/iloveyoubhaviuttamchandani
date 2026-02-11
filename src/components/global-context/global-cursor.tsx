import React, { useState, useCallback, useRef, useEffect } from "react";
import RoseCursor from "./rose-cursor";
import "./global-cursor.css";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  type: "heart" | "rose";
  scale: number;
  drift: number;
  delay: number;
}

const GlobalCursor: React.FC = () => {
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
    const cleanupId = setTimeout(() => {
      setFloatingElements((prev) =>
        prev.filter((el) => !newElements.some((ne) => ne.id === el.id)),
      );
    }, 4000);

    return () => clearTimeout(cleanupId); // Note: this return is ignored by the event listener, but good practice if logic moves
  }, []);

  useEffect(() => {
    window.addEventListener("click", spawnInteractiveElements);
    return () => {
      window.removeEventListener("click", spawnInteractiveElements);
    };
  }, [spawnInteractiveElements]);

  return (
    <>
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

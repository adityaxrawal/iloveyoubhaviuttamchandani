import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

// Heart pattern: 1 = red cube, 2 = white highlight cube, 0 = empty
const HEART_PATTERN = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

interface HeartMeshProps {
  rotationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

function HeartMesh({ rotationSpeed, onSpeedChange }: HeartMeshProps) {
  const groupRef = useRef<Mesh>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0.01);

  useFrame((state) => {
    if (groupRef.current) {
      // Apply rotation
      groupRef.current.rotation.y += currentSpeed;
      
      // Decay speed towards base rotation speed
      const targetSpeed = rotationSpeed;
      const decayFactor = 0.98;
      const newSpeed = currentSpeed * decayFactor + targetSpeed * (1 - decayFactor);
      
      if (Math.abs(newSpeed - currentSpeed) > 0.0001) {
        setCurrentSpeed(newSpeed);
        onSpeedChange(newSpeed);
      }

      // Heart beating effect - smooth sine wave animation
      const time = state.clock.getElapsedTime();
      const heartBeat = 1 + Math.sin(time * 4) * 0.1; // Beat at 3 Hz with 20% scale variation
      
      // Apply beating effect to the heart
      groupRef.current.scale.set(heartBeat, heartBeat, heartBeat);
    }
  });

  // Generate cubes based on heart pattern
  const cubes = [];
  const cubeSize = 0.5;
  const spacing = 0.55;

  for (let row = 0; row < HEART_PATTERN.length; row++) {
    for (let col = 0; col < HEART_PATTERN[row].length; col++) {
      const cellValue = HEART_PATTERN[row][col];
      if (cellValue > 0) {
        const x = (col - HEART_PATTERN[row].length / 2) * spacing;
        const y = (HEART_PATTERN.length / 2 - row) * spacing;
        const z = 0;

        const isHighlight = cellValue === 2;
        const color = isHighlight ? '#ffffff' : '#ff0000';

        cubes.push(
          <mesh key={`${row}-${col}`} position={[x, y, z]}>
            <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
            <meshLambertMaterial color={color} />
          </mesh>
        );
      }
    }
  }

  return (
    <group ref={groupRef}>
      {cubes}
    </group>
  );
}

export default function PixelHeart3D() {
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerX, setLastPointerX] = useState(0);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    setIsDragging(true);
    setLastPointerX(event.clientX);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastPointerX;
    const speedBoost = Math.abs(deltaX) * 0.001;
    
    // Increase rotation speed based on swipe velocity
    setRotationSpeed(0.01 + speedBoost);
    setLastPointerX(event.clientX);
  }, [isDragging, lastPointerX]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      setIsDragging(true);
      setLastPointerX(event.touches[0].clientX);
    }
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!isDragging || event.touches.length !== 1) return;

    const deltaX = event.touches[0].clientX - lastPointerX;
    const speedBoost = Math.abs(deltaX) * 0.002;
    
    // Increase rotation speed based on swipe velocity
    setRotationSpeed(0.01 + speedBoost);
    setLastPointerX(event.touches[0].clientX);
  }, [isDragging, lastPointerX]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      className="w-full h-full"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'black' }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8}
          castShadow
        />
        <HeartMesh 
          rotationSpeed={rotationSpeed}
          onSpeedChange={setRotationSpeed}
        />
      </Canvas>
    </div>
  );
}
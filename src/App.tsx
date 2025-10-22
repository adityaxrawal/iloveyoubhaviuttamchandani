import { useState, useEffect } from 'react';
import PixelHeart3D from './components/PixelHeart3D';
import PixelText3D from './components/PixelText3D';

function App() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive scales based on screen size
  const getResponsiveScales = () => {
    const { width } = windowSize;
    
    // Mobile breakpoints (phones and small tablets)
    if (width <= 768) {
      return {
        textScale: 0.9,
        heartScale: 0.7,
      };
    }
    
    // Tablet breakpoints
    if (width <= 1024) {
      return {
        textScale: 1.1,
        heartScale: 0.8,
      };
    }
    
    // Laptop/Desktop breakpoints (MacBook 14" and similar)
    if (width <= 1440) {
      return {
        textScale: 1.5,
        heartScale: 1.0,
      };
    }
    
    // Large desktop screens
    return {
      textScale: 1.7,
      heartScale: 1.2,
    };
  };

  const { textScale, heartScale } = getResponsiveScales();

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-start">
      <div className="h-1/6 w-full">
        <PixelText3D text="I LOVE YOU BHAVI UTTAMCHANDANI" scale={textScale} />
      </div>
      <div className="h-3/6 w-full">
        <PixelHeart3D scale={heartScale} />
      </div>
    </div>
  );
}

export default App;

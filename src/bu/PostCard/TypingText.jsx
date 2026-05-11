import React, { useState, useEffect, useRef } from 'react';

/**
 * A component that animates text as if it's being typed.
 * Uses a "ghost text" technique (invisible text) to reserve space 
 * and prevent layout shifts during the animation.
 */
const TypingText = ({ 
  text = '', 
  speed = 30, 
  delay = 0, 
  shouldStart = true, 
  onComplete,
  className 
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // If the text is empty or we've already finished, don't do anything.
    if (!text || isDone) return;

    if (!shouldStart) {
      setDisplayedLength(0);
      return;
    }

    const startTyping = () => {
      let currentLength = 0;
      timerRef.current = setInterval(() => {
        currentLength++;
        setDisplayedLength(currentLength);
        
        if (currentLength >= text.length) {
          clearInterval(timerRef.current);
          setIsDone(true);
          if (onComplete) onComplete();
        }
      }, speed);
    };

    const timeout = setTimeout(startTyping, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(timerRef.current);
    };
  }, [text, speed, delay, shouldStart, onComplete, isDone]);

  // If not supposed to start yet, just show ghost text
  const visibleText = text.slice(0, displayedLength);
  const ghostText = text.slice(displayedLength);

  return (
    <span className={className}>
      {visibleText}
      <span style={{ visibility: 'hidden', userSelect: 'none' }} aria-hidden="true">
        {ghostText}
      </span>
    </span>
  );
};

export default TypingText;

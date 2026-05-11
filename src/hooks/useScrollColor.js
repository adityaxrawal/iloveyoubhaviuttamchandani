import { useEffect } from 'react';

/**
 * useScrollColor Hook
 * Updates the background color of a container based on the currently visible section.
 * 
 * @param {React.RefObject} containerRef - Reference to the root container.
 * @param {Array} sections - Array of section objects { id, color }.
 */
export const useScrollColor = (containerRef, sections) => {
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      // Calculate scroll position (middle of the viewport)
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let activeColor = sections[0].color;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          // Check if the scroll position is within this section's bounds
          if (scrollPosition >= offsetTop && scrollPosition <= offsetTop + offsetHeight) {
            activeColor = section.color;
            break;
          }
        }
      }

      containerRef.current.style.backgroundColor = activeColor;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef, sections]);
};

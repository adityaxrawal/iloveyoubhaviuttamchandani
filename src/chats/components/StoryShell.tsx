import { useEffect, useRef, useState } from 'react';
import type { ComponentType, PointerEvent } from 'react';
import type { AnalysisResult, SlideProps } from '../lib/types';
import { directionFromSwipe, directionFromTapPosition, nextIndex, prevIndex } from './storyNav';
import styles from './StoryShell.module.css';

const TAP_DRAG_TOLERANCE = 10;

interface StoryShellProps {
  slides: ComponentType<SlideProps>[];
  data: AnalysisResult;
}

export default function StoryShell({ slides, data }: StoryShellProps) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const dragStartX = useRef<number | null>(null);

  const goNext = () => setIndex((i) => nextIndex(i, total));
  const goPrev = () => setIndex((i) => prevIndex(i, total));

  // Document-level listener rather than relying on this element holding DOM
  // focus — clicking the theme toggle (a sibling) would otherwise steal
  // focus and silently break arrow-key navigation.
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') setIndex((i) => nextIndex(i, total));
      if (e.key === 'ArrowLeft') setIndex((i) => prevIndex(i, total));
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  const handlePointerDown = (e: PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  // No full-screen tap-zone overlay: it would sit on top of the slide's own
  // interactive elements (heatmap cells, the Shape-of-Us toggle) and steal
  // every click before it reaches them. Instead this delegates from the
  // shell itself — a real swipe always navigates; a plain tap navigates
  // only if it didn't land on a control the slide handles itself.
  const handlePointerUp = (e: PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;

    const swipeDirection = directionFromSwipe(delta);
    if (swipeDirection === 'next') {
      goNext();
      return;
    }
    if (swipeDirection === 'prev') {
      goPrev();
      return;
    }

    if (Math.abs(delta) > TAP_DRAG_TOLERANCE) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, [data-story-interactive]')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const direction = directionFromTapPosition(relativeX);
    if (direction === 'next') goNext();
    else goPrev();
  };

  const Slide = slides[index];

  return (
    <div className={styles.shell} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <div className={styles.progress}>
        {slides.map((_, i) => (
          <div
            key={i}
            className={`${styles.segment} ${i < index ? styles.segmentVisited : ''} ${i === index ? styles.segmentCurrent : ''}`}
          />
        ))}
      </div>

      <div key={index} className={styles.slideWrap}>
        <Slide data={data} />
      </div>
    </div>
  );
}

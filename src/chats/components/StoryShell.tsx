import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentType, PointerEvent } from 'react';
import type { AnalysisResult, SlideProps } from '../lib/types';
import { directionFromSwipe, directionFromTapPosition, nextIndex, prevIndex } from './storyNav';
import styles from './StoryShell.module.css';

const TAP_DRAG_TOLERANCE = 10;

interface StoryShellProps {
  slides: ComponentType<SlideProps>[];
  data: AnalysisResult;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

export default function StoryShell({ slides, data, currentIndex: controlledIndex, onIndexChange }: StoryShellProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const index = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const total = slides.length;
  const dragStartX = useRef<number | null>(null);

  const setIndex = useCallback(
    (updater: (i: number) => number) => {
      const newIdx = updater(index);
      if (onIndexChange) {
        onIndexChange(newIdx);
      } else {
        setInternalIndex(newIdx);
      }
    },
    [index, onIndexChange],
  );

  const goNext = useCallback(() => setIndex((i) => nextIndex(i, total)), [setIndex, total]);
  const goPrev = useCallback(() => setIndex((i) => prevIndex(i, total)), [setIndex, total]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') setIndex((i) => nextIndex(i, total));
      if (e.key === 'ArrowLeft') setIndex((i) => prevIndex(i, total));
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [total, setIndex]);

  const handlePointerDown = (e: PointerEvent) => {
    dragStartX.current = e.clientX;
  };

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
    <div className={styles.pageBg}>
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
    </div>
  );
}

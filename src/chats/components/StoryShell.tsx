import { useRef, useState } from 'react';
import type { ComponentType, PointerEvent, KeyboardEvent } from 'react';
import type { AnalysisResult, SlideProps } from '../lib/types';
import { directionFromSwipe, nextIndex, prevIndex } from './storyNav';
import styles from './StoryShell.module.css';

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

  const handlePointerDown = (e: PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    const direction = directionFromSwipe(delta);
    if (direction === 'next') goNext();
    if (direction === 'prev') goPrev();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  const Slide = slides[index];

  return (
    <div
      className={styles.shell}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={styles.progress}>
        {slides.map((_, i) => (
          <div
            key={i}
            className={`${styles.segment} ${i < index ? styles.segmentVisited : ''} ${i === index ? styles.segmentCurrent : ''}`}
          />
        ))}
      </div>

      <div className={styles.tapZones}>
        <div className={styles.tapPrev} onClick={goPrev} />
        <div className={styles.tapNext} onClick={goNext} />
      </div>

      <div key={index} className={styles.slideWrap}>
        <Slide data={data} />
      </div>
    </div>
  );
}

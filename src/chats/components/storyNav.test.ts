import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex, directionFromSwipe, directionFromTapPosition } from './storyNav';

describe('nextIndex / prevIndex', () => {
  it('advances and loops past the last slide', () => {
    expect(nextIndex(0, 14)).toBe(1);
    expect(nextIndex(13, 14)).toBe(0);
  });

  it('goes back and loops past the first slide', () => {
    expect(prevIndex(5, 14)).toBe(4);
    expect(prevIndex(0, 14)).toBe(13);
  });
});

describe('directionFromSwipe', () => {
  it('detects a leftward swipe past the threshold as next', () => {
    expect(directionFromSwipe(-70, 60)).toBe('next');
  });

  it('detects a rightward swipe past the threshold as prev', () => {
    expect(directionFromSwipe(70, 60)).toBe('prev');
  });

  it('returns null when the swipe does not clear the threshold', () => {
    expect(directionFromSwipe(10, 60)).toBeNull();
  });
});

describe('directionFromTapPosition', () => {
  it('treats the left 30% as prev and the rest as next', () => {
    expect(directionFromTapPosition(0.1)).toBe('prev');
    expect(directionFromTapPosition(0.29)).toBe('prev');
    expect(directionFromTapPosition(0.3)).toBe('next');
    expect(directionFromTapPosition(0.9)).toBe('next');
  });
});

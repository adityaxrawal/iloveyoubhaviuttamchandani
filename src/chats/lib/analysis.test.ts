import { describe, it, expect } from 'vitest';
import type { RawMessage } from './types';
import { computeMeta, computeReceipts, computeShape, computeCalendar, computeHeatmap, computeStreak } from './analysis';

const fixture: RawMessage[] = [
  { id: 1, timestamp: '2020-01-01T10:00:00', date: '01/01/20', time: '10:00:00 AM', sender: 'Alex', message: 'hi 😊' },
  { id: 2, timestamp: '2020-01-01T10:05:00', date: '01/01/20', time: '10:05:00 AM', sender: 'Sam', message: 'i love you' },
  { id: 3, timestamp: '2020-01-02T09:00:00', date: '02/01/20', time: '9:00:00 AM', sender: 'Sam', message: '<Media omitted>' },
  { id: 4, timestamp: '2022-01-01T09:00:00', date: '01/01/22', time: '9:00:00 AM', sender: 'Alex', message: 'ok' },
];

describe('computeMeta', () => {
  it('sorts participants alphabetically and picks senderA/senderB', () => {
    const meta = computeMeta(fixture);
    expect(meta.participants).toEqual(['Alex', 'Sam']);
    expect(meta.senderA).toBe('Alex');
    expect(meta.senderB).toBe('Sam');
    expect(meta.isSolo).toBe(false);
    expect(meta.totalMessages).toBe(4);
  });

  it('flags a single-participant chat as solo', () => {
    const solo = computeMeta([fixture[0], { ...fixture[3], sender: 'Alex' }]);
    expect(solo.isSolo).toBe(true);
    expect(solo.senderB).toBe('');
  });
});

describe('computeReceipts', () => {
  it('computes counts, share, emojis, love-you, photos, years, and double-texts', () => {
    const meta = computeMeta(fixture);
    const receipts = computeReceipts(fixture, meta);
    expect(receipts.totalMessages).toBe(4);
    expect(receipts.totalDays).toBe(731);
    expect(receipts.yearsActive).toBe(2);
    expect(receipts.photosShared).toBe(1);
    expect(receipts.totalEmojis).toBe(1);
    expect(receipts.loveYouCount).toBe(1);
    expect(receipts.senderCounts).toEqual({ Alex: 2, Sam: 2 });
    expect(receipts.senderShare).toEqual({ Alex: 50, Sam: 50 });
    expect(receipts.doubleTexts).toEqual({ Alex: 0, Sam: 1 });
  });
});

describe('computeShape', () => {
  it('groups message counts by year and by month', () => {
    const shape = computeShape(fixture);
    expect(shape.byYear).toEqual({ '2020': 3, '2022': 1 });
    expect(shape.byMonth).toEqual({ '2020-01': 3, '2022-01': 1 });
  });
});

describe('computeCalendar + computeStreak', () => {
  it('builds a day-count map and finds the longest consecutive streak', () => {
    const meta = computeMeta(fixture);
    const calendar = computeCalendar(fixture, meta);
    expect(calendar.days).toEqual({ '2020-01-01': 2, '2020-01-02': 1, '2022-01-01': 1 });

    const streak = computeStreak(calendar);
    expect(streak.maxStreak).toBe(2);
    expect(streak.bestStart).toBe('2020-01-01');
    expect(streak.bestEnd).toBe('2020-01-02');
    expect(streak.totalChatDays).toBe(3);
  });

  it('falls back to a streak of 1 when there is only a single active day', () => {
    const oneDay = computeCalendar([fixture[0], fixture[1]], computeMeta([fixture[0], fixture[1]]));
    const streak = computeStreak(oneDay);
    expect(streak.maxStreak).toBe(1);
  });
});

describe('computeHeatmap', () => {
  it('builds a weekday x hour grid and finds the peak cell', () => {
    const meta = computeMeta(fixture);
    const heatmap = computeHeatmap(fixture, meta);
    // 2020-01-01 is a Wednesday, 2020-01-02 a Thursday, 2022-01-01 a Saturday
    expect(heatmap.grid['WE_10']).toBe(2);
    expect(heatmap.grid['TH_09']).toBe(1);
    expect(heatmap.grid['SA_09']).toBe(1);
    expect(heatmap.peakCell).toBe('WE_10');
    expect(heatmap.peakValue).toBe(2);
  });
});

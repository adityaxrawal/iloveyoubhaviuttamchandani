import { describe, it, expect } from 'vitest';
import type { RawMessage } from './types';
import { computeMeta, computeReceipts } from './analysis';

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

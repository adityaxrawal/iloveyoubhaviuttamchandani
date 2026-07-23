import { describe, it, expect } from 'vitest';
import type { RawMessage } from './types';
import {
  computeMeta,
  computeReceipts,
  computeShape,
  computeCalendar,
  computeHeatmap,
  computeStreak,
  computeResponseTime,
  computeInitiator,
  computeTimeOfDay,
  computeVocabulary,
  computeMessageShape,
  isMediaMessage,
} from './analysis';

const fixture: RawMessage[] = [
  { id: 1, timestamp: '2020-01-01T10:00:00', date: '01/01/20', time: '10:00:00 AM', sender: 'Alex', message: 'hi 😊' },
  { id: 2, timestamp: '2020-01-01T10:05:00', date: '01/01/20', time: '10:05:00 AM', sender: 'Sam', message: 'i love you' },
  { id: 3, timestamp: '2020-01-02T09:00:00', date: '02/01/20', time: '9:00:00 AM', sender: 'Sam', message: '<Media omitted>' },
  { id: 4, timestamp: '2022-01-01T09:00:00', date: '01/01/22', time: '9:00:00 AM', sender: 'Alex', message: 'ok' },
];

describe('isMediaMessage', () => {
  it('matches the bracketed form', () => {
    expect(isMediaMessage('<Media omitted>')).toBe(true);
  });

  it('matches the real WhatsApp export form: no brackets, leading LRM mark', () => {
    expect(isMediaMessage('‎image omitted')).toBe(true);
    expect(isMediaMessage('‎sticker omitted')).toBe(true);
  });

  it('does not flag ordinary text', () => {
    expect(isMediaMessage('good morning')).toBe(false);
  });
});

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

describe('computeResponseTime', () => {
  it('computes median reply minutes per sender, ignoring gaps over 24h', () => {
    const meta = computeMeta(fixture);
    const rt = computeResponseTime(fixture, meta);
    // Alex->Sam at msg2: 5 min. Sam->Alex at msg4: ~2 year gap, excluded (>1440min).
    expect(rt.medianMinutes.Sam).toBe(5);
    expect(rt.medianMinutes.Alex).toBe(0);
  });

  it('counts instant (<1min) and slow (>60min) replies per sender', () => {
    const rtFixture: RawMessage[] = [
      { id: 1, timestamp: '2020-01-01T10:00:00', date: '01/01/20', time: '10:00:00 AM', sender: 'Alex', message: 'a' },
      { id: 2, timestamp: '2020-01-01T10:00:30', date: '01/01/20', time: '10:00:30 AM', sender: 'Sam', message: 'b' },
      { id: 3, timestamp: '2020-01-01T12:00:30', date: '01/01/20', time: '12:00:30 PM', sender: 'Alex', message: 'c' },
      { id: 4, timestamp: '2020-01-01T12:05:30', date: '01/01/20', time: '12:05:30 PM', sender: 'Sam', message: 'd' },
    ];
    const meta = computeMeta(rtFixture);
    const rt = computeResponseTime(rtFixture, meta);
    // Sam replies: 0.5min (instant), 5min (neither). Alex replies: 120min (slow).
    expect(rt.instantCounts.Sam).toBe(1);
    expect(rt.slowCounts.Sam).toBe(0);
    expect(rt.instantCounts.Alex).toBe(0);
    expect(rt.slowCounts.Alex).toBe(1);
  });
});

describe('computeInitiator', () => {
  it('counts who sent the first message of each distinct day', () => {
    const initiator = computeInitiator(fixture);
    // day1 (2020-01-01) first sender Alex, day2 (2020-01-02) first sender Sam, day3 (2022-01-01) first sender Alex
    expect(initiator.dailyFirst).toEqual({ Alex: 2, Sam: 1 });
  });
});

describe('computeTimeOfDay', () => {
  const todFixture: RawMessage[] = [
    { id: 1, timestamp: '2020-01-01T10:00:00', date: '01/01/20', time: '10:00:00 AM', sender: 'Alex', message: 'a' },
    { id: 2, timestamp: '2020-01-01T10:30:00', date: '01/01/20', time: '10:30:00 AM', sender: 'Alex', message: 'b' },
    { id: 3, timestamp: '2020-01-01T14:00:00', date: '01/01/20', time: '2:00:00 PM', sender: 'Alex', message: 'c' },
    { id: 4, timestamp: '2020-01-01T09:00:00', date: '01/01/20', time: '9:00:00 AM', sender: 'Sam', message: 'd' },
    { id: 5, timestamp: '2020-01-01T09:15:00', date: '01/01/20', time: '9:15:00 AM', sender: 'Sam', message: 'e' },
    { id: 6, timestamp: '2020-01-01T20:00:00', date: '01/01/20', time: '8:00:00 PM', sender: 'Sam', message: 'f' },
  ];

  it("buckets messages by time of day and finds each sender's unambiguous peak hour", () => {
    const meta = computeMeta(todFixture);
    const tod = computeTimeOfDay(todFixture, meta);
    expect(tod.bucketsBySender.Alex.morning).toBe(2);
    expect(tod.bucketsBySender.Alex.afternoon).toBe(1);
    expect(tod.bucketsBySender.Sam.morning).toBe(2);
    expect(tod.bucketsBySender.Sam.evening).toBe(1);
    expect(tod.peakHourBySender.Alex).toBe(10);
    expect(tod.peakHourBySender.Sam).toBe(9);
  });
});

describe('computeVocabulary', () => {
  it('counts emojis and phrases', () => {
    const meta = computeMeta(fixture);
    const vocab = computeVocabulary(fixture, meta);
    expect(vocab.topEmojis).toEqual([{ emoji: '😊', count: 1 }]);
    expect(vocab.phraseCounts['i love you']).toBe(1);
    expect(vocab.phraseCounts['love you']).toBe(1);
  });
});

describe('computeMessageShape', () => {
  it('finds the longest message (code-point length) and average length per sender', () => {
    const meta = computeMeta(fixture);
    const shape = computeMessageShape(fixture, meta);
    expect(shape.longestMessage.sender).toBe('Sam');
    expect(shape.longestMessage.length).toBe(15); // "<Media omitted>" is 15 code points
    expect(shape.avgLengthBySender.Alex).toBe(3); // "hi 😊"=4 code points, "ok"=2, avg 3
  });
});

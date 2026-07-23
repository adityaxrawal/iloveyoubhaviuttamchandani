import { describe, it, expect } from 'vitest';
import type { ChatExport } from './types';
import { computeAnalysis } from './analysis';
import sampleData from '../code/sample_chat.json';

const sampleMessages = (sampleData as ChatExport).messages;

function scanForBadValues(value: unknown): string[] {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? [] : [`bad number: ${value}`];
  }
  if (Array.isArray(value)) return value.flatMap(scanForBadValues);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(scanForBadValues);
  }
  return [];
}

describe('computeAnalysis', () => {
  it('produces internally consistent output for the sample chat with no NaN/Infinity', () => {
    const messages = sampleMessages;
    const result = computeAnalysis(messages);

    expect(result.meta.totalMessages).toBe(messages.length);

    const summedCounts = Object.values(result.receipts.senderCounts).reduce((a, b) => a + b, 0);
    expect(summedCounts).toBe(messages.length);

    expect(result.streak.maxStreak).toBeGreaterThanOrEqual(1);
    expect(scanForBadValues(result)).toEqual([]);
  });

  it('sorts out-of-order input by timestamp before analysing', () => {
    const messages = sampleMessages.slice(0, 3);
    const shuffled = [messages[2], messages[0], messages[1]];
    const result = computeAnalysis(shuffled);
    expect(result.meta.startDate).toBe(messages[0].timestamp);
  });
});

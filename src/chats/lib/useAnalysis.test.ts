import { describe, it, expect } from 'vitest';
import type { RawMessage } from './types';
import { runAnalysis, useAnalysis } from './useAnalysis';

describe('useAnalysis', () => {
  it('is a function exported for computing analysis state', () => {
    expect(typeof useAnalysis).toBe('function');
  });
});


describe('runAnalysis', () => {
  it('returns a ready state with data for valid messages', () => {
    const messages: RawMessage[] = [
      { id: 1, timestamp: '2020-01-01T10:00:00', date: '01/01/20', time: '10:00:00 AM', sender: 'Alex', message: 'hi' },
    ];
    const state = runAnalysis(messages);
    expect(state.status).toBe('ready');
    if (state.status === 'ready') {
      expect(state.data.meta.totalMessages).toBe(1);
    }
  });

  it('returns an error state for an empty message list', () => {
    const state = runAnalysis([]);
    expect(state.status).toBe('error');
  });
});

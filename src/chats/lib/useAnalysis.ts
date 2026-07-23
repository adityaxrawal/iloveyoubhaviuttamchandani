import { useEffect, useState } from 'react';
import type { AnalysisResult, RawMessage } from './types';
import { computeAnalysis } from './analysis';

export type AnalysisState =
  | { status: 'loading' }
  | { status: 'ready'; data: AnalysisResult }
  | { status: 'error'; message: string };

export function runAnalysis(messages: RawMessage[]): AnalysisState {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { status: 'error', message: "This chat export doesn't have any messages to show." };
  }

  try {
    const data = computeAnalysis(messages);
    return { status: 'ready', data };
  } catch (err) {
    console.error('Chat Wrapped analysis failed:', err);
    return { status: 'error', message: "Couldn't read this chat export." };
  }
}

export function useAnalysis(messages: RawMessage[]): AnalysisState {
  const [state, setState] = useState<AnalysisState>({ status: 'loading' });

  useEffect(() => {
    setState({ status: 'loading' });
    const timer = setTimeout(() => setState(runAnalysis(messages)), 0);
    return () => clearTimeout(timer);
  }, [messages]);

  return state;
}

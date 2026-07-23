import type { Meta, Receipts, RawMessage, SenderCounts } from './types';

export function codePointLength(s: string): number {
  return Array.from(s).length;
}

const EMOJI_RE = /[\u{10000}-\u{10FFFF}]|❤|♥/gu;

export function extractEmojis(text: string): string[] {
  return text.match(EMOJI_RE) ?? [];
}

const MEDIA_RE = /<(image|video|sticker|gif|audio|document|media) omitted>/i;

export function isMediaMessage(text: string): boolean {
  return MEDIA_RE.test(text);
}

export function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function computeTotalDays(startIso: string, endIso: string): number {
  if (!startIso || !endIso) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = new Date(endIso).getTime() - new Date(startIso).getTime();
  return Math.floor(diff / msPerDay) + 1;
}

export function computeMeta(messages: RawMessage[]): Meta {
  const participants = Array.from(new Set(messages.map((m) => m.sender))).sort();
  const first = messages[0];
  const last = messages[messages.length - 1];
  const startDate = first?.timestamp ?? '';
  const endDate = last?.timestamp ?? '';

  return {
    participants,
    senderA: participants[0] ?? '',
    senderB: participants[1] ?? '',
    isSolo: participants.length <= 1,
    totalMessages: messages.length,
    totalDays: computeTotalDays(startDate, endDate),
    startDate,
    endDate,
  };
}

function computeYearsActive(startIso: string, endIso: string): number {
  if (!startIso || !endIso) return 0;
  const start = new Date(startIso);
  const end = new Date(endIso);
  let years = end.getFullYear() - start.getFullYear();
  const beforeAnniversary =
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate());
  if (beforeAnniversary) years -= 1;
  return Math.max(0, years);
}

export function computeReceipts(messages: RawMessage[], meta: Meta): Receipts {
  const senderCounts: SenderCounts = {};
  const doubleTexts: SenderCounts = {};
  for (const s of meta.participants) doubleTexts[s] = 0;

  let totalEmojis = 0;
  let loveYouCount = 0;
  let photosShared = 0;

  messages.forEach((m, i) => {
    senderCounts[m.sender] = (senderCounts[m.sender] ?? 0) + 1;
    totalEmojis += extractEmojis(m.message).length;
    if (m.message.toLowerCase().includes('i love you')) loveYouCount += 1;
    if (isMediaMessage(m.message)) photosShared += 1;
    if (i > 0 && messages[i - 1].sender === m.sender) {
      doubleTexts[m.sender] = (doubleTexts[m.sender] ?? 0) + 1;
    }
  });

  const senderShare: SenderCounts = {};
  for (const s of meta.participants) {
    senderShare[s] =
      meta.totalMessages > 0
        ? Math.round(((senderCounts[s] ?? 0) / meta.totalMessages) * 1000) / 10
        : 0;
  }

  return {
    totalMessages: meta.totalMessages,
    totalDays: meta.totalDays,
    yearsActive: computeYearsActive(meta.startDate, meta.endDate),
    photosShared,
    totalEmojis,
    loveYouCount,
    senderCounts,
    senderShare,
    doubleTexts,
  };
}

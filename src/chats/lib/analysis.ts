import type {
  CalendarData,
  Heatmap,
  Meta,
  Receipts,
  RawMessage,
  SenderCounts,
  Shape,
  Streak,
} from './types';

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

function sortRecord(rec: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(rec).sort(([a], [b]) => a.localeCompare(b)));
}

export function computeShape(messages: RawMessage[]): Shape {
  const byYear: Record<string, number> = {};
  const byMonth: Record<string, number> = {};

  for (const m of messages) {
    const d = new Date(m.timestamp);
    const year = String(d.getFullYear());
    const month = `${year}-${pad2(d.getMonth() + 1)}`;
    byYear[year] = (byYear[year] ?? 0) + 1;
    byMonth[month] = (byMonth[month] ?? 0) + 1;
  }

  return { byYear: sortRecord(byYear), byMonth: sortRecord(byMonth) };
}

export function computeCalendar(messages: RawMessage[], meta: Meta): CalendarData {
  const days: Record<string, number> = {};
  for (const m of messages) {
    const key = formatDateKey(new Date(m.timestamp));
    days[key] = (days[key] ?? 0) + 1;
  }
  return { days: sortRecord(days), startDate: meta.startDate, endDate: meta.endDate };
}

const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

export function computeHeatmap(messages: RawMessage[], meta: Meta): Heatmap {
  const grid: Record<string, number> = {};

  for (const m of messages) {
    const d = new Date(m.timestamp);
    const dow = (d.getDay() + 6) % 7; // Monday = 0, matches analysis.py's DAYS order
    const key = `${DAYS[dow]}_${pad2(d.getHours())}`;
    grid[key] = (grid[key] ?? 0) + 1;
  }

  let peakCell = '';
  let peakValue = 0;
  for (const [key, value] of Object.entries(grid)) {
    if (value > peakValue) {
      peakCell = key;
      peakValue = value;
    }
  }

  const numWeeks = Math.max(1, Math.floor(meta.totalDays / 7));
  const averages: Record<string, number> = {};
  for (const [key, count] of Object.entries(grid)) {
    averages[key] = Math.round((count / numWeeks) * 10) / 10;
  }

  return { grid, averages, peakCell, peakValue };
}

export function computeStreak(calendar: CalendarData): Streak {
  const allDays = Object.keys(calendar.days).sort();
  if (allDays.length === 0) {
    return { maxStreak: 1, bestStart: '', bestEnd: '', totalChatDays: 0 };
  }

  let maxStreak = 0;
  let curStreak = 1;
  let streakStart = allDays[0];
  let bestStart = allDays[0];
  let bestEnd = allDays[0];

  for (let i = 1; i < allDays.length; i++) {
    const prev = new Date(`${allDays[i - 1]}T00:00:00`);
    const curr = new Date(`${allDays[i]}T00:00:00`);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays === 1) {
      curStreak += 1;
      if (curStreak > maxStreak) {
        maxStreak = curStreak;
        bestStart = streakStart;
        bestEnd = allDays[i];
      }
    } else {
      curStreak = 1;
      streakStart = allDays[i];
    }
  }

  if (maxStreak === 0) maxStreak = 1;

  return { maxStreak, bestStart, bestEnd, totalChatDays: allDays.length };
}

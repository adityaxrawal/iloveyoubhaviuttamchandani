import type {
  CalendarData,
  EmojiCount,
  Heatmap,
  Initiator,
  Meta,
  MessageShape,
  Receipts,
  RawMessage,
  ResponseTime,
  SenderCounts,
  Shape,
  Streak,
  TimeOfDay,
  Vocabulary,
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

export function computeResponseTime(messages: RawMessage[], meta: Meta): ResponseTime {
  const bySender: Record<string, number[]> = {};
  for (const s of meta.participants) bySender[s] = [];

  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1];
    const curr = messages[i];
    if (prev.sender === curr.sender) continue;

    const deltaMinutes = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 60000;
    if (deltaMinutes > 0 && deltaMinutes < 1440) {
      bySender[curr.sender].push(deltaMinutes);
    }
  }

  const medianMinutes: SenderCounts = {};
  for (const s of meta.participants) {
    medianMinutes[s] = Math.round(median(bySender[s]) * 10) / 10;
  }

  return { medianMinutes };
}

export function computeInitiator(messages: RawMessage[]): Initiator {
  const dailyFirst: SenderCounts = {};
  const seenDays = new Set<string>();

  for (const m of messages) {
    const key = formatDateKey(new Date(m.timestamp));
    if (!seenDays.has(key)) {
      seenDays.add(key);
      dailyFirst[m.sender] = (dailyFirst[m.sender] ?? 0) + 1;
    }
  }

  return { dailyFirst };
}

function hourBucket(hour: number): string {
  if (hour < 5) return 'lateNight';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

export function computeTimeOfDay(messages: RawMessage[], meta: Meta): TimeOfDay {
  const bucketsBySender: Record<string, Record<string, number>> = {};
  const hourCountsBySender: Record<string, Record<number, number>> = {};
  for (const s of meta.participants) {
    bucketsBySender[s] = {};
    hourCountsBySender[s] = {};
  }

  for (const m of messages) {
    const hour = new Date(m.timestamp).getHours();
    const bucket = hourBucket(hour);
    bucketsBySender[m.sender][bucket] = (bucketsBySender[m.sender][bucket] ?? 0) + 1;
    hourCountsBySender[m.sender][hour] = (hourCountsBySender[m.sender][hour] ?? 0) + 1;
  }

  const peakHourBySender: SenderCounts = {};
  for (const s of meta.participants) {
    let peakHour = 0;
    let peakCount = -1;
    for (const [hourStr, count] of Object.entries(hourCountsBySender[s])) {
      if (count > peakCount) {
        peakCount = count;
        peakHour = Number(hourStr);
      }
    }
    peakHourBySender[s] = peakHour;
  }

  return { bucketsBySender, hourCountsBySender, peakHourBySender };
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'it', 'i', 'you', 'to', 'and', 'in', 'of', 'me', 'my', 'do',
  'so', 'but', 'be', 'for', 'on', 'at', 'we', 'he', 'she', 'they', 'this', 'that',
  'are', 'was', 'with', 'just', 'like', 'yes', 'no', 'okay', 'ok', 'haha', 'hahaha',
  'lol', 'omg', 'yeah', 'yea', 'nah', 'dont', 'cant', 'wont', 'got', 'get', 'its',
  'im', 'ive', 'ill', 'id', 'ur', 'u', 'r', 'oh', 'ah', 'hi', 'hey', 'bye', 'hmm',
  'wait', 'also', 'still', 'come', 'came', 'then', 'when', 'what', 'how', 'who',
  'why', 'one', 'two', 'now', 'too', 'not', 'about', 'more', 'will', 'said', 'well',
  'from', 'have', 'had', 'been', 'would', 'could', 'should', 'there', 'their',
]);

const WORD_RE = /\b[a-zA-Z]{3,}\b/g;

const PHRASES = [
  'i love you', 'love you', 'i miss you', 'miss you',
  'good morning', 'good night', 'haha', 'hahaha',
  "i'm sorry", 'sorry', 'thank you', 'okay', 'aww',
  'are you okay', "i'm fine", "let's go", 'no way',
];

function incrementMap<T>(map: Map<T, number>, key: T): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function topN<T>(counter: Map<T, number>, n: number): [T, number][] {
  return Array.from(counter.entries()).sort((a, b) => b[1] - a[1]).slice(0, n);
}

export function computeVocabulary(messages: RawMessage[], meta: Meta): Vocabulary {
  const allEmojis = new Map<string, number>();
  const emojisBySender: Record<string, Map<string, number>> = {};
  const wordsBySender: Record<string, Map<string, number>> = {};
  for (const s of meta.participants) {
    emojisBySender[s] = new Map();
    wordsBySender[s] = new Map();
  }

  const phraseCounts: Record<string, number> = {};
  for (const phrase of PHRASES) phraseCounts[phrase] = 0;

  for (const m of messages) {
    const lower = m.message.toLowerCase();

    for (const emoji of extractEmojis(m.message)) {
      incrementMap(allEmojis, emoji);
      incrementMap(emojisBySender[m.sender], emoji);
    }

    for (const phrase of PHRASES) {
      if (lower.includes(phrase)) phraseCounts[phrase] += 1;
    }

    const words = m.message.match(WORD_RE) ?? [];
    for (const rawWord of words) {
      const word = rawWord.toLowerCase();
      if (STOP_WORDS.has(word)) continue;
      incrementMap(wordsBySender[m.sender], word);
    }
  }

  const topWordsBySender: Record<string, [string, number][]> = {};
  const uniqueWordsBySender: Record<string, [string, number][]> = {};
  for (const s of meta.participants) {
    topWordsBySender[s] = topN(wordsBySender[s], 20);
    const other = meta.participants.find((p) => p !== s);
    uniqueWordsBySender[s] = Array.from(wordsBySender[s].entries())
      .filter(([word, count]) => count > 5 && (!other || (wordsBySender[other].get(word) ?? 0) < 2))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }

  const emojisBySenderTop: Record<string, EmojiCount[]> = {};
  for (const s of meta.participants) {
    emojisBySenderTop[s] = topN(emojisBySender[s], 6).map(([emoji, count]) => ({ emoji, count }));
  }

  return {
    topEmojis: topN(allEmojis, 12).map(([emoji, count]) => ({ emoji, count })),
    emojisBySender: emojisBySenderTop,
    phraseCounts,
    topWordsBySender,
    uniqueWordsBySender,
  };
}

export function computeMessageShape(messages: RawMessage[], meta: Meta): MessageShape {
  let longest = messages[0];
  let longestLen = 0;
  const totalLenBySender: SenderCounts = {};
  const countBySender: SenderCounts = {};

  for (const m of messages) {
    const len = codePointLength(m.message);
    totalLenBySender[m.sender] = (totalLenBySender[m.sender] ?? 0) + len;
    countBySender[m.sender] = (countBySender[m.sender] ?? 0) + 1;
    if (len > longestLen) {
      longestLen = len;
      longest = m;
    }
  }

  const avgLengthBySender: SenderCounts = {};
  for (const s of meta.participants) {
    const count = countBySender[s] ?? 0;
    avgLengthBySender[s] = count > 0 ? Math.round(((totalLenBySender[s] ?? 0) / count) * 10) / 10 : 0;
  }

  return {
    longestMessage: {
      sender: longest.sender,
      length: longestLen,
      timestamp: longest.timestamp,
      // code-point aware slice — avoids splitting a surrogate-pair emoji in half
      preview: Array.from(longest.message).slice(0, 120).join(''),
    },
    avgLengthBySender,
  };
}

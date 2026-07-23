export interface RawMessage {
  id: number;
  timestamp: string;
  date: string;
  time: string;
  sender: string;
  message: string;
}

export interface ChatExportMetadata {
  total_messages: number;
  participants: string[];
  start_date: string;
  end_date: string;
  source_file: string;
}

export interface ChatExport {
  metadata: ChatExportMetadata;
  messages: RawMessage[];
}

export type SenderCounts = Record<string, number>;

export interface Meta {
  participants: string[];
  senderA: string;
  senderB: string;
  isSolo: boolean;
  totalMessages: number;
  totalDays: number;
  startDate: string;
  endDate: string;
}

export interface Receipts {
  totalMessages: number;
  totalDays: number;
  yearsActive: number;
  photosShared: number;
  totalEmojis: number;
  loveYouCount: number;
  senderCounts: SenderCounts;
  senderShare: SenderCounts;
  doubleTexts: SenderCounts;
}

export interface Shape {
  byYear: Record<string, number>;
  byMonth: Record<string, number>;
}

export interface CalendarData {
  days: Record<string, number>;
  startDate: string;
  endDate: string;
}

export interface Heatmap {
  grid: Record<string, number>;
  averages: Record<string, number>;
  peakCell: string;
  peakValue: number;
}

export interface Streak {
  maxStreak: number;
  bestStart: string;
  bestEnd: string;
  totalChatDays: number;
}

export interface ResponseTime {
  medianMinutes: SenderCounts;
}

export interface Initiator {
  dailyFirst: SenderCounts;
}

export interface EmojiCount {
  emoji: string;
  count: number;
}

export interface Vocabulary {
  topEmojis: EmojiCount[];
  emojisBySender: Record<string, EmojiCount[]>;
  phraseCounts: Record<string, number>;
  topWordsBySender: Record<string, [string, number][]>;
  uniqueWordsBySender: Record<string, [string, number][]>;
}

export interface MessageShape {
  longestMessage: {
    sender: string;
    length: number;
    timestamp: string;
    preview: string;
  };
  avgLengthBySender: SenderCounts;
}

export interface TimeOfDay {
  bucketsBySender: Record<string, Record<string, number>>;
  peakHourBySender: Record<string, number>;
  hourCountsBySender: Record<string, Record<number, number>>;
}

export interface AnalysisResult {
  meta: Meta;
  receipts: Receipts;
  shape: Shape;
  calendar: CalendarData;
  heatmap: Heatmap;
  streak: Streak;
  responseTime: ResponseTime;
  initiator: Initiator;
  vocabulary: Vocabulary;
  messageShape: MessageShape;
  timeOfDay: TimeOfDay;
}

export interface SlideProps {
  data: AnalysisResult;
}

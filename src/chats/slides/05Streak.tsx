import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import styles from './05Streak.module.css';

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function longestGap(days: Record<string, number>, startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  let maxGap = 0;
  let curGap = 0;
  const cur = new Date(start);
  while (cur.getTime() <= end.getTime()) {
    const key = `${cur.getFullYear()}-${pad2(cur.getMonth() + 1)}-${pad2(cur.getDate())}`;
    if (days[key]) {
      curGap = 0;
    } else {
      curGap += 1;
      maxGap = Math.max(maxGap, curGap);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return maxGap;
}

export default function Streak({ data }: SlideProps) {
  const { streak, meta, calendar } = data;
  const percentActive = meta.totalDays > 0 ? Math.round((streak.totalChatDays / meta.totalDays) * 100) : 0;
  const avgPerDay = streak.totalChatDays > 0 ? Math.round(meta.totalMessages / streak.totalChatDays) : 0;
  const quietGap = longestGap(calendar.days, meta.startDate, meta.endDate);

  const subtitle =
    streak.maxStreak === 1
      ? 'Your longest streak was a single day — but you always came back.'
      : `You texted every single day for ${streak.maxStreak} days straight.`;

  return (
    <Card label="UNBROKEN CONNECTION" title="The streak" subtitle={subtitle}>
      <div className={styles.container}>
        {/* Flame Hero Emblem */}
        <div className={styles.flameHero}>
          <span className={styles.flameIcon}>🔥</span>
          <span className={styles.flameNum}>{streak.maxStreak}</span>
          <span className={styles.flameTag}>Consecutive Days</span>
        </div>

        {/* Timeline Range Pill */}
        <div className={styles.datesPill}>
          <span>{streak.bestStart}</span>
          <span className={styles.arrow}>➔</span>
          <span>{streak.bestEnd}</span>
          <span className={styles.badge}>{percentActive}% Active</span>
        </div>

        {/* 2x2 Stat Grid */}
        <div className={styles.grid}>
          <StatBox number={streak.totalChatDays} label="Active Chat Days" />
          <StatBox number={avgPerDay} label="Avg Texts / Active Day" />
          <StatBox number={percentActive} label="% Days Active" />
          <StatBox number={quietGap} label="Quiet Gap (Days)" />
        </div>
      </div>
    </Card>
  );
}

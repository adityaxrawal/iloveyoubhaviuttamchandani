import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import styles from './05Streak.module.css';

export default function Streak({ data }: SlideProps) {
  const { streak, meta } = data;
  const percentActive = meta.totalDays > 0 ? Math.round((streak.totalChatDays / meta.totalDays) * 100) : 0;

  const subtitle =
    streak.maxStreak === 1
      ? 'Your longest streak was a single day — but you always came back.'
      : `You texted every single day for ${streak.maxStreak} days straight.`;

  return (
    <Card label="Consistency" title="The streak" subtitle={subtitle}>
      <div className={styles.grid}>
        <StatBox number={streak.maxStreak} label="Day streak" />
        <StatBox number={streak.totalChatDays} label="Active days" />
      </div>
      <p className={styles.dates}>
        {streak.bestStart} → {streak.bestEnd} · {percentActive}% of the chat period
      </p>
    </Card>
  );
}

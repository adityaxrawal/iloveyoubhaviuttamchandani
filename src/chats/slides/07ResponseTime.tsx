import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import styles from './07ResponseTime.module.css';

function formatMinutes(min: number): string {
  if (min < 2) return 'Under 2 min';
  if (min > 60) return `${Math.round((min / 60) * 10) / 10}h`;
  return `${Math.round(min * 10) / 10} min`;
}

function ReplyStat({ name, minutes }: { name: string; minutes: number }) {
  return (
    <div className={styles.speedBox}>
      <span className={styles.speedIcon}>⚡</span>
      <p className={styles.statValue}>{formatMinutes(minutes)}</p>
      <p className={styles.statLabel}>{name}</p>
    </div>
  );
}

export default function ResponseTime({ data }: SlideProps) {
  const { responseTime, meta } = data;
  const medA = responseTime.medianMinutes[meta.senderA] ?? 0;
  const medB = responseTime.medianMinutes[meta.senderB] ?? 0;

  return (
    <Card
      label="SPEED OF LOVE"
      title="Response time"
      subtitle="Median time to reply — ignoring gaps over 24 hours."
      footer={medA < 2 && medB < 2 ? '⚡ Under 2 minutes — basically in the exact same room!' : undefined}
    >
      <div className={styles.container}>
        {/* Median Speed Tiles */}
        <div className={styles.grid}>
          <ReplyStat name={meta.senderA} minutes={medA} />
          {!meta.isSolo && <ReplyStat name={meta.senderB} minutes={medB} />}
        </div>

        {/* Instant Replies */}
        <div className={styles.sectionWrap}>
          <p className={styles.sectionLabel}>⚡ Instant Replies (&lt; 1 minute)</p>
          <div className={styles.grid}>
            <StatBox number={responseTime.instantCounts[meta.senderA] ?? 0} label={meta.senderA.split(' ')[0]} />
            {!meta.isSolo && <StatBox number={responseTime.instantCounts[meta.senderB] ?? 0} label={meta.senderB.split(' ')[0]} />}
          </div>
        </div>

        {/* Slow Replies */}
        <div className={styles.sectionWrap}>
          <p className={styles.sectionLabel}>🐢 Slow Replies (&gt; 60 minutes)</p>
          <div className={styles.grid}>
            <StatBox number={responseTime.slowCounts[meta.senderA] ?? 0} label={meta.senderA.split(' ')[0]} />
            {!meta.isSolo && <StatBox number={responseTime.slowCounts[meta.senderB] ?? 0} label={meta.senderB.split(' ')[0]} />}
          </div>
        </div>
      </div>
    </Card>
  );
}

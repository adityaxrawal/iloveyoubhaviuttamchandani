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
    <div className={styles.statBox}>
      <p className={styles.statValue}>{formatMinutes(minutes)}</p>
      <p className={styles.statLabel}>{name}</p>
    </div>
  );
}

export default function ResponseTime({ data }: SlideProps) {
  const { responseTime, meta } = data;

  if (meta.isSolo) {
    return (
      <Card label="How fast we reply" title="Response time">
        <ReplyStat name={meta.senderA} minutes={responseTime.medianMinutes[meta.senderA] ?? 0} />
        <div className={styles.grid}>
          <StatBox number={responseTime.instantCounts[meta.senderA] ?? 0} label="Instant replies (<1 min)" />
          <StatBox number={responseTime.slowCounts[meta.senderA] ?? 0} label="Slow replies (>60 min)" />
        </div>
      </Card>
    );
  }

  const medA = responseTime.medianMinutes[meta.senderA] ?? 0;
  const medB = responseTime.medianMinutes[meta.senderB] ?? 0;

  return (
    <Card
      label="How fast we reply"
      title="Response time"
      subtitle="Median minutes to reply — ignoring gaps over 24 hours."
      footer={medA < 2 && medB < 2 ? 'Under 2 minutes — basically the same room.' : undefined}
    >
      <div className={styles.grid}>
        <ReplyStat name={meta.senderA} minutes={medA} />
        <ReplyStat name={meta.senderB} minutes={medB} />
      </div>

      <p className={styles.sectionLabel}>Instant replies (under 1 minute)</p>
      <div className={styles.grid}>
        <StatBox number={responseTime.instantCounts[meta.senderA] ?? 0} label={meta.senderA} />
        <StatBox number={responseTime.instantCounts[meta.senderB] ?? 0} label={meta.senderB} />
      </div>

      <p className={styles.sectionLabel}>Slow replies (over 60 minutes)</p>
      <div className={styles.grid}>
        <StatBox number={responseTime.slowCounts[meta.senderA] ?? 0} label={meta.senderA} />
        <StatBox number={responseTime.slowCounts[meta.senderB] ?? 0} label={meta.senderB} />
      </div>
    </Card>
  );
}

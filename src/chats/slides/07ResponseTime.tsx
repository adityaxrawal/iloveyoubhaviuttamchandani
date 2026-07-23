import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import styles from './07ResponseTime.module.css';

function formatMinutes(min: number): string {
  if (min < 2) return 'Under 2 min';
  if (min > 60) return `${Math.round((min / 60) * 10) / 10}h`;
  return `${min} min`;
}

export default function ResponseTime({ data }: SlideProps) {
  const { responseTime, meta } = data;

  if (meta.isSolo) {
    return (
      <Card label="How fast we reply" title="Response time">
        <StatBox number={responseTime.medianMinutes[meta.senderA] ?? 0} label={`${meta.senderA} · median reply (min)`} />
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
        <div>
          <StatBox number={medA} label={`${meta.senderA} · ${formatMinutes(medA)}`} />
        </div>
        <div>
          <StatBox number={medB} label={`${meta.senderB} · ${formatMinutes(medB)}`} />
        </div>
      </div>
    </Card>
  );
}

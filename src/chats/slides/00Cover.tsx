import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import styles from './00Cover.module.css';

function formatMonthYear(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Cover({ data }: SlideProps) {
  const { meta } = data;
  const range = meta.isSolo
    ? formatMonthYear(meta.startDate)
    : `${formatMonthYear(meta.startDate)} – ${formatMonthYear(meta.endDate)}`;

  return (
    <Card label={meta.participants.join(' & ')} title="Our story, by the numbers.">
      <div className={styles.wrap}>
        <span className={styles.names} aria-hidden="true">
          {meta.senderA.slice(0, 1)} ♡ {meta.senderB ? meta.senderB.slice(0, 1) : ''}
        </span>
        <span className={styles.range}>{range}</span>
      </div>
    </Card>
  );
}

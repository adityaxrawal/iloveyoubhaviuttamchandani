import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import styles from './00Cover.module.css';

function formatMonthYear(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Cover({ data }: SlideProps) {
  const { meta, receipts } = data;
  const range = meta.isSolo
    ? formatMonthYear(meta.startDate)
    : `${formatMonthYear(meta.startDate)} – ${formatMonthYear(meta.endDate)}`;

  return (
    <Card label="CHAPTER 01 · OUR STORY IN NUMBERS" title="Our story, by the numbers.">
      <div className={styles.container}>
        {/* Embossed Wax Seal Badge */}
        <div className={styles.sealBadge}>
          <div className={styles.sealOuter}>
            <span className={styles.sealHeart}>♡</span>
            <span className={styles.sealInitials}>{meta.senderA.split(' ')[0]} & {meta.senderB.split(' ')[0]}</span>
          </div>
        </div>

        <p className={styles.dateRange}>{range}</p>

        {/* Hero Quick Stat Pills */}
        <div className={styles.pillGrid}>
          <div className={styles.statPill}>
            <span className={styles.pillValue}>{meta.totalMessages.toLocaleString()}</span>
            <span className={styles.pillLabel}>Messages</span>
          </div>
          <div className={styles.statPill}>
            <span className={styles.pillValue}>{meta.totalDays}</span>
            <span className={styles.pillLabel}>Days Active</span>
          </div>
          <div className={styles.statPill}>
            <span className={styles.pillValue}>{receipts.loveYouCount.toLocaleString()}</span>
            <span className={styles.pillLabel}>&ldquo;I Love You&rdquo;s</span>
          </div>
        </div>

        <div className={styles.actionHint}>
          <span>Tap or swipe to unwrap our story</span>
          <span className={styles.arrowAnim}>→</span>
        </div>
      </div>
    </Card>
  );
}

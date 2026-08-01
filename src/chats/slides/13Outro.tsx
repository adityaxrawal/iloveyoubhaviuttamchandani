import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import styles from './13Outro.module.css';

export default function Outro({ data }: SlideProps) {
  const { meta, receipts } = data;
  const lastDate = meta.endDate
    ? new Date(meta.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Card label="THE NEXT CHAPTER" title="And we're still counting.">
      <div className={styles.container}>
        {/* Pulsing Seal Heart */}
        <div className={styles.sealWrap}>
          <span className={styles.pulseHeart}>♡</span>
        </div>

        {/* Hero Totals Box */}
        <div className={styles.totalsBox}>
          <p className={styles.bigStat}>{meta.totalMessages.toLocaleString()}</p>
          <p className={styles.bigStatLabel}>Messages Exchanged Over {meta.totalDays.toLocaleString()} Days</p>
          <p className={styles.lastDateTag}>Through {lastDate}</p>
        </div>

        {/* Recap Items */}
        <div className={styles.recapGrid}>
          <div className={styles.recapPill}>
            <span>😍 {receipts.totalEmojis.toLocaleString()} Emojis</span>
          </div>
          <div className={styles.recapPill}>
            <span>❤️ {receipts.loveYouCount.toLocaleString()} &ldquo;I Love You&rdquo;s</span>
          </div>
          <div className={styles.recapPill}>
            <span>📸 {receipts.photosShared.toLocaleString()} Photos</span>
          </div>
        </div>

        <p className={styles.closingText}>
          Export your next chapter whenever you&rsquo;re ready. Our story continues every single day.
        </p>
      </div>
    </Card>
  );
}

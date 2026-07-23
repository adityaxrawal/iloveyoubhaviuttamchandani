import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import styles from './13Outro.module.css';

export default function Outro({ data }: SlideProps) {
  const { meta, receipts } = data;
  const lastDate = meta.endDate
    ? new Date(meta.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Card title="And we're still counting.">
      <div className={styles.wrap}>
        <span className={styles.heart} aria-hidden="true">♡</span>
        <p>{meta.totalMessages.toLocaleString()} messages. {meta.totalDays.toLocaleString()} days. {lastDate}.</p>
        <p className={styles.recap}>
          {receipts.totalEmojis.toLocaleString()} emojis · {receipts.loveYouCount.toLocaleString()} &ldquo;I love you&rdquo;s · {receipts.photosShared.toLocaleString()} photos shared
        </p>
        <p>Export your next chapter whenever you're ready.</p>
      </div>
    </Card>
  );
}

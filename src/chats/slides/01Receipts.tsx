import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import SenderSplitBar from '../components/SenderSplitBar';
import styles from './01Receipts.module.css';

export default function Receipts({ data }: SlideProps) {
  const { receipts, meta } = data;

  return (
    <Card label="By the numbers" title="The receipts.">
      <div className={styles.grid}>
        <StatBox number={receipts.totalMessages} label="Messages" />
        <StatBox number={receipts.totalDays} label="Days" />
        <StatBox number={receipts.yearsActive} label="Years & counting" />
        <StatBox number={receipts.photosShared} label="Photos shared" />
        <StatBox number={receipts.totalEmojis} label="Emojis" />
        <StatBox number={receipts.loveYouCount} label="'Love you's" />
      </div>
      {!meta.isSolo && (
        <SenderSplitBar
          leftLabel={meta.senderA}
          leftPercent={receipts.senderShare[meta.senderA] ?? 0}
          rightLabel={meta.senderB}
          rightPercent={receipts.senderShare[meta.senderB] ?? 0}
        />
      )}
    </Card>
  );
}

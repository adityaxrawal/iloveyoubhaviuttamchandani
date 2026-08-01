import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import SenderSplitBar from '../components/SenderSplitBar';
import styles from './01Receipts.module.css';

export default function Receipts({ data }: SlideProps) {
  const { receipts, meta } = data;

  return (
    <Card label="THE OFFICIAL LEDGER" title="The receipts.">
      <div className={styles.receiptContainer}>
        {/* Serrated Ticket Top Header */}
        <div className={styles.receiptHeader}>
          <span className={styles.receiptIcon}>🧾</span>
          <span className={styles.heroTotal}>{receipts.totalMessages.toLocaleString()}</span>
          <span className={styles.heroSub}>Total Messages Exchanged</span>
        </div>

        {/* 2x3 Icon Stat Grid */}
        <div className={styles.grid}>
          <div className={styles.statCell}>
            <span className={styles.icon}>📅</span>
            <StatBox number={receipts.totalDays} label="Days Talking" />
          </div>
          <div className={styles.statCell}>
            <span className={styles.icon}>⏳</span>
            <StatBox number={1} label="Year & Counting" />
          </div>
          <div className={styles.statCell}>
            <span className={styles.icon}>📸</span>
            <StatBox number={receipts.photosShared} label="Photos Shared" />
          </div>
          <div className={styles.statCell}>
            <span className={styles.icon}>😍</span>
            <StatBox number={receipts.totalEmojis} label="Emojis Sent" />
          </div>
          <div className={styles.statCell}>
            <span className={styles.icon}>❤️</span>
            <StatBox number={receipts.loveYouCount} label="'Love You's" />
          </div>
          <div className={styles.statCell}>
            <span className={styles.icon}>⚡</span>
            <StatBox number={(receipts.doubleTexts[meta.senderA] ?? 0) + (receipts.doubleTexts[meta.senderB] ?? 0)} label="Double Texts" />
          </div>
        </div>

        {/* Sender Share Split */}
        {!meta.isSolo && (
          <div className={styles.splitSection}>
            <p className={styles.splitLabel}>Message Balance Share</p>
            <SenderSplitBar
              leftLabel={meta.senderA}
              leftPercent={receipts.senderShare[meta.senderA] ?? 0}
              rightLabel={meta.senderB}
              rightPercent={receipts.senderShare[meta.senderB] ?? 0}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

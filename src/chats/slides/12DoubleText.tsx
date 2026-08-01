import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import SenderSplitBar from '../components/SenderSplitBar';
import styles from './12DoubleText.module.css';

export default function DoubleText({ data }: SlideProps) {
  const { receipts, meta } = data;
  const aCount = receipts.doubleTexts[meta.senderA] ?? 0;
  const bCount = meta.isSolo ? 0 : receipts.doubleTexts[meta.senderB] ?? 0;
  const winner = aCount >= bCount ? meta.senderA.split(' ')[0] : meta.senderB.split(' ')[0];

  const aMessages = receipts.senderCounts[meta.senderA] ?? 0;
  const bMessages = meta.isSolo ? 0 : receipts.senderCounts[meta.senderB] ?? 0;
  const aSharePercent = aMessages > 0 ? Math.round((aCount / aMessages) * 100) : 0;
  const bSharePercent = bMessages > 0 ? Math.round((bCount / bMessages) * 100) : 0;

  const total = aCount + bCount;
  const aPercent = total > 0 ? Math.round((aCount / total) * 100) : 0;
  const bPercent = 100 - aPercent;

  return (
    <Card
      label="COULDN'T WAIT"
      title="Double texts"
      subtitle="Who sent back-to-back texts without waiting for a reply."
    >
      <div className={styles.container}>
        {/* Winner Announcement Banner */}
        <div className={styles.winnerCard}>
          <span className={styles.crownIcon}>👑</span>
          <p className={styles.winnerText}>
            <strong>{winner}</strong> takes the crown for double texting!
          </p>
        </div>

        {/* Double Text Count Stats */}
        <div className={styles.grid}>
          <StatBox number={aCount} label={`${meta.senderA.split(' ')[0]} Double Texts`} />
          {!meta.isSolo && <StatBox number={bCount} label={`${meta.senderB.split(' ')[0]} Double Texts`} />}
        </div>

        {!meta.isSolo && (
          <>
            <div className={styles.splitWrap}>
              <SenderSplitBar leftLabel={meta.senderA} leftPercent={aPercent} rightLabel={meta.senderB} rightPercent={bPercent} />
            </div>

            {/* Share of own messages */}
            <div className={styles.ownSection}>
              <p className={styles.sectionLabel}>Share of own messages that were double texts</p>
              <div className={styles.grid}>
                <StatBox number={aSharePercent} label={`${meta.senderA.split(' ')[0]} %`} />
                <StatBox number={bSharePercent} label={`${meta.senderB.split(' ')[0]} %`} />
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

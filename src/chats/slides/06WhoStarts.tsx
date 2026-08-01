import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import SenderSplitBar from '../components/SenderSplitBar';
import styles from './06WhoStarts.module.css';

export default function WhoStarts({ data }: SlideProps) {
  const { initiator, meta } = data;
  const aCount = initiator.dailyFirst[meta.senderA] ?? 0;
  const bCount = meta.isSolo ? 0 : initiator.dailyFirst[meta.senderB] ?? 0;
  const total = aCount + bCount;
  const aPercent = total > 0 ? Math.round((aCount / total) * 100) : 0;
  const bPercent = 100 - aPercent;

  const starterName = aCount >= bCount ? meta.senderA.split(' ')[0] : meta.senderB.split(' ')[0];

  return (
    <Card
      label="THE GOOD MORNING BATTLE"
      title="Who starts it"
      subtitle="Who sent the first text of the day, every morning."
    >
      <div className={styles.container}>
        {/* Crown Announcement Banner */}
        <div className={styles.starterBanner}>
          <span className={styles.sunIcon}>🌅</span>
          <span className={styles.bannerText}>
            <strong>{starterName}</strong> is the early riser who kicked off most mornings!
          </span>
        </div>

        {/* Sender Split Progress */}
        {!meta.isSolo && (
          <div className={styles.splitWrap}>
            <SenderSplitBar leftLabel={meta.senderA} leftPercent={aPercent} rightLabel={meta.senderB} rightPercent={bPercent} />
          </div>
        )}

        {/* Dual Stat Cards */}
        <div className={styles.grid}>
          <StatBox number={aCount} label={`${meta.senderA.split(' ')[0]} · Days Started`} />
          {!meta.isSolo && <StatBox number={bCount} label={`${meta.senderB.split(' ')[0]} · Days Started`} />}
        </div>

        <p className={styles.footnote}>
          Out of {total} total days tracked, {meta.senderA.split(' ')[0]} started {aCount} days ({aPercent}%) and {meta.senderB.split(' ')[0]} started {bCount} days ({bPercent}%).
        </p>
      </div>
    </Card>
  );
}

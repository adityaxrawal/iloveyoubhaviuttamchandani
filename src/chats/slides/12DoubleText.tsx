import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import SenderSplitBar from '../components/SenderSplitBar';
import styles from './12DoubleText.module.css';

export default function DoubleText({ data }: SlideProps) {
  const { receipts, meta } = data;
  const aCount = receipts.doubleTexts[meta.senderA] ?? 0;
  const bCount = meta.isSolo ? 0 : receipts.doubleTexts[meta.senderB] ?? 0;
  const winner = aCount >= bCount ? meta.senderA : meta.senderB;

  const aMessages = receipts.senderCounts[meta.senderA] ?? 0;
  const bMessages = meta.isSolo ? 0 : receipts.senderCounts[meta.senderB] ?? 0;
  const aSharePercent = aMessages > 0 ? Math.round((aCount / aMessages) * 100) : 0;
  const bSharePercent = bMessages > 0 ? Math.round((bCount / bMessages) * 100) : 0;

  const total = aCount + bCount;
  const aPercent = total > 0 ? Math.round((aCount / total) * 100) : 0;
  const bPercent = 100 - aPercent;

  return (
    <Card label="Couldn't wait" title="Double texts" subtitle="Who sent two messages in a row without waiting for a reply.">
      <div className={styles.stats}>
        <StatBox number={aCount} label={`${meta.senderA} · double texts`} />
        {!meta.isSolo && <StatBox number={bCount} label={`${meta.senderB} · double texts`} />}
      </div>
      {!meta.isSolo && (
        <>
          <SenderSplitBar leftLabel={meta.senderA} leftPercent={aPercent} rightLabel={meta.senderB} rightPercent={bPercent} />
          <p>{winner} can&rsquo;t wait.</p>

          <p className={styles.sectionLabel}>Share of own messages that were double texts</p>
          <div className={styles.grid}>
            <StatBox number={aSharePercent} label={`${meta.senderA} %`} />
            <StatBox number={bSharePercent} label={`${meta.senderB} %`} />
          </div>
        </>
      )}
    </Card>
  );
}

import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';

export default function DoubleText({ data }: SlideProps) {
  const { receipts, meta } = data;
  const aCount = receipts.doubleTexts[meta.senderA] ?? 0;
  const bCount = meta.isSolo ? 0 : receipts.doubleTexts[meta.senderB] ?? 0;
  const winner = aCount >= bCount ? meta.senderA : meta.senderB;

  return (
    <Card label="Couldn't wait" title="Double texts" subtitle="Who sent two messages in a row without waiting for a reply.">
      <StatBox number={aCount} label={`${meta.senderA} · double texts`} />
      {!meta.isSolo && <StatBox number={bCount} label={`${meta.senderB} · double texts`} />}
      {!meta.isSolo && <p>{winner} can&rsquo;t wait.</p>}
    </Card>
  );
}

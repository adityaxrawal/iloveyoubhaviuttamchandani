import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import SenderSplitBar from '../components/SenderSplitBar';

export default function WhoStarts({ data }: SlideProps) {
  const { initiator, meta } = data;
  const aCount = initiator.dailyFirst[meta.senderA] ?? 0;
  const bCount = meta.isSolo ? 0 : initiator.dailyFirst[meta.senderB] ?? 0;
  const total = aCount + bCount;
  const aPercent = total > 0 ? Math.round((aCount / total) * 100) : 0;
  const bPercent = 100 - aPercent;

  if (meta.isSolo) {
    return (
      <Card label="Who texts first" title="Who starts it" subtitle="Who sent the first message of the day, every day.">
        <StatBox number={aCount} label={`${meta.senderA} · days started`} />
      </Card>
    );
  }

  return (
    <Card
      label="Who texts first"
      title="Who starts it"
      subtitle="Who sent the first message of the day, every day."
      footer={`${meta.senderA.split(' ')[0]} kicked things off ${aCount} days. ${meta.senderB.split(' ')[0]} started ${bCount}.`}
    >
      <SenderSplitBar leftLabel={meta.senderA} leftPercent={aPercent} rightLabel={meta.senderB} rightPercent={bPercent} />
    </Card>
  );
}

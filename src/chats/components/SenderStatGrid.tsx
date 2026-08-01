import type { Meta } from '../lib/types';
import StatBox from './StatBox';

interface SenderStatGridProps {
  meta: Meta;
  countA: number;
  countB: number;
  labelSuffix: string;
  gridClassName?: string;
}

export default function SenderStatGrid({
  meta,
  countA,
  countB,
  labelSuffix,
  gridClassName,
}: SenderStatGridProps) {
  const firstNameA = meta.senderA.split(' ')[0];
  const firstNameB = meta.senderB.split(' ')[0];

  return (
    <div className={gridClassName}>
      <StatBox number={countA} label={`${firstNameA}${labelSuffix}`} />
      {!meta.isSolo && <StatBox number={countB} label={`${firstNameB}${labelSuffix}`} />}
    </div>
  );
}

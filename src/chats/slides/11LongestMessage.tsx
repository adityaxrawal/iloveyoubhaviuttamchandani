import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import styles from './11LongestMessage.module.css';

export default function LongestMessage({ data }: SlideProps) {
  const { longestMessage, avgLengthBySender } = data.messageShape;
  const { meta } = data;
  const dateStr = longestMessage.timestamp
    ? new Date(longestMessage.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Card label="Went off" title="The longest message" subtitle={`${longestMessage.length.toLocaleString()} characters. Sent on ${dateStr}.`}>
      <div className={styles.bubble}>
        <div className={styles.bubbleHeader}>{longestMessage.sender} · {dateStr}</div>
        <div className={styles.bubbleBody}>&ldquo;{longestMessage.preview}&hellip;&rdquo;</div>
        <div className={styles.bubbleFooter}>{longestMessage.length.toLocaleString()} characters</div>
      </div>

      <p className={styles.sectionLabel}>Average message length (characters)</p>
      {meta.isSolo ? (
        <StatBox number={Math.round(avgLengthBySender[meta.senderA] ?? 0)} label={meta.senderA} />
      ) : (
        <div className={styles.grid}>
          <StatBox number={Math.round(avgLengthBySender[meta.senderA] ?? 0)} label={meta.senderA} />
          <StatBox number={Math.round(avgLengthBySender[meta.senderB] ?? 0)} label={meta.senderB} />
        </div>
      )}
    </Card>
  );
}

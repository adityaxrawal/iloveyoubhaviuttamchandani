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
    <Card
      label="THE MIDNIGHT NOVEL"
      title="The longest message"
      subtitle={`${longestMessage.length.toLocaleString()} characters sent on ${dateStr}`}
    >
      <div className={styles.container}>
        {/* Quote Bubble Card */}
        <div className={styles.bubble}>
          <div className={styles.bubbleHeader}>
            <span>📜 {longestMessage.sender.split(' ')[0]}&rsquo;s Novel</span>
            <span>{dateStr}</span>
          </div>
          <div className={styles.bubbleBody}>&ldquo;{longestMessage.preview}&hellip;&rdquo;</div>
          <div className={styles.bubbleFooter}>Length: {longestMessage.length.toLocaleString()} characters</div>
        </div>

        {/* Avg Message Length */}
        <div className={styles.avgSection}>
          <p className={styles.sectionLabel}>Average Message Length (Characters)</p>
          <div className={styles.grid}>
            <StatBox number={Math.round(avgLengthBySender[meta.senderA] ?? 0)} label={`${meta.senderA.split(' ')[0]} Avg`} />
            {!meta.isSolo && (
              <StatBox number={Math.round(avgLengthBySender[meta.senderB] ?? 0)} label={`${meta.senderB.split(' ')[0]} Avg`} />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

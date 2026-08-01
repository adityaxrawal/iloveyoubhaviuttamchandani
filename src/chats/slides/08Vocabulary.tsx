import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import styles from './08Vocabulary.module.css';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Vocabulary({ data }: SlideProps) {
  const { vocabulary, receipts } = data;

  return (
    <Card label="EXPRESSIONS OF AFFECTION" title="The vocabulary">
      <div className={styles.container}>
        {/* Affection Spotlight Card */}
        <div className={styles.loveYouCard}>
          <span className={styles.heartPulse}>❤️</span>
          <p className={styles.loveYouPrefix}>&ldquo;I love you&rdquo; was typed</p>
          <p className={styles.loveYouNumber}>{receipts.loveYouCount.toLocaleString()}</p>
          <p className={styles.loveYouSuffix}>unforgettable times</p>
        </div>

        {/* Emoji Top Grid */}
        <p className={styles.emojiGridLabel}>Most Used Emojis</p>
        <div className={styles.emojiGrid}>
          {vocabulary.topEmojis.slice(0, 9).map((e, i) => (
            <div key={e.emoji} className={styles.emojiCell}>
              {i < 3 && <span className={styles.medal}>{MEDALS[i]}</span>}
              <div className={styles.emojiChar}>{e.emoji}</div>
              <div className={styles.emojiCount}>{e.count.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

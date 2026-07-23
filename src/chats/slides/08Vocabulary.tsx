import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import styles from './08Vocabulary.module.css';

export default function Vocabulary({ data }: SlideProps) {
  const { vocabulary, receipts } = data;

  return (
    <Card label="What we say" title="The vocabulary">
      <div className={styles.loveYou}>
        <p>&ldquo;I love you&rdquo; was typed</p>
        <p className={styles.loveYouNumber}>{receipts.loveYouCount.toLocaleString()}</p>
        <p>times.</p>
      </div>
      <div className={styles.emojiGrid}>
        {vocabulary.topEmojis.slice(0, 9).map((e, i) => (
          <div key={e.emoji} className={`${styles.emojiCell} ${i >= 3 ? styles.emojiCellDashed : ''}`}>
            <div className={styles.emojiChar}>{e.emoji}</div>
            <div className={styles.emojiCount}>{e.count.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

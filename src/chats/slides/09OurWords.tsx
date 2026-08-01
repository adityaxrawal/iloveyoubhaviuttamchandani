import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import styles from './09OurWords.module.css';

function WordColumn({ words, title }: { words: [string, number][]; title: string }) {
  const max = Math.max(1, ...words.map(([, count]) => count));
  return (
    <div className={styles.wordCard}>
      <p className={styles.columnTitle}>{title}</p>
      <div className={styles.wordList}>
        {words.slice(0, 6).map(([word, count]) => (
          <div key={word} className={styles.wordRow}>
            <span className={styles.wordLabel}>{word}</span>
            <div className={styles.barTrack}>
              <div className={styles.wordBar} style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <span className={styles.wordCount}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OurWords({ data }: SlideProps) {
  const { vocabulary, meta } = data;
  const topWordsA = vocabulary.topWordsBySender[meta.senderA]?.slice(0, 6) ?? [];
  const topWordsB = vocabulary.topWordsBySender[meta.senderB]?.slice(0, 6) ?? [];

  return (
    <Card
      label="OUR SECRET DICTIONARY"
      title="Our words"
      subtitle="Words used exclusively by each of us"
    >
      <div className={styles.container}>
        <div className={styles.columns}>
          <WordColumn title={`Exclusive to ${meta.senderA.split(' ')[0]}`} words={vocabulary.uniqueWordsBySender[meta.senderA] ?? []} />
          <WordColumn title={`Exclusive to ${meta.senderB.split(' ')[0]}`} words={vocabulary.uniqueWordsBySender[meta.senderB] ?? []} />
        </div>

        <p className={styles.sectionLabel}>Most Used Words Overall</p>
        <div className={styles.columns}>
          <WordColumn title={`${meta.senderA.split(' ')[0]}'s Top`} words={topWordsA} />
          <WordColumn title={`${meta.senderB.split(' ')[0]}'s Top`} words={topWordsB} />
        </div>
      </div>
    </Card>
  );
}

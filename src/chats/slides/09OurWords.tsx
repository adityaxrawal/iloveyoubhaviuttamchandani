import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import styles from './09OurWords.module.css';

function WordColumn({ words }: { words: [string, number][] }) {
  const max = Math.max(1, ...words.map(([, count]) => count));
  return (
    <div>
      {words.map(([word, count]) => (
        <div key={word} className={styles.wordRow}>
          <span className={styles.wordLabel}>{word}</span>
          <div className={styles.wordBar} style={{ width: `${(count / max) * 100}%` }} />
        </div>
      ))}
    </div>
  );
}

export default function OurWords({ data }: SlideProps) {
  const { vocabulary, meta } = data;
  const topWordsA = vocabulary.topWordsBySender[meta.senderA]?.slice(0, 8) ?? [];
  const topWordsB = vocabulary.topWordsBySender[meta.senderB]?.slice(0, 8) ?? [];

  if (meta.isSolo) {
    return (
      <Card label="Our dictionary" title="Our words">
        <WordColumn words={vocabulary.uniqueWordsBySender[meta.senderA] ?? []} />
        <p className={styles.sectionLabel}>Most-used words overall</p>
        <WordColumn words={topWordsA} />
      </Card>
    );
  }

  return (
    <Card
      label="Our dictionary"
      title="Our words"
      subtitle={`Words only ${meta.senderA} uses vs words only ${meta.senderB} uses.`}
    >
      <div className={styles.columns}>
        <WordColumn words={vocabulary.uniqueWordsBySender[meta.senderA] ?? []} />
        <WordColumn words={vocabulary.uniqueWordsBySender[meta.senderB] ?? []} />
      </div>

      <p className={styles.sectionLabel}>Most-used words overall</p>
      <div className={styles.columns}>
        <WordColumn words={topWordsA} />
        <WordColumn words={topWordsB} />
      </div>
    </Card>
  );
}

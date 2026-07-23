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

  if (meta.isSolo) {
    return (
      <Card label="Our dictionary" title="Our words">
        <WordColumn words={vocabulary.uniqueWordsBySender[meta.senderA] ?? []} />
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
    </Card>
  );
}

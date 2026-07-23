import { useCountUp } from '../lib/useCountUp';
import styles from './StatBox.module.css';

interface StatBoxProps {
  number: number;
  label: string;
}

export default function StatBox({ number, label }: StatBoxProps) {
  const animated = useCountUp(number);
  return (
    <div className={styles.statBox}>
      <p className={styles.stat}>{animated.toLocaleString()}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}

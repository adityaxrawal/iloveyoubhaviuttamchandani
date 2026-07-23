import styles from './SenderSplitBar.module.css';

interface SenderSplitBarProps {
  leftLabel: string;
  leftPercent: number;
  rightLabel: string;
  rightPercent: number;
}

export default function SenderSplitBar({ leftLabel, leftPercent, rightLabel, rightPercent }: SenderSplitBarProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.left} style={{ width: `${leftPercent}%` }} />
        <div className={styles.right} style={{ width: `${rightPercent}%` }} />
      </div>
      <div className={styles.labels}>
        <span>{leftLabel} · {leftPercent}%</span>
        <span>{rightLabel} · {rightPercent}%</span>
      </div>
    </div>
  );
}

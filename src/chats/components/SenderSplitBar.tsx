import styles from './SenderSplitBar.module.css';

interface SenderSplitBarProps {
  leftLabel: string;
  leftPercent: number;
  rightLabel: string;
  rightPercent: number;
}

export default function SenderSplitBar({ leftLabel, leftPercent, rightLabel, rightPercent }: SenderSplitBarProps) {
  const leftInitial = leftLabel.split(' ')[0][0] || 'A';
  const rightInitial = rightLabel.split(' ')[0][0] || 'B';

  return (
    <div className={styles.wrap}>
      <div className={styles.barContainer}>
        <div className={styles.bar}>
          <div className={styles.left} style={{ width: `${leftPercent}%` }} />
          <div className={styles.right} style={{ width: `${rightPercent}%` }} />
        </div>
        <div className={styles.midpointMarker} title="50% Balance Marker">
          <span>♡</span>
        </div>
      </div>

      <div className={styles.labels}>
        <div className={styles.partnerBadge}>
          <span className={styles.avatarLeft}>{leftInitial}</span>
          <span className={styles.name}>{leftLabel.split(' ')[0]}</span>
          <span className={styles.percent}>{leftPercent}%</span>
        </div>

        <div className={styles.partnerBadge}>
          <span className={styles.percent}>{rightPercent}%</span>
          <span className={styles.name}>{rightLabel.split(' ')[0]}</span>
          <span className={styles.avatarRight}>{rightInitial}</span>
        </div>
      </div>
    </div>
  );
}

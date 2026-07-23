import { Fragment, useState } from 'react';
import { heatmapColorVar } from '../lib/heatmapColor';
import styles from './HeatmapGrid.module.css';

const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

interface HeatmapGridProps {
  grid: Record<string, number>;
  onCellSelect?: (key: string, count: number) => void;
}

export default function HeatmapGrid({ grid, onCellSelect }: HeatmapGridProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (key: string, count: number) => {
    const next = selected === key ? null : key;
    setSelected(next);
    onCellSelect?.(key, count);
  };

  return (
    <div className={styles.grid}>
      {DAYS.map((day) => (
        <Fragment key={day}>
          <span className={styles.rowLabel}>{day}</span>
          {Array.from({ length: 24 }, (_, hour) => {
            const key = `${day}_${hour < 10 ? `0${hour}` : hour}`;
            const count = grid[key] ?? 0;
            return (
              <div
                key={key}
                data-story-interactive
                className={`${styles.cell} ${selected === key ? styles.cellSelected : ''}`}
                style={{ backgroundColor: heatmapColorVar(count) }}
                title={`${key}: ${count} messages`}
                onClick={() => handleClick(key, count)}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

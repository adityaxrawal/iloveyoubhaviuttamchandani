import { useState } from 'react';
import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import HeatmapGrid from '../components/HeatmapGrid';
import styles from './04NinePmSpike.module.css';

export default function NinePmSpike({ data }: SlideProps) {
  const { heatmap } = data;
  const [selectedKey, setSelectedKey] = useState(heatmap.peakCell);
  const [selectedCount, setSelectedCount] = useState(heatmap.peakValue);

  const [day, hour] = selectedKey.split('_');
  const avg = heatmap.averages[selectedKey] ?? 0;

  return (
    <Card label="When we text" title="The 9pm spike" subtitle="Each square = one hour of one weekday, shaded by volume. Tap any square.">
      <HeatmapGrid
        grid={heatmap.grid}
        onCellSelect={(key, count) => {
          setSelectedKey(key);
          setSelectedCount(count);
        }}
      />
      <div className={styles.footerBoxes}>
        <div className={styles.footerBox}>
          <p className={styles.footerLabel}>{day} · {hour}:00</p>
          <p className={styles.footerValueSmall}>~{avg} texts, typical {day}</p>
        </div>
        <div className={styles.footerBox}>
          <p className={styles.footerLabel}>All time</p>
          <p className={styles.footerValue}>{selectedCount.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
}

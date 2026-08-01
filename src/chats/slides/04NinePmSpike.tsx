import { useState } from 'react';
import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import HeatmapGrid from '../components/HeatmapGrid';
import { heatmapColorVar } from '../lib/heatmapColor';
import styles from './04NinePmSpike.module.css';

const LEGEND_STOPS = [0, 1, 6, 16, 31, 61, 101];

const DAY_KEYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
const DAY_NAMES: Record<string, string> = {
  MO: 'Monday',
  TU: 'Tuesday',
  WE: 'Wednesday',
  TH: 'Thursday',
  FR: 'Friday',
  SA: 'Saturday',
  SU: 'Sunday',
};

function dayTotals(grid: Record<string, number>): { day: string; total: number }[] {
  const totals: Record<string, number> = {};
  for (const day of DAY_KEYS) totals[day] = 0;
  for (const [key, count] of Object.entries(grid)) {
    const day = key.split('_')[0];
    totals[day] = (totals[day] ?? 0) + count;
  }
  return DAY_KEYS.map((day) => ({ day, total: totals[day] }));
}

export default function NinePmSpike({ data }: SlideProps) {
  const { heatmap } = data;
  const [selectedKey, setSelectedKey] = useState(heatmap.peakCell);
  const [selectedCount, setSelectedCount] = useState(heatmap.peakValue);

  const [day, hour] = selectedKey ? selectedKey.split('_') : ['SA', '21'];
  const avg = heatmap.averages[selectedKey] ?? 0;

  const totals = dayTotals(heatmap.grid);
  const maxTotal = Math.max(1, ...totals.map((t) => t.total));
  const busiestDay = totals.reduce((a, b) => (b.total > a.total ? b : a), totals[0]);

  return (
    <Card
      label="WEEKLY & HOURLY RHYTHM"
      title="The 9pm spike"
      subtitle="Each cell represents 1 hour of a weekday. Tap any square to inspect."
    >
      <div className={styles.container}>
        <div className={styles.heatmapWrap} data-story-interactive>
          <HeatmapGrid
            grid={heatmap.grid}
            onCellSelect={(key, count) => {
              setSelectedKey(key);
              setSelectedCount(count);
            }}
          />
        </div>

        {/* Selected Hour Inspector Box */}
        <div className={styles.footerBoxes}>
          <div className={styles.footerBox}>
            <p className={styles.footerLabel}>{DAY_NAMES[day] ?? day} @ {hour}:00</p>
            <p className={styles.footerValueSmall}>~{avg} texts typical</p>
          </div>
          <div className={styles.footerBox}>
            <p className={styles.footerLabel}>Total Sent</p>
            <p className={styles.footerValue}>{selectedCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Shading Legend */}
        <div className={styles.legend}>
          <span className={styles.legendWord}>Quiet</span>
          {LEGEND_STOPS.map((stop) => (
            <span key={stop} className={styles.legendSwatch} style={{ backgroundColor: heatmapColorVar(stop) }} />
          ))}
          <span className={styles.legendWord}>Loud</span>
        </div>

        {/* Day Volume Breakdown */}
        <div className={styles.daysSection}>
          <p className={styles.daysLabel}>Busiest day: <strong>{DAY_NAMES[busiestDay.day]}</strong></p>
          <div className={styles.daysList}>
            {totals.map(({ day: d, total }) => (
              <div key={d} className={styles.dayRow}>
                <span className={styles.dayName}>{DAY_NAMES[d]}</span>
                <div className={styles.dayBarTrack}>
                  <div
                    className={`${styles.dayBarFill} ${d === busiestDay.day ? styles.dayBarPeak : ''}`}
                    style={{ width: `${(total / maxTotal) * 100}%` }}
                  />
                </div>
                <span className={styles.dayCount}>{total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

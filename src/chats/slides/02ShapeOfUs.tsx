import { useState } from 'react';
import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import StatBox from '../components/StatBox';
import styles from './02ShapeOfUs.module.css';

function formatMonthLabel(key: string): string {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  const monthAbbr = date.toLocaleDateString('en-US', { month: 'short' });
  return `${monthAbbr} '${year.slice(2)}`;
}

function formatYearLabel(year: string): string {
  return `'${year.slice(2)}`;
}

export default function ShapeOfUs({ data }: SlideProps) {
  const [view, setView] = useState<'month' | 'year'>('month');
  const source = view === 'month' ? data.shape.byMonth : data.shape.byYear;
  const entries = Object.entries(source);
  const formatLabel = view === 'month' ? formatMonthLabel : formatYearLabel;
  const unit = view === 'month' ? 'month' : 'year';

  let peakIndex = -1;
  let peakValue = -1;
  let peakRawLabel = '';
  let quietValue = Infinity;
  let quietRawLabel = '';
  let total = 0;

  entries.forEach(([label, value], i) => {
    total += value;
    if (value > peakValue) {
      peakValue = value;
      peakIndex = i;
      peakRawLabel = label;
    }
    if (value < quietValue) {
      quietValue = value;
      quietRawLabel = label;
    }
  });

  const average = entries.length > 0 ? Math.round(total / entries.length) : 0;
  const chartData = entries.map(([label, value]) => ({ label: formatLabel(label), value }));

  return (
    <Card
      label="MESSAGES OVER TIME"
      title="The shape of us"
      subtitle="Volume trends across the seasons"
    >
      <div className={styles.container}>
        {/* Toggle Pill Control */}
        <div className={styles.toggleBar} data-story-interactive>
          <button
            type="button"
            className={`${styles.toggleBtn} ${view === 'month' ? styles.toggleActive : ''}`}
            onClick={() => setView('month')}
          >
            By Month
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${view === 'year' ? styles.toggleActive : ''}`}
            onClick={() => setView('year')}
          >
            By Year
          </button>
        </div>

        {/* Peak Badge Ribbon */}
        {peakRawLabel && (
          <div className={styles.peakBanner}>
            🏆 Busiest {unit}: <strong>{formatLabel(peakRawLabel)}</strong> ({peakValue.toLocaleString()} msgs)
          </div>
        )}

        {/* Bar Chart Container */}
        <div className={styles.chartWrap}>
          <BarChart data={chartData} peakIndex={peakIndex} />
        </div>

        {/* Key Metrics Grid */}
        <div className={styles.statsGrid}>
          <StatBox number={entries.length} label={`${unit}s tracked`} />
          <StatBox number={average} label={`Avg per ${unit}`} />
          <StatBox number={peakValue < 0 ? 0 : peakValue} label={`Busiest ${unit}`} />
          <StatBox number={quietValue === Infinity ? 0 : quietValue} label={`Quietest ${unit}`} />
        </div>

        {quietRawLabel && (
          <p className={styles.quietCaption}>
            Quietest: {formatLabel(quietRawLabel)} ({quietValue.toLocaleString()} texts)
          </p>
        )}
      </div>
    </Card>
  );
}

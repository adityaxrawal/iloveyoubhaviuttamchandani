import { useState } from 'react';
import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import styles from './02ShapeOfUs.module.css';

export default function ShapeOfUs({ data }: SlideProps) {
  const [view, setView] = useState<'month' | 'year'>('month');
  const source = view === 'month' ? data.shape.byMonth : data.shape.byYear;
  const entries = Object.entries(source);

  let peakLabel = '';
  let peakValue = -1;
  for (const [label, value] of entries) {
    if (value > peakValue) {
      peakValue = value;
      peakLabel = label;
    }
  }

  const chartData = entries.map(([label, value]) => ({ label, value }));

  return (
    <Card
      label="Messages over time"
      title="The shape of us"
      footer={peakLabel ? `${peakLabel} · ${peakValue.toLocaleString()} messages` : undefined}
    >
      <div className={styles.toggle}>
        <button
          type="button"
          className={`${styles.toggleButton} ${view === 'month' ? styles.toggleActive : ''}`}
          onClick={() => setView('month')}
        >
          By month
        </button>
        <button
          type="button"
          className={`${styles.toggleButton} ${view === 'year' ? styles.toggleActive : ''}`}
          onClick={() => setView('year')}
        >
          By year
        </button>
      </div>
      <BarChart data={chartData} peakLabel={peakLabel} />
    </Card>
  );
}

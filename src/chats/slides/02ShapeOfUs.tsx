import { useState } from 'react';
import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
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

  let peakIndex = -1;
  let peakValue = -1;
  let peakRawLabel = '';
  entries.forEach(([label, value], i) => {
    if (value > peakValue) {
      peakValue = value;
      peakIndex = i;
      peakRawLabel = label;
    }
  });

  const chartData = entries.map(([label, value]) => ({ label: formatLabel(label), value }));

  return (
    <Card
      label="Messages over time"
      title="The shape of us"
      footer={peakRawLabel ? `${formatLabel(peakRawLabel)} · ${peakValue.toLocaleString()} messages` : undefined}
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
      <BarChart data={chartData} peakIndex={peakIndex} />
    </Card>
  );
}

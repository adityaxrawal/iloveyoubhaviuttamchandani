import styles from './BarChart.module.css';

export interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  peakLabel?: string;
}

export default function BarChart({ data, peakLabel }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className={styles.chart}>
      {data.map((d) => (
        <div key={d.label} className={styles.barCol}>
          <div
            className={`${styles.bar} ${d.label === peakLabel ? styles.barPeak : ''}`}
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`${d.label}: ${d.value.toLocaleString()}`}
          />
          <span className={styles.axisLabel}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

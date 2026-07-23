import styles from './BarChart.module.css';

export interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  peakIndex?: number;
}

export default function BarChart({ data, peakIndex }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  // Thin the axis labels once there are too many bars to caption every one
  // without them running into each other — the bars themselves still all
  // render, only some lose their text label underneath.
  const labelStep = data.length <= 8 ? 1 : Math.ceil(data.length / 6);

  return (
    <div className={styles.chart}>
      {data.map((d, i) => (
        <div key={`${d.label}-${i}`} className={styles.barCol}>
          <div
            className={`${styles.bar} ${i === peakIndex ? styles.barPeak : ''}`}
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`${d.label}: ${d.value.toLocaleString()}`}
          />
          <span className={styles.axisLabel}>{i % labelStep === 0 ? d.label : ''}</span>
        </div>
      ))}
    </div>
  );
}

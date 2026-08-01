import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import styles from './10NightOwl.module.css';

const BUCKET_LABELS: [string, string][] = [
  ['morning', 'Morning (5–12)'],
  ['afternoon', 'Afternoon (12–5)'],
  ['evening', 'Evening (5–9)'],
  ['night', 'Night (9–12)'],
  ['lateNight', 'Late night (12–5)'],
];

function formatHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12} ${period}`;
}

function formatHourShort(hour: number): string {
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

function hourlyChartData(hourCounts: Record<number, number> | undefined) {
  return Array.from({ length: 24 }, (_, hour) => ({
    label: formatHourShort(hour),
    value: hourCounts?.[hour] ?? 0,
  }));
}

export default function NightOwl({ data }: SlideProps) {
  const { timeOfDay, meta } = data;

  return (
    <Card
      label="24-HOUR RHYTHMS"
      title="The night owl"
      subtitle="When each partner is most active throughout the day"
    >
      <div className={styles.container}>
        {/* Peak Active Hours Banner */}
        <div className={styles.peakGrid}>
          <div className={styles.peakBox}>
            <span className={styles.peakIcon}>🌙</span>
            <div>
              <p className={styles.peakName}>{meta.senderA.split(' ')[0]}</p>
              <p className={styles.peakTime}>Peak at {formatHour(timeOfDay.peakHourBySender[meta.senderA] ?? 21)}</p>
            </div>
          </div>

          {!meta.isSolo && (
            <div className={styles.peakBox}>
              <span className={styles.peakIcon}>✨</span>
              <div>
                <p className={styles.peakName}>{meta.senderB.split(' ')[0]}</p>
                <p className={styles.peakTime}>Peak at {formatHour(timeOfDay.peakHourBySender[meta.senderB] ?? 22)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bucket Table */}
        <table className={styles.bucketTable}>
          <thead>
            <tr>
              <th>Window</th>
              <th>{meta.senderA.split(' ')[0]}</th>
              {!meta.isSolo && <th>{meta.senderB.split(' ')[0]}</th>}
            </tr>
          </thead>
          <tbody>
            {BUCKET_LABELS.map(([key, label]) => (
              <tr key={key}>
                <td>{label}</td>
                <td>{(timeOfDay.bucketsBySender[meta.senderA]?.[key] ?? 0).toLocaleString()}</td>
                {!meta.isSolo && <td>{(timeOfDay.bucketsBySender[meta.senderB]?.[key] ?? 0).toLocaleString()}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 24-Hour Charts */}
        <div className={styles.chartSection}>
          <p className={styles.sectionLabel}>{meta.senderA.split(' ')[0]}&rsquo;s 24-Hour Activity</p>
          <BarChart
            data={hourlyChartData(timeOfDay.hourCountsBySender[meta.senderA])}
            peakIndex={timeOfDay.peakHourBySender[meta.senderA] ?? 0}
          />
        </div>
      </div>
    </Card>
  );
}

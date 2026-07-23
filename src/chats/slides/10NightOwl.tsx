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
    <Card label="When you come alive" title="The night owl" subtitle="When each of you is most likely to text.">
      <p className={styles.peak}>
        {meta.senderA} · most active at {formatHour(timeOfDay.peakHourBySender[meta.senderA] ?? 0)}
      </p>
      {!meta.isSolo && (
        <p className={styles.peak}>
          {meta.senderB} · most active at {formatHour(timeOfDay.peakHourBySender[meta.senderB] ?? 0)}
        </p>
      )}
      <table className={styles.bucketTable}>
        <thead>
          <tr>
            <th></th>
            <th>{meta.senderA}</th>
            {!meta.isSolo && <th>{meta.senderB}</th>}
          </tr>
        </thead>
        <tbody>
          {BUCKET_LABELS.map(([key, label]) => (
            <tr key={key}>
              <td>{label}</td>
              <td>{timeOfDay.bucketsBySender[meta.senderA]?.[key] ?? 0}</td>
              {!meta.isSolo && <td>{timeOfDay.bucketsBySender[meta.senderB]?.[key] ?? 0}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      <p className={styles.sectionLabel}>{meta.senderA} · by hour</p>
      <BarChart
        data={hourlyChartData(timeOfDay.hourCountsBySender[meta.senderA])}
        peakIndex={timeOfDay.peakHourBySender[meta.senderA] ?? 0}
      />

      {!meta.isSolo && (
        <>
          <p className={styles.sectionLabel}>{meta.senderB} · by hour</p>
          <BarChart
            data={hourlyChartData(timeOfDay.hourCountsBySender[meta.senderB])}
            peakIndex={timeOfDay.peakHourBySender[meta.senderB] ?? 0}
          />
        </>
      )}
    </Card>
  );
}

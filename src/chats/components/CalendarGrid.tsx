import { heatmapColorVar } from '../lib/heatmapColor';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  days: Record<string, number>;
  startDate: string;
  endDate: string;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function buildDayKeys(startDate: string, endDate: string): string[] {
  const keys: string[] = [];
  const cur = new Date(startDate);
  const end = new Date(endDate);
  cur.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (cur.getTime() <= end.getTime()) {
    keys.push(`${cur.getFullYear()}-${pad2(cur.getMonth() + 1)}-${pad2(cur.getDate())}`);
    cur.setDate(cur.getDate() + 1);
  }
  return keys;
}

export default function CalendarGrid({ days, startDate, endDate }: CalendarGridProps) {
  if (!startDate || !endDate) return null;
  const keys = buildDayKeys(startDate, endDate);

  return (
    <div className={styles.grid}>
      {keys.map((key) => (
        <div
          key={key}
          className={styles.cell}
          style={{ backgroundColor: heatmapColorVar(days[key] ?? 0) }}
          title={`${key} · ${days[key] ?? 0} messages`}
        />
      ))}
    </div>
  );
}

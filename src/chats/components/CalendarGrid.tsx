import { heatmapColorVar } from '../lib/heatmapColor';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  days: Record<string, number>;
  startDate: string;
  endDate: string;
}

interface DayCell {
  key: string;
  date: Date;
}

const MONTH_LABELS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const LEGEND_STOPS = [0, 6, 16, 31, 61];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Builds 52 week columns x 7 day rows (GitHub style matrix)
function buildColumns(startDate: string, endDate: string): (DayCell | null)[][] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const firstMonday = new Date(start);
  firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));

  const lastSunday = new Date(end);
  lastSunday.setDate(lastSunday.getDate() + (6 - ((lastSunday.getDay() + 6) % 7)));

  const columns: (DayCell | null)[][] = [];
  const cur = new Date(firstMonday);
  let col: (DayCell | null)[] = [];

  while (cur.getTime() <= lastSunday.getTime()) {
    const inRange = cur.getTime() >= start.getTime() && cur.getTime() <= end.getTime();
    col.push(inRange ? { key: dayKey(cur), date: new Date(cur) } : null);
    if (col.length === 7) {
      columns.push(col);
      col = [];
    }
    cur.setDate(cur.getDate() + 1);
  }
  return columns;
}

export default function CalendarGrid({ days, startDate, endDate }: CalendarGridProps) {
  if (!startDate || !endDate) return null;
  const columns = buildColumns(startDate, endDate);

  return (
    <div className={styles.container}>
      <div className={styles.monthsHeader}>
        {MONTH_LABELS.map((m) => (
          <span key={m} className={styles.monthLabel}>{m}</span>
        ))}
      </div>

      <div className={styles.gridBody}>
        <div className={styles.dayLabelsCol}>
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div className={styles.columnsWrap}>
          {columns.map((col, colIdx) => (
            <div key={colIdx} className={styles.column}>
              {col.map((cell, dayIdx) =>
                cell ? (
                  <div
                    key={cell.key}
                    className={styles.cell}
                    style={{ backgroundColor: heatmapColorVar(days[cell.key] ?? 0) }}
                    title={`${cell.key}: ${(days[cell.key] ?? 0).toLocaleString()} msgs`}
                  />
                ) : (
                  <div key={`empty-${colIdx}-${dayIdx}`} className={styles.cellEmpty} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legendRow}>
        <span className={styles.legendLabel}>Quiet</span>
        <div className={styles.swatchesFlex}>
          {LEGEND_STOPS.map((s) => (
            <span key={s} className={styles.swatch} style={{ backgroundColor: heatmapColorVar(s) }} />
          ))}
        </div>
        <span className={styles.legendLabel}>Loud</span>
      </div>
    </div>
  );
}

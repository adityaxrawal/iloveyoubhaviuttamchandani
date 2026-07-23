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

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Weeks run Monday-Sunday, padded at both ends so every week has 7 cells —
// rows stack top to bottom (vertical scroll via the Card's own overflow)
// instead of the previous week-per-column horizontal layout.
function buildWeeks(startDate: string, endDate: string): (DayCell | null)[][] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const firstMonday = new Date(start);
  firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));

  const lastSunday = new Date(end);
  lastSunday.setDate(lastSunday.getDate() + (6 - ((lastSunday.getDay() + 6) % 7)));

  const weeks: (DayCell | null)[][] = [];
  const cur = new Date(firstMonday);
  let week: (DayCell | null)[] = [];

  while (cur.getTime() <= lastSunday.getTime()) {
    const inRange = cur.getTime() >= start.getTime() && cur.getTime() <= end.getTime();
    week.push(inRange ? { key: dayKey(cur), date: new Date(cur) } : null);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    cur.setDate(cur.getDate() + 1);
  }
  return weeks;
}

function isDayCell(cell: DayCell | null): cell is DayCell {
  return cell !== null;
}

export default function CalendarGrid({ days, startDate, endDate }: CalendarGridProps) {
  if (!startDate || !endDate) return null;
  const weeks = buildWeeks(startDate, endDate);
  let prevMonth = -1;

  return (
    <div className={styles.grid}>
      <div className={styles.headerRow}>
        <span className={styles.cornerLabel} />
        {DAY_LABELS.map((d) => (
          <span key={d} className={styles.dayLabel}>{d}</span>
        ))}
      </div>

      {weeks.map((week, i) => {
        const firstCell = week.find(isDayCell);
        const month = firstCell?.date.getMonth();
        const monthLabel = month !== undefined && month !== prevMonth ? MONTH_LABELS[month] : '';
        if (month !== undefined) prevMonth = month;

        return (
          <div key={i} className={styles.weekRow}>
            <span className={styles.monthLabel}>{monthLabel}</span>
            {week.map((cell, j) =>
              cell ? (
                <div
                  key={cell.key}
                  className={styles.cell}
                  style={{ backgroundColor: heatmapColorVar(days[cell.key] ?? 0) }}
                  title={`${cell.key} · ${days[cell.key] ?? 0} messages`}
                />
              ) : (
                <div key={`empty-${i}-${j}`} className={styles.cellEmpty} />
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}

import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import CalendarGrid from '../components/CalendarGrid';
import styles from './03Calendar.module.css';

export default function CalendarSlide({ data }: SlideProps) {
  const { calendar, streak, meta } = data;
  const avgPerDay = streak.totalChatDays > 0 ? Math.round(meta.totalMessages / streak.totalChatDays) : 0;

  return (
    <Card
      label="EVERY DAY WE TALKED"
      title="The calendar"
      subtitle={`${streak.totalChatDays} continuous days without missing a beat`}
    >
      <div className={styles.container}>
        <div className={styles.streakBanner}>
          <div className={styles.bannerItem}>
            <span className={styles.bannerVal}>🔥 {streak.maxStreak} Days</span>
            <span className={styles.bannerLabel}>Unbroken Streak</span>
          </div>
          <div className={styles.bannerItem}>
            <span className={styles.bannerVal}>💬 ~{avgPerDay}</span>
            <span className={styles.bannerLabel}>Avg Texts / Day</span>
          </div>
        </div>

        <div className={styles.calendarWrap}>
          <CalendarGrid days={calendar.days} startDate={calendar.startDate} endDate={calendar.endDate} />
        </div>
      </div>
    </Card>
  );
}

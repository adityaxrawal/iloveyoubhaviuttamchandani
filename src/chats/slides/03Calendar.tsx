import type { SlideProps } from '../lib/types';
import Card from '../components/Card';
import CalendarGrid from '../components/CalendarGrid';

export default function CalendarSlide({ data }: SlideProps) {
  const { calendar, streak } = data;

  return (
    <Card
      label="Every day we talked"
      title="The calendar"
      subtitle={`${streak.totalChatDays} days with at least one message.`}
    >
      <CalendarGrid days={calendar.days} startDate={calendar.startDate} endDate={calendar.endDate} />
    </Card>
  );
}

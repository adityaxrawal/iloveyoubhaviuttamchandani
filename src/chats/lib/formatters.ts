export function formatMonthLabel(key: string): string {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  const monthAbbr = date.toLocaleDateString('en-US', { month: 'short' });
  return `${monthAbbr} '${year.slice(2)}`;
}

export function formatYearLabel(year: string): string {
  return `'${year.slice(2)}`;
}

export function formatHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12} ${period}`;
}

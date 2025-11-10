export function formatDate(date: string | null, withTime: boolean = false) {
  if (!date) return null;

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  if (withTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = false;
  }

  const formatter = new Intl.DateTimeFormat('en-GB', options);
  return formatter.format(new Date(date)).replace(/\//g, '.').replace(',', '');
}

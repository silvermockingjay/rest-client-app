import { describe, it, expect } from 'vitest';
import { formatDate } from './datesUtils';

describe('formatDate', () => {
  it('returns null for null input', () => {
    expect(formatDate(null)).toBeNull();
  });

  it('formats date without time correctly', () => {
    const dateStr = '2025-09-20T05:07:00Z';
    const formatted = formatDate(dateStr);

    expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);

    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    expect(formatted).toBe(`${day}.${month}.${year}`);
  });

  it('formats date with time correctly', () => {
    const dateStr = '2025-09-20T05:07:00Z';
    const formatted = formatDate(dateStr, true);

    expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/);

    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');

    expect(formatted).toBe(`${day}.${month}.${year} ${hour}:${minute}`);
  });

  it('formats time with leading zeros', () => {
    const dateStr = '2025-09-20T03:04:00Z';
    const formatted = formatDate(dateStr, true);

    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');

    expect(formatted).toBe(`${day}.${month}.${year} ${hour}:${minute}`);
  });
});

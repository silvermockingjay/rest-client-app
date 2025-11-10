import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AnalyticsCard from './AnalyticsCard';
import type { HistoryRow } from '@/types/types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/utils/datesUtils', () => ({
  formatDate: vi.fn().mockImplementation((date: string) => date),
}));

describe('AnalyticsCard', () => {
  const closeModalMock = vi.fn();

  const row: HistoryRow = {
    id: 1,
    user_id: 'user1',
    request_method: 'GET',
    endpoint: '/api/test',
    request_timestamp: '2025-09-20T05:00:00Z',
    duration: '123',
    request_size: 456,
    response_size: 789,
    status_code: 200,
    error_details: 'Some error',
    payload: null,
    headers: null,
    created_at: '2025-09-20T05:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders request method and endpoint', () => {
    render(<AnalyticsCard closeModal={closeModalMock} row={row} />);
    expect(screen.getByText(row.request_method ?? '')).toBeInTheDocument();
    expect(screen.getByText(row.endpoint ?? '')).toBeInTheDocument();
  });

  it('renders request analytics with duration and request size', () => {
    render(<AnalyticsCard closeModal={closeModalMock} row={row} />);
    if (row.duration) {
      expect(screen.getByText(`duration ${row.duration} ms`)).toBeInTheDocument();
    }
    expect(screen.getByText(`payload ${row.request_size} bytes`)).toBeInTheDocument();
  });

  it('renders response analytics with status code and response size', () => {
    render(<AnalyticsCard closeModal={closeModalMock} row={row} />);
    expect(screen.getByText(`${row.status_code}`)).toBeInTheDocument();
    expect(screen.getByText(`payload ${row.response_size} bytes`)).toBeInTheDocument();
  });

  it('renders error details if present', () => {
    render(<AnalyticsCard closeModal={closeModalMock} row={row} />);
    if (row.error_details) {
      expect(screen.getByText(row.error_details)).toBeInTheDocument();
    }
  });

  it('calls closeModal when close button is clicked', () => {
    render(<AnalyticsCard closeModal={closeModalMock} row={row} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(closeModalMock).toHaveBeenCalled();
  });
});

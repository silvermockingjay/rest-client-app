import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HistoryDate from './HistoryDate';
import type { HistoryRow } from '@/types/types';

interface MockModalProps {
  children: React.ReactNode;
  closeModal: () => void;
}

interface MockAnalyticsCardProps {
  row: HistoryRow;
  closeModal: () => void;
}

vi.mock('@/components/Modal', () => ({
  Modal: ({ children, closeModal }: MockModalProps) => (
    <div data-testid="modal">
      <button onClick={closeModal}>Close</button>
      {children}
    </div>
  ),
  AnalyticsCard: ({ row, closeModal }: MockAnalyticsCardProps) => (
    <div data-testid="analytics-card">
      <span>{row.request_method}</span>
      <span>{row.endpoint}</span>
      <button onClick={closeModal}>Close Card</button>
    </div>
  ),
}));

describe('HistoryDate', () => {
  const rows: HistoryRow[] = [
    {
      id: 1,
      user_id: 'user1',
      request_method: 'GET',
      endpoint: '/api/test1',
      request_timestamp: '2025-09-20T05:00:00Z',
      duration: '100',
      request_size: 123,
      response_size: 456,
      status_code: 200,
      error_details: null,
      payload: null,
      headers: null,
      created_at: '2025-09-20T05:00:00Z',
    },
    {
      id: 2,
      user_id: 'user2',
      request_method: 'POST',
      endpoint: '/api/test2',
      request_timestamp: '2025-09-20T06:00:00Z',
      duration: '200',
      request_size: 789,
      response_size: 1011,
      status_code: 404,
      error_details: 'Error occurred',
      payload: null,
      headers: null,
      created_at: '2025-09-20T06:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the date', () => {
    render(
      <MemoryRouter>
        <HistoryDate date="2025-09-20" rows={rows} />
      </MemoryRouter>
    );
    expect(screen.getByText('2025-09-20')).toBeInTheDocument();
  });

  it('toggles row list when date is clicked', () => {
    render(
      <MemoryRouter>
        <HistoryDate date="2025-09-20" rows={rows} />
      </MemoryRouter>
    );
    const dateElement = screen.getByText('2025-09-20');
    fireEvent.click(dateElement);
    expect(screen.getByText('/api/test1')).toBeInTheDocument();
    expect(screen.getByText('/api/test2')).toBeInTheDocument();
    fireEvent.click(dateElement);
    expect(screen.queryByText('/api/test1')).not.toBeInTheDocument();
    expect(screen.queryByText('/api/test2')).not.toBeInTheDocument();
  });

  it('opens modal when analytics button is clicked', () => {
    render(
      <MemoryRouter>
        <HistoryDate date="2025-09-20" rows={rows} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('2025-09-20'));
    const analyticsButtons = screen.getAllByTestId('open request info')[0];
    fireEvent.click(analyticsButtons);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-card')).toBeInTheDocument();
  });

  it('closes modal when close button inside modal is clicked', () => {
    render(
      <MemoryRouter>
        <HistoryDate date="2025-09-20" rows={rows} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('2025-09-20'));
    const analyticsButtons = screen.getAllByTestId('open request info');
    fireEvent.click(analyticsButtons[0]);
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import HistoryPage, { loader } from './History';

const supabaseMock = {
  auth: { getUser: vi.fn() },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn(),
};

vi.mock('@/services/supabase/supabaseServer', () => ({
  createClient: () => ({ supabase: supabaseMock }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    redirect: vi.fn(),
    useLoaderData: vi.fn(),
  };
});

describe('HistoryPage loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const args: LoaderFunctionArgs = {
    request: new Request('http://localhost/'),
    params: {},
    context: {},
  };

  it('redirects if no user', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

    await loader(args);

    const { redirect } = await import('react-router-dom');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('redirects if userError exists', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null }, error: {} });

    await loader(args);

    const { redirect } = await import('react-router-dom');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('returns history data for valid user', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user1' } }, error: null });
    supabaseMock.order.mockResolvedValue({
      data: [
        {
          id: 1,
          user_id: 'user1',
          endpoint: '/api/test1',
          request_timestamp: '2025-09-20T12:00:00Z',
          request_method: 'GET',
        },
      ],
    });

    const result = await loader(args);

    expect(result).toEqual([
      {
        id: 1,
        user_id: 'user1',
        endpoint: '/api/test1',
        request_timestamp: '2025-09-20T12:00:00Z',
        request_method: 'GET',
      },
    ]);
  });
});

describe('HistoryPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders suggestion when data is empty', () => {
    (useLoaderData as unknown as Mock).mockReturnValue([]);

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    const suggestionParagraph = screen.getByText(/suggestion/i, { selector: 'p.rest-suggestion' });
    expect(suggestionParagraph).toBeInTheDocument();

    const suggestionLink = screen.getByText(/suggestionLink/i, { selector: 'a.suggestion-link' });
    expect(suggestionLink).toBeInTheDocument();
  });

  it('renders HistoryDate components for each date', () => {
    (useLoaderData as unknown as Mock).mockReturnValue([
      {
        id: 1,
        user_id: 'user1',
        endpoint: '/api/test1',
        request_timestamp: '2025-09-20T12:00:00Z',
        request_method: 'GET',
      },
      {
        id: 2,
        user_id: 'user1',
        endpoint: '/api/test2',
        request_timestamp: '2025-09-21T12:00:00Z',
        request_method: 'POST',
      },
    ]);

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    expect(screen.getByText('20.09.2025')).toBeInTheDocument();
    expect(screen.getByText('21.09.2025')).toBeInTheDocument();
  });
});

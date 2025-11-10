import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useRouteLoaderData } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import type { UserMetaData } from '@/services/supabase';

import Home from './Home';

vi.mock('react-router-dom', async () => {
  const actualModule = await vi.importActual('react-router-dom');
  return {
    ...actualModule,
    useRouteLoaderData: vi.fn(),
  };
});

const mockedUseRouteLoaderData = useRouteLoaderData as unknown as ReturnType<typeof vi.fn>;
const router = createMemoryRouter([{ path: '/', element: <Home /> }], { initialEntries: ['/'] });

const createTestSession = (name?: string): Session => ({
  access_token: 'token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'refresh',
  user: {
    id: '1',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: { name } as UserMetaData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
});

describe('Home component', () => {
  beforeEach(() => {
    mockedUseRouteLoaderData.mockReturnValue(null);
    vi.clearAllMocks();
  });

  it('renders guest welcome message when no session', () => {
    mockedUseRouteLoaderData.mockReturnValue(null);

    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  });

  it('renders user welcome message with name when session exists', () => {
    const session = createTestSession('John Doe');
    mockedUseRouteLoaderData.mockReturnValue(session.user);

    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Welcome back, John Doe!/i)).toBeInTheDocument();
  });

  it('falls back to "Dear User" if user name is missing', () => {
    const session = createTestSession(undefined);
    mockedUseRouteLoaderData.mockReturnValue(session.user);

    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Welcome back, Dear User!/i)).toBeInTheDocument();
  });

  it('renders app info', () => {
    render(<RouterProvider router={router} />);
    const info = screen.getByText(
      /Rest Client app is a modern API testing and collaboration tool/i
    );
    expect(info).toBeInTheDocument();
  });

  it('renders team members profile cards', () => {
    render(<RouterProvider router={router} />);
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(3);
  });
});

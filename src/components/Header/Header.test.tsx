import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import Header from './Header';

vi.mock('react-router-dom', () => {
  return {
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
    NavLink: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
    Form: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
    useRouteLoaderData: vi.fn<() => User | null>(),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/utils/navLinksConfig', () => ({
  guestLinks: [{ text: 'login', to: '/login' }],
  userLinks: [{ text: 'dashboard', to: '/dashboard' }],
}));

vi.mock('@/utils/languages', () => ({
  languages: [{ code: 'en' }, { code: 'ru' }],
}));

vi.mock('../LangToggler/LangToggler', () => ({
  default: ({ languages }: { languages: { code: string }[] }) => (
    <div data-testid="lang-toggler">{languages.map((l) => l.code).join(',')}</div>
  ),
}));

import { useRouteLoaderData } from 'react-router-dom';

describe('Header', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders guest links when no user', () => {
    (useRouteLoaderData as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<Header />);

    expect(screen.getByText('login')).toBeTruthy();
    expect(screen.getByTestId('lang-toggler')).toBeTruthy();
  });

  it('renders user links when user is present', () => {
    const user: User = { id: '123', email: 'test@test.com' } as User;

    (useRouteLoaderData as unknown as ReturnType<typeof vi.fn>).mockReturnValue(user);

    render(<Header />);

    expect(screen.getByText('dashboard')).toBeTruthy();
    expect(screen.getByText('signOut')).toBeTruthy();
    expect(screen.getByTestId('lang-toggler')).toBeTruthy();
  });

  it('adds scrolled class when window is scrolled', () => {
    (useRouteLoaderData as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header.className).toBe('header');

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    expect(header.className).toBe('header scrolled');
  });
});

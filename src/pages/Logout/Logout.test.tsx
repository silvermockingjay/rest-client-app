import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import LogoutPage from './Logout';
import { loader, action } from './Logout';
import { createClient } from '@/services/supabase/supabaseServer';
import { redirect } from 'react-router-dom';
import { render } from '@testing-library/react';

vi.mock('@/services/supabase/supabaseServer', () => ({
  createClient: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    redirect: vi.fn(),
  };
});

describe('LogoutPage loader and action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loader', () => {
    it('redirects to / if sb-access-token cookie is missing', async () => {
      const fakeRequest = new Request('https://example.com', {
        headers: { Cookie: 'foo=bar' },
      });

      (redirect as Mock).mockReturnValue('REDIRECTED');

      const result = await loader({ request: fakeRequest, params: {}, context: {} });

      expect(result).toBe('REDIRECTED');
      expect(redirect).toHaveBeenCalledWith('/');
    });

    it('returns null if sb-access-token cookie is present', async () => {
      const fakeRequest = new Request('https://example.com', {
        headers: { Cookie: 'sb-access-token=token123' },
      });

      const result = await loader({ request: fakeRequest, params: {}, context: {} });

      expect(result).toBeNull();
    });
  });

  describe('action', () => {
    it('signs out successfully and redirects with headers', async () => {
      const mockHeaders = new Headers();
      const mockSupabase = {
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: null }),
        },
      };

      (createClient as Mock).mockReturnValue({ supabase: mockSupabase, headers: mockHeaders });
      (redirect as Mock).mockReturnValue('REDIRECTED');

      const fakeRequest = new Request('https://example.com');

      const result = await action({ request: fakeRequest, params: {}, context: {} });

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result).toBe('REDIRECTED');
      expect(redirect).toHaveBeenCalledWith('/', { headers: mockHeaders });
    });

    it('returns error object if signOut fails', async () => {
      const mockError = { message: 'Sign out failed' };
      const mockSupabase = {
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: mockError }),
        },
      };

      (createClient as Mock).mockReturnValue({ supabase: mockSupabase, headers: new Headers() });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const fakeRequest = new Request('https://example.com');

      const result = await action({ request: fakeRequest, params: {}, context: {} });

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
      expect(result).toEqual({ success: false, error: 'Sign out failed' });

      consoleErrorSpy.mockRestore();
    });
  });
});

describe('LogoutPage component', () => {
  it('renders LogoutPage', () => {
    render(<LogoutPage />);
  });
});

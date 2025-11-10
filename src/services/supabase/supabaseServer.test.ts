import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { createClient } from './supabaseServer';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
  parseCookieHeader: vi.fn(),
  serializeCookieHeader: vi.fn(),
}));

describe('createClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads cookies from request headers using parseCookieHeader', () => {
    const fakeRequest = new Request('https://example.com', {
      headers: { Cookie: 'foo=bar; test=123' },
    });

    const mockSupabase = {};
    (createServerClient as Mock).mockImplementation((_url, _key, options) => {
      const cookies = options.cookies;
      cookies.getAll();
      return mockSupabase;
    });

    (parseCookieHeader as Mock).mockReturnValue([
      { name: 'foo', value: 'bar' },
      { name: 'test', value: '123' },
    ]);

    createClient(fakeRequest);

    expect(parseCookieHeader).toHaveBeenCalledWith('foo=bar; test=123');
  });

  it('sets cookies using serializeCookieHeader', () => {
    const fakeRequest = new Request('https://example.com');

    const mockSupabase = {};
    (createServerClient as Mock).mockImplementation((_url, _key, options) => {
      options.cookies.setAll([{ name: 'foo', value: 'bar', options: { path: '/' } }]);
      return mockSupabase;
    });

    (serializeCookieHeader as Mock).mockReturnValue('foo=bar; Path=/');

    const result = createClient(fakeRequest);

    expect(serializeCookieHeader).toHaveBeenCalledWith('foo', 'bar', { path: '/' });
    expect(result.headers.get('Set-Cookie')).toBe('foo=bar; Path=/');
  });
});

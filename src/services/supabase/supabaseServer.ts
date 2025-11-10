import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { type Database } from '@/types/database.types';

export function createClient(request: Request) {
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const raw = request.headers.get('Cookie') ?? '';
          return parseCookieHeader(raw).map((c) => ({ name: c.name, value: c.value || '' }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
          );
        },
      },
    }
  );

  return { supabase, headers };
}

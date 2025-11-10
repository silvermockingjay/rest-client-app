import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from 'react-router-dom';
import { createClient } from '@/services/supabase/supabaseServer';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionCookie = request.headers.get('Cookie')?.includes('sb-access-token');
  if (!sessionCookie) {
    return redirect('/');
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createClient(request);

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return redirect('/', { headers });
}

export default function LogoutPage() {
  return null;
}

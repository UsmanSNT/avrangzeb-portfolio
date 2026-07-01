import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

function createAnonClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

function extractAccessToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const cookieHeader = request.headers.get('cookie') || '';
  if (!cookieHeader) return null;

  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
  const possibleTokenKeys = [`sb-${projectRef}-auth-token`, 'sb-access-token'];

  for (const key of possibleTokenKeys) {
    if (cookies[key]) {
      try {
        const cookieValue = cookies[key];
        if (cookieValue.startsWith('{')) {
          const parsed = JSON.parse(cookieValue);
          return parsed.access_token || parsed;
        }
        return cookieValue;
      } catch {
        return cookies[key];
      }
    }
  }

  return null;
}

/**
 * Resolves the caller's Supabase user from the request's Authorization
 * header (or Supabase auth cookie as a fallback). Returns an anon client
 * and a null user when no valid session is present.
 */
export async function getAuthenticatedUser(
  request: Request
): Promise<{ supabase: SupabaseClient; user: User | null }> {
  const accessToken = extractAccessToken(request);

  if (!accessToken) {
    return { supabase: createAnonClient(), user: null };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase: createAnonClient(), user: null };
  }

  return { supabase, user };
}

export async function isUserAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return data?.role === 'admin' || data?.role === 'super_admin';
}

type AuthSuccess = { supabase: SupabaseClient; user: User };
type AuthFailure = { error: NextResponse };

/** Requires a valid logged-in Supabase session (any role). */
export async function requireUser(request: Request): Promise<AuthSuccess | AuthFailure> {
  const { supabase, user } = await getAuthenticatedUser(request);

  if (!user) {
    return {
      error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { supabase, user };
}

/** Requires a valid logged-in session with an admin or super_admin role. */
export async function requireAdmin(request: Request): Promise<AuthSuccess | AuthFailure> {
  const auth = await requireUser(request);
  if ('error' in auth) return auth;

  const isAdmin = await isUserAdmin(auth.supabase, auth.user.id);
  if (!isAdmin) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      ),
    };
  }

  return auth;
}

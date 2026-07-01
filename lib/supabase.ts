import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const missingSupabaseError = new Error('Supabase is not configured');

let browserSupabase: SupabaseClient | null = null;

function createNoopQuery() {
  const response = Promise.resolve({ data: null, error: missingSupabaseError });
  const query = {
    select: () => query,
    insert: () => query,
    update: () => query,
    delete: () => query,
    upsert: () => query,
    eq: () => query,
    neq: () => query,
    gt: () => query,
    gte: () => query,
    lt: () => query,
    lte: () => query,
    order: () => query,
    limit: () => query,
    single: () => response,
    maybeSingle: () => response,
    then: response.then.bind(response),
    catch: response.catch.bind(response),
    finally: response.finally.bind(response),
  };

  return query;
}

function createMissingSupabaseClient() {
  const missingMutation = async () => ({ data: null, error: missingSupabaseError });

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: missingSupabaseError }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
      signInWithPassword: missingMutation,
      signUp: missingMutation,
      signOut: async () => ({ error: missingSupabaseError }),
      resetPasswordForEmail: async () => ({ data: null, error: missingSupabaseError }),
      updateUser: async () => ({ data: { user: null }, error: missingSupabaseError }),
    },
    from: () => createNoopQuery(),
    rpc: async () => ({ data: null, error: missingSupabaseError }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: missingSupabaseError }),
        remove: async () => ({ data: null, error: missingSupabaseError }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as unknown as SupabaseClient;
}

function getBrowserSupabaseClient(): SupabaseClient {
  if (browserSupabase) {
    return browserSupabase;
  }

  if (!isSupabaseConfigured) {
    return createMissingSupabaseClient();
  }

  try {
    browserSupabase = createClient(supabaseUrl, supabaseAnonKey);
    return browserSupabase;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to create Supabase client', err);
    return createMissingSupabaseClient();
  }
}

// Shared browser/client Supabase instance. Returns the real client when env vars exist.
export const supabase = getBrowserSupabaseClient();

export function getSupabaseClient() {
  return isSupabaseConfigured ? supabase : null;
}

// Types
export interface BookQuote {
  id: number;
  book_title: string;
  author: string;
  quote: string;
  image_url: string | null;
  likes: number;
  dislikes: number;
  created_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: 'certificate' | 'event' | 'memory' | 'achievement' | 'other';
  images: string[];
  created_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  important: boolean;
  created_at: string;
}

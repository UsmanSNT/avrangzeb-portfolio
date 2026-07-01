import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    // fall through to null client
    // eslint-disable-next-line no-console
    console.warn('Failed to create Supabase client', err);
    _supabase = null;
  }
} else {
  // Avoid throwing during import when build or preview env vars are not configured.
}

const missingSupabaseError = new Error('Supabase is not configured');

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

const noopSupabase = {
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
    signOut: async () => ({ error: missingSupabaseError }),
  },
  from: () => createNoopQuery(),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: missingSupabaseError }),
      remove: async () => ({ data: null, error: missingSupabaseError }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

// Export a lightweight wrapper that mirrors the minimal supabase interface used in this app.
export const supabase: any = _supabase || noopSupabase;

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


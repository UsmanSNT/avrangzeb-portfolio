import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

declare global {
  interface Window {
    __SUPABASE_PUBLIC_CONFIG__?: Partial<SupabasePublicConfig>;
  }
}

function readSupabasePublicConfig(): SupabasePublicConfig | null {
  const injectedConfig = typeof window !== 'undefined' ? window.__SUPABASE_PUBLIC_CONFIG__ : undefined;

  const supabaseUrl = (injectedConfig?.url || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const supabaseAnonKey = (injectedConfig?.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return { url: supabaseUrl, anonKey: supabaseAnonKey };
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

let browserSupabase: SupabaseClient | null = null;

function getResolvedSupabaseClient() {
  const config = readSupabasePublicConfig();
  if (!config) {
    return createMissingSupabaseClient();
  }

  if (!browserSupabase) {
    browserSupabase = createClient(config.url, config.anonKey);
  }

  return browserSupabase;
}

function createSupabaseFacade(): SupabaseClient {
  const fallback = createMissingSupabaseClient();

  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      const client = getResolvedSupabaseClient() || fallback;
      const value = (client as unknown as Record<PropertyKey, unknown>)[prop];

      if (typeof value === 'function') {
        return value.bind(client);
      }

      return value;
    },
  });
}

// Shared browser/client Supabase instance. It resolves the public env config at runtime.
export const supabase: SupabaseClient = createSupabaseFacade();

export function getSupabaseClient() {
  const config = readSupabasePublicConfig();
  if (!config) {
    return null;
  }

  if (!browserSupabase) {
    browserSupabase = createClient(config.url, config.anonKey);
  }

  return browserSupabase;
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

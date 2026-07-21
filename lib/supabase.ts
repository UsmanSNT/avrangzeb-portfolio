import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const missingSupabaseConfigError = new Error(
  'Supabase browser client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
);

type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

let browserSupabase: SupabaseClient | null = null;

function getSupabasePublicConfig(): SupabaseConfig {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '',
  };
}

function hasSupabasePublicConfig(config: SupabaseConfig) {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

function createMissingConfigPromise<T>(data: T) {
  return Promise.resolve({ data, error: missingSupabaseConfigError });
}

function createMissingConfigQueryBuilder() {
  const builder = new Proxy({} as Record<PropertyKey, unknown>, {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
          createMissingConfigPromise({ data: null, error: missingSupabaseConfigError }).then(resolve, reject);
      }

      if (prop === 'catch') {
        return (reject: (reason: unknown) => unknown) =>
          createMissingConfigPromise({ data: null, error: missingSupabaseConfigError }).catch(reject);
      }

      if (prop === 'finally') {
        return (handler: () => void) =>
          createMissingConfigPromise({ data: null, error: missingSupabaseConfigError }).finally(handler);
      }

      return () => builder;
    },
  });

  return builder;
}

function createMissingConfigStorageBucket() {
  const bucket = new Proxy({} as Record<PropertyKey, unknown>, {
    get(_target, prop) {
      if (prop === 'getPublicUrl') {
        return () => ({ data: { publicUrl: '' }, error: missingSupabaseConfigError });
      }

      if (prop === 'download') {
        return () => createMissingConfigPromise({ data: null, error: missingSupabaseConfigError });
      }

      return () => createMissingConfigPromise({ data: null, error: missingSupabaseConfigError });
    },
  });

  return bucket;
}

function createMissingConfigAuth() {
  const auth = {
    signInWithPassword: () =>
      createMissingConfigPromise({ data: { user: null, session: null }, error: missingSupabaseConfigError }),
    signUp: () =>
      createMissingConfigPromise({ data: { user: null, session: null }, error: missingSupabaseConfigError }),
    signOut: () => createMissingConfigPromise({ data: null, error: missingSupabaseConfigError }),
    getUser: () =>
      createMissingConfigPromise({ data: { user: null }, error: missingSupabaseConfigError }),
    getSession: () =>
      createMissingConfigPromise({ data: { session: null }, error: missingSupabaseConfigError }),
    updateUser: () =>
      createMissingConfigPromise({ data: { user: null }, error: missingSupabaseConfigError }),
    resetPasswordForEmail: () => createMissingConfigPromise({ data: null, error: missingSupabaseConfigError }),
    signInWithOAuth: () =>
      createMissingConfigPromise({ data: { provider: null, url: null }, error: missingSupabaseConfigError }),
    verifyOtp: () =>
      createMissingConfigPromise({ data: { user: null, session: null }, error: missingSupabaseConfigError }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe() {
            return undefined;
          },
        },
      },
      error: missingSupabaseConfigError,
    }),
  };

  return auth;
}

function createMissingConfigClient(): SupabaseClient {
  const queryBuilder = createMissingConfigQueryBuilder();
  const storageBucket = createMissingConfigStorageBucket();

  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (prop === 'auth') {
        return createMissingConfigAuth();
      }

      if (prop === 'storage') {
        return {
          from() {
            return storageBucket;
          },
        };
      }

      if (prop === 'from' || prop === 'rpc' || prop === 'schema' || prop === 'channel') {
        return () => queryBuilder;
      }

      if (prop === 'removeChannel' || prop === 'getChannels') {
        return () => (prop === 'getChannels' ? [] : undefined);
      }

      return queryBuilder;
    },
  });
}

function getBrowserSupabaseClient() {
  if (browserSupabase) {
    return browserSupabase;
  }

  const config = getSupabasePublicConfig();

  if (!hasSupabasePublicConfig(config)) {
    browserSupabase = createMissingConfigClient();
    return browserSupabase;
  }

  browserSupabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  return browserSupabase;
}

function createSupabaseFacade(): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      const client = getBrowserSupabaseClient();
      const value = (client as unknown as Record<PropertyKey, unknown>)[prop];

      if (typeof value === 'function') {
        return value.bind(client);
      }

      return value;
    },
  });
}

// Shared browser/client Supabase instance. It is created directly from public env vars.
export const supabase: SupabaseClient = createSupabaseFacade();

export function getSupabaseClient() {
  return getBrowserSupabaseClient();
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

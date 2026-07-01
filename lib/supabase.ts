import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

const missingSupabaseConfigError = new Error(
  'Supabase browser client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
);

let browserSupabase: SupabaseClient | null = null;

function getBrowserSupabaseClient() {
  if (browserSupabase) {
    return browserSupabase;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw missingSupabaseConfigError;
  }

  browserSupabase = createClient(supabaseUrl, supabaseAnonKey);
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
  if (!supabaseUrl || !supabaseAnonKey) {
    throw missingSupabaseConfigError;
  }

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

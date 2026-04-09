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
  // env not set — avoid throwing during import to prevent client-side crash
  // eslint-disable-next-line no-console
  console.warn('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set');
}

// Export a lightweight wrapper that mirrors the minimal supabase interface used in this app.
export const supabase: any = _supabase || {
  from: () => ({ select: async () => ({ data: null, error: new Error('Supabase not configured') }) }),
};

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


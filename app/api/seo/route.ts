import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Ommaviy SEO ma'lumotlari - sahifalar meta teglarini yaratish uchun
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageKey = searchParams.get('page');

  let query = supabase.from('portfolio_seo_settings').select('*');
  if (pageKey) {
    query = query.eq('page_key', pageKey);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(pageKey ? data?.[0] ?? null : data);
}

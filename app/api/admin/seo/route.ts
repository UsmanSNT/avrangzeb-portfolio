import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

// Barcha SEO sozlamalarini olish (admin/super_admin only)
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;
  const { supabase } = auth;

  const { data, error } = await supabase
    .from('portfolio_seo_settings')
    .select('*')
    .order('page_key', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// SEO sozlamasini yangilash yoki yaratish (admin/super_admin only)
export async function PUT(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;
    const { supabase, user } = auth;

    const body = await request.json();
    const { page_key, title, description, keywords, og_image } = body;

    if (!page_key || typeof page_key !== 'string') {
      return NextResponse.json({ error: 'page_key required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('portfolio_seo_settings')
      .upsert(
        {
          page_key,
          title: title ?? null,
          description: description ?? null,
          keywords: keywords ?? null,
          og_image: og_image ?? null,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        },
        { onConflict: 'page_key' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

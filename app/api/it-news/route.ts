import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Helper function to create authenticated Supabase client from request
async function createAuthenticatedClient(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Request header'dan Authorization token olish
  const authHeader = request.headers.get('authorization');
  let accessToken: string | null = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7);
  }
  
  // Cookie'lardan token olish
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies: Record<string, string> = {};
  
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        cookies[key] = decodeURIComponent(value);
      }
    });
  }
  
  // Supabase cookie nomlarini topish
  const projectRef = supabaseUrl.split('//')[1].split('.')[0];
  const possibleTokenKeys = [
    `sb-${projectRef}-auth-token`,
    `sb-access-token`,
  ];
  
  if (!accessToken) {
    for (const key of possibleTokenKeys) {
      if (cookies[key]) {
        try {
          const cookieValue = cookies[key];
          if (cookieValue.startsWith('{')) {
            const parsed = JSON.parse(cookieValue);
            accessToken = parsed.access_token || parsed;
          } else {
            accessToken = cookieValue;
          }
          break;
        } catch {
          accessToken = cookies[key];
          break;
        }
      }
    }
  }
  
  // Agar access token bo'lmasa, null qaytaramiz
  if (!accessToken) {
    return { supabase: createSupabaseClient(), user: null };
  }
  
  // Token bilan authenticated client yaratish
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  
  // User'ni tekshirish
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error('Auth error:', error);
    return { supabase: createSupabaseClient(), user: null };
  }
  
  return { supabase, user };
}

// GET - Barcha IT news'larni olish
export async function GET(request: Request) {
  try {
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const incrementViews = searchParams.get('incrementViews') === 'true';

    if (id) {
      // Bitta news olish
      const { data, error } = await supabase
        .from('portfolio_it_news')
        .select('*, user_profiles(full_name, avatar_url)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({ error: 'News topilmadi' }, { status: 404 });
      }

      // Ko'rishlar sonini oshirish
      if (incrementViews && data) {
        const newViews = (data.views || 0) + 1;
        const { data: updatedData, error: updateError } = await supabase
          .from('portfolio_it_news')
          .update({ views: newViews })
          .eq('id', id)
          .select('views')
          .single();
        
        if (!updateError && updatedData) {
          data.views = updatedData.views;
        } else {
          data.views = newViews;
        }
      }

      return NextResponse.json(data);
    }

    // Barcha news'larni olish
    // Avval oddiy select qilamiz (user_profiles join RLS muammosi bo'lishi mumkin)
    const { data, error } = await supabase
      .from('portfolio_it_news')
      .select('id, title, content, image_url, views, created_at, updated_at, user_id')
      .order('created_at', { ascending: false });

    console.log('IT News GET - Raw data:', JSON.stringify(data, null, 2));
    console.log('IT News GET - Error:', error);
    console.log('IT News GET - Data type:', typeof data);
    console.log('IT News GET - Is array:', Array.isArray(data));
    console.log('IT News GET - Data length:', Array.isArray(data) ? data.length : 'N/A');

    if (error) {
      console.error('Error fetching news:', error);
      return NextResponse.json({ error: 'News yuklanmadi', details: error.message }, { status: 500 });
    }

    // NULL ID'larni filtrlash
    const filteredData = (data || []).filter(item => {
      const isValid = item && item.id != null;
      if (!isValid) {
        console.warn('Filtered out invalid item:', item);
      }
      return isValid;
    });
    
    console.log('IT News GET - Filtered data:', JSON.stringify(filteredData, null, 2));
    console.log('IT News GET - Filtered count:', filteredData.length);

    // Agar ma'lumotlar bo'sh bo'lsa, bo'sh array qaytaramiz
    if (!filteredData || filteredData.length === 0) {
      console.warn('No IT News data found');
      return NextResponse.json([]);
    }

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// POST - Yangi IT news qo'shish
export async function POST(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, image_url } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title va content majburiy' },
        { status: 400 }
      );
    }

    // Yangi news qo'shish
    const { data, error } = await supabase
      .from('portfolio_it_news')
      .insert({
        title: title.trim(),
        content: content.trim(),
        image_url: image_url?.trim() || null,
        user_id: user.id,
        views: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating news:', error);
      return NextResponse.json(
        { error: 'News qo\'shilmadi' },
        { status: 500 }
      );
    }

    // User profilini olish
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      ...data,
      user_profiles: profile,
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// PUT - IT news'ni yangilash yoki ko'rishlar sonini oshirish
export async function PUT(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, content, image_url, incrementViews } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID majburiy' }, { status: 400 });
    }

    // Ko'rishlar sonini oshirish
    if (incrementViews) {
      const { data: currentNews } = await supabase
        .from('portfolio_it_news')
        .select('views')
        .eq('id', id)
        .single();

      if (currentNews) {
        const { error } = await supabase
          .from('portfolio_it_news')
          .update({ views: (currentNews.views || 0) + 1 })
          .eq('id', id);

        if (error) {
          console.error('Error incrementing views:', error);
          return NextResponse.json(
            { error: 'Ko\'rishlar soni yangilanmadi' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true });
      }
    }

    // News'ni yangilash
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (image_url !== undefined) updateData.image_url = image_url?.trim() || null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Yangilanish uchun ma\'lumot kiritilmagan' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('portfolio_it_news')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating news:', error);
      return NextResponse.json(
        { error: 'News yangilanmadi' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// DELETE - IT news'ni o'chirish
export async function DELETE(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID majburiy' }, { status: 400 });
    }

    const { error } = await supabase
      .from('portfolio_it_news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting news:', error);
      return NextResponse.json(
        { error: 'News o\'chirilmadi' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}


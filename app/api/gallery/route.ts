import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to create unauthenticated Supabase client
function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Helper function to create authenticated Supabase client from request
async function createAuthenticatedClient(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', options);
        },
      },
    }
  );

  // Authorization header'dan token olish
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Auth error in createAuthenticatedClient:', error);
    return { supabase, user: null };
  }
  return { supabase, user };
}

// GET - Barcha galereya elementlarini olish
export async function GET(request: Request) {
  try {
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query = supabase
      .from('portfolio_gallery_rows')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Agar userId berilgan bo'lsa, faqat o'sha foydalanuvchining ma'lumotlarini olish
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('GET error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to fetch gallery items' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST - Yangi galereya elementi qo'shish
export async function POST(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, images } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Sarlavha majburiy maydon' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('portfolio_gallery_rows')
      .insert([{ 
        title, 
        description: description || null, 
        category: category || 'other', 
        images: images || [], 
        user_id: user.id 
      }])
      .select();

    if (error) {
      console.error('Database error:', error);
      if (error.message?.includes('row-level security')) {
        return NextResponse.json(
          { success: false, error: 'Xavfsizlik siyosati: Ma\'lumot qo\'shish huquqi yo\'q. Iltimos, tizimga kirib qaytib keling.' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create gallery item' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to create gallery item - no data returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

// PUT - Galereya elementini yangilash
export async function PUT(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, description, category, images } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    // Avval qator mavjudligini va foydalanuvchi huquqini tekshirish
    const { data: existingItems, error: fetchError } = await supabase
      .from('portfolio_gallery_rows')
      .select('id, user_id')
      .eq('id', id);

    if (fetchError || !existingItems || existingItems.length === 0) {
      console.error('Gallery item not found:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Galereya elementi topilmadi' },
        { status: 404 }
      );
    }
    const existingItem = existingItems[0];

    // Foydalanuvchi huquqini tekshirish
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id);

    const profile = profileData && profileData.length > 0 ? profileData[0] : null;

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
    const isOwner = existingItem.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Sizda bu elementni yangilash huquqi yo\'q' },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (images !== undefined) updateData.images = images;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Yangilanish uchun ma\'lumot kiritilmagan' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('portfolio_gallery_rows')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update error:', error);
      if (error.message?.includes('row-level security')) {
        return NextResponse.json(
          { success: false, error: 'Xavfsizlik siyosati: Ma\'lumot yangilash huquqi yo\'q' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message || 'Ma\'lumot yangilashda xatolik yuz berdi' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Galereya elementi topilmadi yoki yangilash amalga oshmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Ma\'lumot yangilashda kutilmagan xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

// DELETE - Galereya elementini o'chirish
export async function DELETE(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    // Avval qator mavjudligini va foydalanuvchi huquqini tekshirish
    const { data: existingItems, error: fetchError } = await supabase
      .from('portfolio_gallery_rows')
      .select('id, user_id')
      .eq('id', id);

    if (fetchError || !existingItems || existingItems.length === 0) {
      console.error('Gallery item not found for deletion:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Galereya elementi topilmadi' },
        { status: 404 }
      );
    }
    const existingItem = existingItems[0];

    // Foydalanuvchi huquqini tekshirish
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id);

    const profile = profileData && profileData.length > 0 ? profileData[0] : null;

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
    const isOwner = existingItem.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Sizda bu elementni o\'chirish huquqi yo\'q' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('portfolio_gallery_rows')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      if (error.message?.includes('row-level security')) {
        return NextResponse.json(
          { success: false, error: 'Xavfsizlik siyosati: Ma\'lumot o\'chirish huquqi yo\'q' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message || 'Ma\'lumot o\'chirilmadi' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}


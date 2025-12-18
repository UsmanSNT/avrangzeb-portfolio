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

// GET - Barcha qaydlarni olish (public - hamma ko'ra oladi)
export async function GET(request: Request) {
  try {
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('GET /api/notes - userId:', userId);
    
    let query = supabase
      .from('portfolio_notes_rows')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Agar userId berilgan bo'lsa, faqat o'sha foydalanuvchining ma'lumotlarini olish
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    console.log('GET /api/notes - Data:', data);
    console.log('GET /api/notes - Error:', error);
    console.log('GET /api/notes - Data length:', data?.length);
    console.log('GET /api/notes - Data type:', typeof data);
    console.log('GET /api/notes - Is array:', Array.isArray(data));

    if (error) {
      console.error('Error fetching notes:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // RLS policy muammosi bo'lsa ham, bo'sh array qaytaramiz
      // Frontend'da xato ko'rsatilmaydi, faqat bo'sh array
      // Bu public read uchun kerak
      return NextResponse.json({ 
        success: true, 
        data: [],
        warning: error.message || 'Failed to fetch notes'
      });
    }

    // NULL ID'larni filtrlash
    const filteredData = (data || []).filter((item: any) => {
      const isValid = item && item.id != null;
      if (!isValid) {
        console.warn('Filtered out invalid item:', item);
      }
      return isValid;
    });

    console.log('GET /api/notes - Filtered data length:', filteredData.length);

    return NextResponse.json({ success: true, data: filteredData });
  } catch (error: any) {
    console.error('GET notes error:', error);
    console.error('GET notes error details:', JSON.stringify(error, null, 2));
    // Xato bo'lsa ham, bo'sh array qaytaramiz
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST - Yangi qayd qo'shish
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
    const { title, content, category, tags, important } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title va content majburiy' },
        { status: 400 }
      );
    }

    console.log('POST /api/notes - Creating note with data:', {
      title: title.trim(),
      content: content.trim(),
      category: category || 'other',
      tags: tags || [],
      important: important || false,
      user_id: user.id
    });

    const { data, error } = await supabase
      .from('portfolio_notes_rows')
      .insert([{ 
        title: title.trim(), 
        content: content.trim(), 
        category: category || 'other', 
        tags: tags || [], 
        important: important || false, 
        user_id: user.id 
      }])
      .select('id, title, content, category, tags, important, created_at, updated_at, user_id')
      .single();

    console.log('POST /api/notes - Insert result:', { data, error });

    if (error) {
      console.error('Error creating note:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      throw error;
    }

    if (!data) {
      console.error('POST /api/notes - No data returned from insert');
      return NextResponse.json(
        { success: false, error: 'Note created but no data returned' },
        { status: 500 }
      );
    }

    console.log('POST /api/notes - Successfully created note:', data);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('POST notes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create note' },
      { status: 500 }
    );
  }
}

// PUT - Qaydni yangilash
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
    const { id, title, content, category, tags, important } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID majburiy' },
        { status: 400 }
      );
    }

    // Foydalanuvchi o'z qaydini yangilay oladi yoki admin barcha qaydlarni yangilay oladi
    const { data: noteData } = await supabase
      .from('portfolio_notes_rows')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!noteData) {
      return NextResponse.json(
        { success: false, error: 'Qayd topilmadi' },
        { status: 404 }
      );
    }

    // Admin tekshirish
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';
    const isOwner = noteData.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Sizda bu qaydni yangilash huquqi yo\'q' },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (important !== undefined) updateData.important = important;

    const { data, error } = await supabase
      .from('portfolio_notes_rows')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('PUT notes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE - Qaydni o'chirish
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
        { success: false, error: 'ID majburiy' },
        { status: 400 }
      );
    }

    // Foydalanuvchi o'z qaydini o'chira oladi yoki admin barcha qaydlarni o'chira oladi
    const { data: noteData } = await supabase
      .from('portfolio_notes_rows')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!noteData) {
      return NextResponse.json(
        { success: false, error: 'Qayd topilmadi' },
        { status: 404 }
      );
    }

    // Admin tekshirish
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';
    const isOwner = noteData.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Sizda bu qaydni o\'chirish huquqi yo\'q' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('portfolio_notes_rows')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE notes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete note' },
      { status: 500 }
    );
  }
}


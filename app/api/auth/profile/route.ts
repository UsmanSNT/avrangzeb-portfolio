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
  
  // User'ni tekshirish (token headerda bo'lgani uchun parametr kerak emas)
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error('Auth error:', error);
    return { supabase: createSupabaseClient(), user: null };
  }
  
  return { supabase, user };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('GET profile error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('GET profile error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, full_name, avatar_url } = body;

    console.log('PUT profile - userId:', userId);
    console.log('PUT profile - full_name:', full_name);
    console.log('PUT profile - avatar_url:', avatar_url);

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Authenticated client yaratish
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    // Foydalanuvchi o'z profilini yangilay oladi yoki super_admin boshqalarni yangilay oladi
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isSuperAdmin = profileData?.role === 'super_admin';
    const isOwner = user.id === userId;

    if (!isSuperAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Sizda bu profilni yangilash huquqi yo\'q' },
        { status: 403 }
      );
    }

    // Update data
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (full_name !== undefined) {
      updateData.full_name = full_name?.trim() || null;
    }

    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url || null;
    }

    console.log('PUT profile - updateData:', updateData);

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('PUT profile error:', error);
      console.error('PUT profile error code:', error.code);
      console.error('PUT profile error message:', error.message);
      console.error('PUT profile error details:', error.details);
      console.error('PUT profile error hint:', error.hint);
      
      if (error.message?.includes('row-level security') || error.code === '42501') {
        return NextResponse.json(
          { error: 'Xavfsizlik siyosati: Profil yangilash huquqi yo\'q. Iltimos, tizimga kirib qaytib keling.' },
          { status: 403 }
        );
      }
      
      return NextResponse.json({ error: error.message || 'Profil yangilanmadi' }, { status: 500 });
    }

    if (!data || !data.id) {
      console.error('PUT profile - Update returned no data or invalid ID:', data);
      return NextResponse.json(
        { error: 'Profil yangilandi, lekin ma\'lumot olinmadi' },
        { status: 500 }
      );
    }

    console.log('PUT profile - Update successful, data:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PUT profile error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}


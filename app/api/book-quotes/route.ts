import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

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
  // Supabase client'da token'ni header'da yuborish
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
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    console.error('Auth error:', error);
    return { supabase: createSupabaseClient(), user: null };
  }
  
  return { supabase, user };
}

// GET - Barcha kitob fikrlarini olish
export async function GET(request: Request) {
  try {
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query = supabase
      .from('portfolio_book_quotes_rows')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Agar userId berilgan bo'lsa, faqat o'sha foydalanuvchining ma'lumotlarini olish
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('GET book quotes error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to fetch book quotes' },
        { status: 500 }
      );
    }

    // Null id'larni filter qilish
    const validData = (data || []).filter((item: any) => item && item.id !== null && item.id !== undefined);

    return NextResponse.json({ success: true, data: validData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book quotes' },
      { status: 500 }
    );
  }
}

// POST - Yangi kitob fikri qo'shish
export async function POST(request: Request) {
  try {
    // Server-side Supabase client yaratish va authentication tekshirish
    const { supabase, user } = await createAuthenticatedClient(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { book_title, author, quote, image_url } = body;

    // Majburiy maydonlarni tekshirish
    if (!book_title || !quote) {
      return NextResponse.json(
        { success: false, error: 'Kitob nomi va fikr majburiy maydonlar' },
        { status: 400 }
      );
    }

    
    const { data, error } = await supabase
      .from('portfolio_book_quotes_rows')
      .insert([{ 
        book_title, 
        author: author || null, 
        quote, 
        image_url: image_url || null, 
        likes: 0, 
        dislikes: '0', 
        user_id: user.id 
      }])
      .select();

    if (error) {
      console.error('Database error:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      // RLS policy xatosini aniq ko'rsatish
      if (error.message?.includes('row-level security') || error.code === '42501') {
        // Session'ni qayta o'rnatishga harakat qilamiz
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          try {
            const { data: { session: newSession }, error: sessionError } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: token, // Temporary, as we don't have refresh token
            });
            if (!sessionError && newSession) {
              // Qayta urinib ko'ramiz
              const { data: retryData, error: retryError } = await supabase
                .from('portfolio_book_quotes_rows')
                .insert([{ 
                  book_title, 
                  author: author || null, 
                  quote, 
                  image_url: image_url || null, 
                  likes: 0, 
                  dislikes: '0', 
                  user_id: user.id 
                }])
                .select();
              
              if (!retryError && retryData) {
                return NextResponse.json({ success: true, data: retryData[0] });
              }
            }
          } catch (e) {
            console.error('Retry error:', e);
          }
        }
        
        return NextResponse.json(
          { success: false, error: 'Xavfsizlik siyosati: Ma\'lumot qo\'shish huquqi yo\'q. Iltimos, tizimga kirib qaytib keling.' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message || 'Ma\'lumot qo\'shilmadi' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.error('Insert returned no data');
      return NextResponse.json(
        { success: false, error: 'Ma\'lumot qo\'shilmadi. Iltimos, qayta urinib ko\'ring.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create book quote' },
      { status: 500 }
    );
  }
}

// PUT - Kitob fikrni yangilash
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, book_title, author, quote, image_url, likes, dislikes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    // Agar faqat likes/dislikes yangilanayotgan bo'lsa (reaksiya), authentication shart emas
    // Chunki barcha foydalanuvchilar reaksiya berishi mumkin
    const isReactionUpdate = (likes !== undefined || dislikes !== undefined) && 
                             book_title === undefined && author === undefined && 
                             quote === undefined && image_url === undefined;
    const isContentUpdate = book_title !== undefined || author !== undefined || quote !== undefined || image_url !== undefined;

    // Agar content yangilanayotgan bo'lsa, authentication va huquqni tekshirish
    if (isContentUpdate) {
      // Server-side Supabase client yaratish va authentication tekshirish
      const { supabase, user } = await createAuthenticatedClient(request);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
          { status: 401 }
        );
      }
      // Avval qator mavjudligini va foydalanuvchi huquqini tekshirish
      const { data: existingQuotes, error: fetchError } = await supabase
        .from('portfolio_book_quotes_rows')
        .select('id, user_id')
        .eq('id', id);
      
      const existingQuote = existingQuotes && existingQuotes.length > 0 ? existingQuotes[0] : null;

      if (fetchError || !existingQuote) {
        console.error('Quote not found:', fetchError);
        return NextResponse.json(
          { success: false, error: 'Kitob fikri topilmadi yoki sizda unga kirish huquqi yo\'q' },
          { status: 404 }
        );
      }

      // Foydalanuvchi huquqini tekshirish
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id);
      
      const profile = profiles && profiles.length > 0 ? profiles[0] : null;

      const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
      const isOwner = existingQuote.user_id === user.id;

      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          { success: false, error: 'Sizda bu fikrni yangilash huquqi yo\'q' },
          { status: 403 }
        );
      }

      const updateData: Record<string, unknown> = {};
      if (book_title !== undefined) updateData.book_title = book_title;
      if (author !== undefined) updateData.author = author;
      if (quote !== undefined) updateData.quote = quote;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (likes !== undefined) updateData.likes = likes;
      // dislikes ni stringga o'zgartirish (jadvalda text formatida)
      if (dislikes !== undefined) {
        updateData.dislikes = String(dislikes);
      }

      // Hech qanday yangilanish bo'lmasa
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { success: false, error: 'Yangilanish uchun ma\'lumot kiritilmagan' },
          { status: 400 }
        );
      }
      
      const { data, error } = await supabase
        .from('portfolio_book_quotes_rows')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Update error:', error);
        return NextResponse.json(
          { success: false, error: error.message || 'Ma\'lumot yangilanmadi' },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        console.error('Update returned no data for id:', id);
        return NextResponse.json(
          { success: false, error: 'Ma\'lumot yangilanmadi. Iltimos, qayta urinib ko\'ring.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: data[0] });
    } else if (isReactionUpdate) {
      // Reaksiya yangilanishi - authentication shart emas, chunki RLS o'chirilgan
      const supabase = createSupabaseClient();
      
      const updateData: Record<string, unknown> = {};
      if (likes !== undefined) updateData.likes = likes;
      if (dislikes !== undefined) {
        updateData.dislikes = String(dislikes);
      }
      
      const { data, error } = await supabase
        .from('portfolio_book_quotes_rows')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Reaction update error:', error);
        return NextResponse.json(
          { success: false, error: error.message || 'Reaksiya yangilanmadi' },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        console.error('Reaction update returned no data for id:', id);
        return NextResponse.json(
          { success: false, error: 'Reaksiya yangilanmadi. Iltimos, qayta urinib ko\'ring.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: data[0] });
    } else {
      return NextResponse.json(
        { success: false, error: 'Yangilanish uchun ma\'lumot kiritilmagan' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Ma\'lumot yangilashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

// DELETE - Kitob fikrni o'chirish
export async function DELETE(request: Request) {
  try {
    // Server-side Supabase client yaratish va authentication tekshirish
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
    // RLS policy tufayli, agar foydalanuvchi huquqi bo'lmasa, qator topilmaydi
    const { data: existingQuotes, error: fetchError } = await supabase
      .from('portfolio_book_quotes_rows')
      .select('id, user_id')
      .eq('id', id);
    
    const existingQuote = existingQuotes && existingQuotes.length > 0 ? existingQuotes[0] : null;

    if (fetchError || !existingQuote) {
      console.error('Quote not found:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Kitob fikri topilmadi yoki sizda unga kirish huquqi yo\'q' },
        { status: 404 }
      );
    }

    // Foydalanuvchi huquqini tekshirish
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id);
    
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
    const isOwner = existingQuote.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Sizda bu fikrni o\'chirish huquqi yo\'q' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('portfolio_book_quotes_rows')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      // RLS policy xatosini aniq ko'rsatish
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
      { success: false, error: error.message || 'Failed to delete book quote' },
      { status: 500 }
    );
  }
}


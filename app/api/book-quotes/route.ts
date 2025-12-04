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
  const supabase = createSupabaseClient();
  
  // Request header'dan Authorization token olish
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Token bilan client yaratish
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      return { supabase, user };
    }
  }
  
  // Cookie'lardan token olish
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);
    
    // Supabase cookie nomlarini topish - bir nechta variant
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = supabaseUrl.split('//')[1].split('.')[0];
    
    // Turli xil cookie nomlarini sinab ko'rish
    const possibleTokenKeys = [
      `sb-${projectRef}-auth-token`,
      `sb-${projectRef}-auth-token-code-verifier`,
      `sb-access-token`,
      `supabase.auth.token`,
    ];
    
    const possibleRefreshKeys = [
      `sb-${projectRef}-auth-refresh-token`,
      `sb-refresh-token`,
      `supabase.auth.refresh_token`,
    ];
    
    let accessToken: string | undefined;
    let refreshToken: string | undefined;
    
    for (const key of possibleTokenKeys) {
      if (cookies[key]) {
        // Cookie JSON formatida bo'lishi mumkin
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
    
    for (const key of possibleRefreshKeys) {
      if (cookies[key]) {
        try {
          const cookieValue = cookies[key];
          if (cookieValue.startsWith('{')) {
            const parsed = JSON.parse(cookieValue);
            refreshToken = parsed.refresh_token || parsed;
          } else {
            refreshToken = cookieValue;
          }
          break;
        } catch {
          refreshToken = cookies[key];
          break;
        }
      }
    }
    
    if (accessToken) {
      try {
        // Agar faqat access token bo'lsa, getUser bilan tekshirish
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (user && !error) {
          return { supabase, user };
        }
        
        // Agar refresh token ham bo'lsa, setSession qilish
        if (refreshToken) {
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (session && !sessionError) {
            return { supabase, user: session.user };
          }
        }
      } catch (e) {
        console.error('Session set error:', e);
      }
    }
  }
  
  return { supabase, user: null };
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

    if (error) throw error;

    return NextResponse.json({ success: true, data });
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
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create book quote' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
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
    // Server-side Supabase client yaratish va authentication tekshirish
    const { supabase, user } = await createAuthenticatedClient(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { id, book_title, author, quote, image_url, likes, dislikes } = body;

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
    
    const { data, error } = await supabase
      .from('portfolio_book_quotes_rows')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update book quote' },
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

    const { error } = await supabase
      .from('portfolio_book_quotes_rows')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to delete book quote' },
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


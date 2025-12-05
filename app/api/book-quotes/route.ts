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
    
    // User'ning reaction'larini olish uchun authentication token olish
    let currentUserId: string | null = null;
    try {
      const { supabase: authSupabase, user } = await createAuthenticatedClient(request);
      if (user) {
        currentUserId = user.id;
      }
    } catch (error) {
      console.log('GET book quotes - No authenticated user, reactions will be null');
    }
    
    console.log('GET book quotes - userId:', userId);
    console.log('GET book quotes - currentUserId (for reactions):', currentUserId);
    
    // Avval barcha ma'lumotlarni olish (NULL ID'larsiz)
    let query = supabase
      .from('portfolio_book_quotes_rows')
      .select('*')
      .not('id', 'is', null) // NULL ID'larni filter qilish
      .order('created_at', { ascending: false });
    
    // Agar userId berilgan bo'lsa, faqat o'sha foydalanuvchining ma'lumotlarini olish
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    console.log('GET book quotes - data count:', data?.length || 0);
    console.log('GET book quotes - error:', error);

    if (error) {
      console.error('GET book quotes error:', error);
      console.error('GET book quotes error code:', error.code);
      console.error('GET book quotes error message:', error.message);
      throw error;
    }

    // Qo'shimcha filter - NULL ID'larni va boshqa muammolarni o'chirish
    const validData = (data || [])
      .filter((item: any) => {
        // NULL yoki undefined ID'larni o'chirish
        if (!item || item.id === null || item.id === undefined || item.id === '') {
          return false;
        }
        // ID'ni number ga o'zgartirish mumkinligini tekshirish
        const idNum = Number(item.id);
        if (isNaN(idNum) || idNum <= 0) {
          return false;
        }
        return true;
      })
      .map((item: any) => ({
        ...item,
        id: Number(item.id), // ID'ni number ga o'zgartirish
      }));

    console.log('GET book quotes - valid data count:', validData.length);
    
    // Agar authenticated user bo'lsa, reaction'larni olish
    let userReactions: Record<number, 'like' | 'dislike'> = {};
    if (currentUserId && validData.length > 0) {
      const quoteIds = validData.map((item: any) => item.id);
      const { data: reactionsData, error: reactionsError } = await supabase
        .from('book_quote_reactions')
        .select('quote_id, reaction_type')
        .eq('user_id', currentUserId)
        .in('quote_id', quoteIds);
      
      if (!reactionsError && reactionsData) {
        reactionsData.forEach((reaction: any) => {
          userReactions[Number(reaction.quote_id)] = reaction.reaction_type;
        });
        console.log('GET book quotes - user reactions:', userReactions);
      }
    }
    
    // Har bir quote uchun reaction count'larni va user reaction'ni hisoblash
    const quotesWithReactions = await Promise.all(
      validData.map(async (quote: any) => {
        const quoteId = Number(quote.id);
        
        // Reaction count'larni olish
        const { count: likesCount } = await supabase
          .from('book_quote_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('quote_id', quoteId)
          .eq('reaction_type', 'like');
        
        const { count: dislikesCount } = await supabase
          .from('book_quote_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('quote_id', quoteId)
          .eq('reaction_type', 'dislike');
        
        return {
          ...quote,
          likes: likesCount || 0,
          dislikes: dislikesCount || 0,
          userReaction: userReactions[quoteId] || null,
        };
      })
    );

    return NextResponse.json({ success: true, data: quotesWithReactions });
  } catch (error: any) {
    console.error('GET book quotes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch book quotes' },
      { status: 500 }
    );
  }
}

// POST - Yangi kitob fikri qo'shish
export async function POST(request: Request) {
  try {
    // Server-side Supabase client yaratish va authentication tekshirish
    const { supabase, user } = await createAuthenticatedClient(request);
    
    console.log('POST request - user:', user ? user.id : 'null');
    
    if (!user) {
      console.error('POST request - No user found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { book_title, author, quote, image_url } = body;
    
    console.log('POST request - body:', { book_title, author, quote: quote?.substring(0, 50) + '...' });

    // Majburiy maydonlarni tekshirish
    if (!book_title || !quote) {
      return NextResponse.json(
        { success: false, error: 'Kitob nomi va fikr majburiy maydonlar' },
        { status: 400 }
      );
    }

    
    console.log('POST request - Inserting data with user_id:', user.id);
    
    const insertData = { 
      book_title, 
      author: author || null, 
      quote, 
      image_url: image_url || null, 
      likes: 0, 
      dislikes: '0', 
      user_id: user.id 
    };
    
    console.log('POST request - Insert data:', insertData);
    
    // INSERT operatsiyasini bajarish - .select().single() bilan to'g'ridan-to'g'ri qaytaradi
    // Endi id avtomatik generate qilinadi (DEFAULT nextval(...))
    const { data: insertedData, error: insertError } = await supabase
      .from('portfolio_book_quotes_rows')
      .insert([insertData])
      .select()
      .single();
    
    console.log('POST request - Insert result - data:', insertedData);
    console.log('POST request - Insert result - error:', insertError);

    if (insertError) {
      console.error('POST request - Database error:', insertError);
      console.error('POST request - Error code:', insertError.code);
      console.error('POST request - Error details:', insertError.details);
      console.error('POST request - Error hint:', insertError.hint);
      console.error('POST request - Error message:', insertError.message);
      
      // RLS policy xatosini aniq ko'rsatish
      if (insertError.message?.includes('row-level security') || insertError.code === '42501') {
        return NextResponse.json(
          { success: false, error: 'Xavfsizlik siyosati: Ma\'lumot qo\'shish huquqi yo\'q. Iltimos, tizimga kirib qaytib keling.' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, error: insertError.message || 'Ma\'lumot qo\'shilmadi. Iltimos, qayta urinib ko\'ring.' },
        { status: 500 }
      );
    }

    // INSERT muvaffaqiyatli va ma'lumot qaytarildi
    if (!insertedData || !insertedData.id || insertedData.id === null) {
      console.error('POST request - Insert returned no data or invalid ID:', insertedData);
      return NextResponse.json(
        { success: false, error: 'Ma\'lumot qo\'shildi, lekin ID olinmadi. Iltimos, sahifani yangilang.' },
        { status: 500 }
      );
    }

    console.log('POST request - Insert successful, returning data:', insertedData);
    return NextResponse.json({ success: true, data: insertedData });
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
    const { id, book_title, author, quote, image_url, likes, dislikes, reaction } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    // Agar reaction field yuborilgan bo'lsa, bu reaction update
    const isReactionUpdate = reaction !== undefined;
    // Agar content field'lar yuborilgan bo'lsa, bu content update
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
        .select('*');

      if (error) {
        console.error('PUT request - Update error:', error);
        console.error('PUT request - Error code:', error.code);
        console.error('PUT request - Error message:', error.message);
        return NextResponse.json(
          { success: false, error: error.message || 'Ma\'lumot yangilanmadi' },
          { status: 500 }
        );
      }

      if (!data || data.length === 0 || !data[0] || !data[0].id) {
        console.error('PUT request - Update returned no data for id:', id);
        console.error('PUT request - Data:', data);
        
        // Qayta urinib ko'ramiz - yangilangan ma'lumotni o'qib olish
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: retryData, error: retryError } = await supabase
          .from('portfolio_book_quotes_rows')
          .select('*')
          .eq('id', id)
          .single();
        
        if (retryError || !retryData || !retryData.id) {
          console.error('PUT request - Retry fetch error:', retryError);
          return NextResponse.json(
            { success: false, error: 'Ma\'lumot yangilandi, lekin o\'qib bo\'lmadi. Iltimos, sahifani yangilang.' },
            { status: 500 }
          );
        }
        
        console.log('PUT request - Retry fetch successful, data:', retryData);
        return NextResponse.json({ success: true, data: retryData });
      }

      console.log('PUT request - Update successful, data:', data[0]);
      return NextResponse.json({ success: true, data: data[0] });
    } else if (isReactionUpdate) {
      // Reaksiya yangilanishi - authentication kerak
      const { supabase, user } = await createAuthenticatedClient(request);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Reaksiya berish uchun tizimga kiring.' },
          { status: 401 }
        );
      }
      
      // Reaction type'ni aniqlash
      let reactionType: 'like' | 'dislike' | null = null;
      if (likes !== undefined && dislikes !== undefined) {
        // Frontend'dan kelgan ma'lumotga qarab aniqlash
        // Agar likes oshgan bo'lsa, like
        // Agar dislikes oshgan bo'lsa, dislike
        // Agar ikkalasi ham kamaygan bo'lsa, reaction o'chirilgan
      }
      
      // Avval mavjud reaction'ni topish
      const { data: existingReaction, error: fetchReactionError } = await supabase
        .from('book_quote_reactions')
        .select('*')
        .eq('quote_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchReactionError && fetchReactionError.code !== 'PGRST116') {
        console.error('Fetch reaction error:', fetchReactionError);
        return NextResponse.json(
          { success: false, error: 'Reaksiya tekshirishda xatolik' },
          { status: 500 }
        );
      }
      
      // Frontend'dan kelgan ma'lumotga qarab reaction type'ni aniqlash
      // Bu frontend'dan kelgan likes/dislikes qiymatiga qarab aniqlanadi
      // Lekin biz frontend'dan reaction type'ni to'g'ridan-to'g'ri olishimiz kerak
      // Hozircha frontend'dan reaction type yuborilmayapti, shuning uchun eski logikani ishlatamiz
      
      // Frontend'dan reaction type yuborilishi kerak
      const { reaction } = body; // 'like', 'dislike', yoki null (o'chirish)
      
      if (reaction === null && existingReaction) {
        // Reaction o'chirish
        const { error: deleteError } = await supabase
          .from('book_quote_reactions')
          .delete()
          .eq('quote_id', id)
          .eq('user_id', user.id);
        
        if (deleteError) {
          console.error('Delete reaction error:', deleteError);
          return NextResponse.json(
            { success: false, error: 'Reaksiya o\'chirishda xatolik' },
            { status: 500 }
          );
        }
      } else if (reaction === 'like' || reaction === 'dislike') {
        // Reaction qo'shish yoki yangilash (UPSERT)
        const reactionData = {
          quote_id: id,
          user_id: user.id,
          reaction_type: reaction,
        };
        
        if (existingReaction) {
          // Update
          const { error: updateError } = await supabase
            .from('book_quote_reactions')
            .update({ reaction_type: reaction, updated_at: new Date().toISOString() })
            .eq('quote_id', id)
            .eq('user_id', user.id);
          
          if (updateError) {
            console.error('Update reaction error:', updateError);
            return NextResponse.json(
              { success: false, error: 'Reaksiya yangilashda xatolik' },
              { status: 500 }
            );
          }
        } else {
          // Insert
          const { error: insertError } = await supabase
            .from('book_quote_reactions')
            .insert([reactionData]);
          
          if (insertError) {
            console.error('Insert reaction error:', insertError);
            return NextResponse.json(
              { success: false, error: 'Reaksiya qo\'shishda xatolik' },
              { status: 500 }
            );
          }
        }
      }
      
      // Reaction count'larni hisoblash
      const { count: likesCount, error: likesCountError } = await supabase
        .from('book_quote_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('quote_id', id)
        .eq('reaction_type', 'like');
      
      if (likesCountError) {
        console.error('Likes count error:', likesCountError);
      }
      
      const { count: dislikesCount, error: dislikesCountError } = await supabase
        .from('book_quote_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('quote_id', id)
        .eq('reaction_type', 'dislike');
      
      if (dislikesCountError) {
        console.error('Dislikes count error:', dislikesCountError);
      }
      
      const finalLikesCount = likesCount || 0;
      const finalDislikesCount = dislikesCount || 0;
      
      console.log('Reaction counts - likes:', finalLikesCount, 'dislikes:', finalDislikesCount);
      
      // portfolio_book_quotes_rows table'ni yangilash
      // Note: Bu table'ni yangilash shart emas, chunki reaction count'lar har safar hisoblanadi
      // Lekin backward compatibility uchun saqlab qolamiz
      const { data: updatedQuote, error: updateQuoteError } = await supabase
        .from('portfolio_book_quotes_rows')
        .update({ 
          likes: finalLikesCount,
          dislikes: String(finalDislikesCount)
        })
        .eq('id', id)
        .select()
        .single();
      
      if (updateQuoteError) {
        console.error('Update quote error:', updateQuoteError);
        console.error('Update quote error code:', updateQuoteError.code);
        console.error('Update quote error message:', updateQuoteError.message);
        console.error('Update quote error details:', updateQuoteError.details);
        console.error('Update quote error hint:', updateQuoteError.hint);
        
        // Agar update xato bersa, lekin reaction saqlangan bo'lsa, 
        // faqat reaction ma'lumotlarini qaytaramiz
        const { data: quoteData, error: fetchQuoteError } = await supabase
          .from('portfolio_book_quotes_rows')
          .select('*')
          .eq('id', id)
          .single();
        
        if (fetchQuoteError || !quoteData) {
          return NextResponse.json(
            { success: false, error: 'Quote yangilashda xatolik: ' + (updateQuoteError.message || 'Noma\'lum xatolik') },
            { status: 500 }
          );
        }
        
        // Reaction count'larni qo'shib qaytaramiz
        return NextResponse.json({ 
          success: true, 
          data: {
            ...quoteData,
            likes: finalLikesCount,
            dislikes: finalDislikesCount,
            userReaction: reaction || null,
          }
        });
      }
      
      // User'ning reaction'ini qo'shish
      const { data: userReactionData } = await supabase
        .from('book_quote_reactions')
        .select('reaction_type')
        .eq('quote_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      return NextResponse.json({ 
        success: true, 
        data: {
          ...updatedQuote,
          likes: likesCount,
          dislikes: dislikesCount,
          userReaction: userReactionData?.reaction_type || null,
        }
      });
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


import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
  
  if (!accessToken) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    return { supabase, user: null };
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null };
  }
  return { supabase, user };
}

// GET - Foydalanuvchi reaksiyalarini olish
export async function GET(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);
    
    if (!user) {
      return NextResponse.json({ success: true, data: {} });
    }

    const { searchParams } = new URL(request.url);
    const quoteIds = searchParams.get('quoteIds');
    
    if (!quoteIds) {
      return NextResponse.json({ success: true, data: {} });
    }

    const quoteIdArray = quoteIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
    
    if (quoteIdArray.length === 0) {
      return NextResponse.json({ success: true, data: {} });
    }

    const { data, error } = await supabase
      .from('book_quote_reactions')
      .select('quote_id, reaction_type')
      .eq('user_id', user.id)
      .in('quote_id', quoteIdArray);

    if (error) {
      console.error('Error fetching reactions:', error);
      return NextResponse.json({ success: true, data: {} });
    }

    const reactions: Record<number, 'like' | 'dislike'> = {};
    if (data) {
      data.forEach((reaction: { quote_id: number; reaction_type: 'like' | 'dislike' }) => {
        reactions[reaction.quote_id] = reaction.reaction_type;
      });
    }

    return NextResponse.json({ success: true, data: reactions });
  } catch (error: any) {
    console.error('GET reactions error:', error);
    return NextResponse.json({ success: true, data: {} });
  }
}

// POST - Reaksiya qo'shish yoki yangilash
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
    const { quote_id, reaction_type } = body;

    if (!quote_id || !reaction_type) {
      return NextResponse.json(
        { success: false, error: 'quote_id va reaction_type majburiy maydonlar' },
        { status: 400 }
      );
    }

    if (reaction_type !== 'like' && reaction_type !== 'dislike') {
      return NextResponse.json(
        { success: false, error: 'reaction_type "like" yoki "dislike" bo\'lishi kerak' },
        { status: 400 }
      );
    }

    // Avval mavjud reaksiyani tekshirish
    const { data: existing, error: fetchError } = await supabase
      .from('book_quote_reactions')
      .select('id, reaction_type')
      .eq('quote_id', quote_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing reaction:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Reaksiyani tekshirishda xatolik' },
        { status: 500 }
      );
    }

    if (existing) {
      // Agar bir xil reaksiya bo'lsa, o'chirish (toggle)
      if (existing.reaction_type === reaction_type) {
        const { error: deleteError } = await supabase
          .from('book_quote_reactions')
          .delete()
          .eq('id', existing.id);

        if (deleteError) {
          console.error('Error deleting reaction:', deleteError);
          return NextResponse.json(
            { success: false, error: 'Reaksiyani o\'chirishda xatolik' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, data: { reaction_type: null } });
      } else {
        // Agar boshqa reaksiya bo'lsa, yangilash
        const { error: updateError } = await supabase
          .from('book_quote_reactions')
          .update({ reaction_type, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error updating reaction:', updateError);
          return NextResponse.json(
            { success: false, error: 'Reaksiyani yangilashda xatolik' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, data: { reaction_type } });
      }
    } else {
      // Yangi reaksiya qo'shish
      const { error: insertError } = await supabase
        .from('book_quote_reactions')
        .insert([{ quote_id, user_id: user.id, reaction_type }]);

      if (insertError) {
        console.error('Error inserting reaction:', insertError);
        return NextResponse.json(
          { success: false, error: 'Reaksiyani qo\'shishda xatolik' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: { reaction_type } });
    }
  } catch (error: any) {
    console.error('POST reactions error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Reaksiyani saqlashda xatolik' },
      { status: 500 }
    );
  }
}


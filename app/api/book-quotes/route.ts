import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Barcha kitob fikrlarini olish
export async function GET(request: Request) {
  try {
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
    const body = await request.json();
    const { book_title, author, quote, image_url, user_id } = body;

    const { data, error } = await supabase
      .from('portfolio_book_quotes_rows')
      .insert([{ book_title, author, quote, image_url, likes: 0, dislikes: '0', user_id }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create book quote' },
      { status: 500 }
    );
  }
}

// PUT - Kitob fikrni yangilash
export async function PUT(request: Request) {
  try {
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

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete book quote' },
      { status: 500 }
    );
  }
}


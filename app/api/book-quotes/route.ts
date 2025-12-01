import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Barcha kitob fikrlarini olish
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('portfolio_book_quotes')
      .select('*')
      .order('created_at', { ascending: false });

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
    const { book_title, author, quote, image_url } = body;

    const { data, error } = await supabase
      .from('portfolio_book_quotes')
      .insert([{ book_title, author, quote, image_url }])
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
    if (dislikes !== undefined) updateData.dislikes = dislikes;

    const { data, error } = await supabase
      .from('portfolio_book_quotes')
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
      .from('portfolio_book_quotes')
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


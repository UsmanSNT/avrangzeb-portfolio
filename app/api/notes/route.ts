import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Barcha qaydlarni olish
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('portfolio_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST - Yangi qayd qo'shish
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, tags, important } = body;

    const { data, error } = await supabase
      .from('portfolio_notes')
      .insert([{ title, content, category, tags: tags || [], important: important || false }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

// PUT - Qaydni yangilash
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, content, category, tags, important } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (important !== undefined) updateData.important = important;

    const { data, error } = await supabase
      .from('portfolio_notes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE - Qaydni o'chirish
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
      .from('portfolio_notes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}


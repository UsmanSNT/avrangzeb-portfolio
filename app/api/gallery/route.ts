import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Barcha galereya elementlarini olish
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('portfolio_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST - Yangi galereya elementi qo'shish
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, images } = body;

    const { data, error } = await supabase
      .from('portfolio_gallery')
      .insert([{ title, description, category, images: images || [] }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

// PUT - Galereya elementini yangilash
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, category, images } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (images !== undefined) updateData.images = images;

    const { data, error } = await supabase
      .from('portfolio_gallery')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE - Galereya elementini o'chirish
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
      .from('portfolio_gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}


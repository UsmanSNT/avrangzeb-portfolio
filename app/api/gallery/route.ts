import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Barcha galereya elementlarini olish
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query = supabase
      .from('portfolio_gallery_rows')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Agar userId berilgan bo'lsa, faqat o'sha foydalanuvchining ma'lumotlarini olish
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('GET gallery error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to fetch gallery items' },
        { status: 500 }
      );
    }

    // Null id'larni filter qilish
    const validData = (data || []).filter((item: any) => item && item.id !== null && item.id !== undefined);

    return NextResponse.json({ success: true, data: validData });
  } catch (error: any) {
    console.error('GET gallery error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST - Yangi galereya elementi qo'shish
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, images, user_id } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Sarlavha majburiy maydon' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('portfolio_gallery_rows')
      .insert([{ title, description: description || null, category: category || 'other', images: images || [], user_id }])
      .select();

    if (error) {
      console.error('Gallery insert error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create gallery item' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to create gallery item - no data returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error: any) {
    console.error('POST gallery error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

// PUT - Galereya elementini yangilash
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, category, images } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (images !== undefined) updateData.images = images;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Yangilanish uchun ma\'lumot kiritilmagan' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('portfolio_gallery_rows')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Gallery update error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update gallery item' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Galereya elementi topilmadi yoki yangilash amalga oshmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error: any) {
    console.error('PUT gallery error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update gallery item' },
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
      .from('portfolio_gallery_rows')
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


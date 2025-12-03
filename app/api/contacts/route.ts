import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Xabarlarni olish (admin uchun)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('portfolio_contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json({ error: 'Xabarlarni olishda xatolik' }, { status: 500 });
  }
}

// Yangi xabar yuborish
export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Barcha maydonlar to\'ldirilishi kerak' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('portfolio_contacts')
      .insert([{ name, email, message }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Xabaringiz muvaffaqiyatli yuborildi!',
      data 
    });
  } catch (error) {
    console.error('Send contact error:', error);
    return NextResponse.json({ error: 'Xabar yuborishda xatolik' }, { status: 500 });
  }
}

// Xabarni o'qilgan deb belgilash
export async function PUT(request: NextRequest) {
  try {
    const { id, is_read } = await request.json();

    const { error } = await supabase
      .from('portfolio_contacts')
      .update({ is_read })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json({ error: 'Yangilashda xatolik' }, { status: 500 });
  }
}

// Xabarni o'chirish
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 });
    }

    const { error } = await supabase
      .from('portfolio_contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json({ error: 'O\'chirishda xatolik' }, { status: 500 });
  }
}


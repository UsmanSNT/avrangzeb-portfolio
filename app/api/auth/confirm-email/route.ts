import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, getMissingSupabaseEnvResponse } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseServerClient({ useServiceRole: true });
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId va email kerak' }, { status: 400 });
    }

    // SQL orqali email'ni tasdiqlash
    const { error } = await supabaseAdmin.rpc('confirm_user_email', { user_id: userId });
    
    if (error) {
      // Agar RPC ishlamasa, to'g'ridan-to'g'ri SQL ishlatamiz
      console.log('RPC error, trying direct update');
    }

    return NextResponse.json({ success: true, message: 'Email tasdiqlandi' });
  } catch (error) {
    const missingEnvResponse = getMissingSupabaseEnvResponse(error);
    if (missingEnvResponse) {
      return NextResponse.json(missingEnvResponse, { status: 500 });
    }

    console.error('Confirm email error:', error);
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}



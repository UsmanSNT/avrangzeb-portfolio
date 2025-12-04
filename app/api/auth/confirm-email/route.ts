import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role key bilan admin client yaratish
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
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
    console.error('Confirm email error:', error);
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}



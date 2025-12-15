import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
  
  // Agar token topilmasa, unauthenticated client qaytarish
  if (!accessToken) {
    return { supabase: supabase, user: null };
  }
  
  // Authenticated client yaratish
  const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  
  const { data: { user }, error } = await authenticatedSupabase.auth.getUser();

  if (error || !user) {
    console.error('Auth error:', error);
    return { supabase: supabase, user: null };
  }
  return { supabase: authenticatedSupabase, user };
}

// Telegram xabar yuborish
async function sendTelegramMessage(name: string, telegram: string, message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram credentials not configured');
    return false;
  }

  // Telegram username formatlash
  const telegramLink = telegram.startsWith('@') ? telegram : `@${telegram}`;

  const text = `📬 *Yangi xabar!*

👤 *Ism:* ${name}
✈️ *Telegram:* ${telegramLink}

💬 *Xabar:*
${message}

⏰ *Vaqt:* ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Seoul' })}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Telegram send error:', error);
    return false;
  }
}

// Email yuborish (Resend API orqali) - ixtiyoriy
async function sendEmailNotification(name: string, telegram: string, message: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'avrangzebabdujalilov@gmail.com';

  if (!resendApiKey) {
    console.log('Resend API key not configured');
    return false;
  }

  const telegramLink = telegram.startsWith('@') ? telegram : `@${telegram}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: adminEmail,
        subject: `📬 Yangi xabar: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #06b6d4;">📬 Yangi xabar keldi!</h2>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>👤 Ism:</strong> ${name}</p>
              <p><strong>✈️ Telegram:</strong> <a href="https://t.me/${telegram.replace('@', '')}">${telegramLink}</a></p>
              <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 15px 0;">
              <p><strong>💬 Xabar:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #64748b; font-size: 12px;">
              ⏰ Yuborilgan vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Seoul' })}
            </p>
          </div>
        `
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

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
    const body = await request.json();
    const { name, telegram, message } = body;

    console.log('POST /api/contacts - Request body:', { name, telegram, message: message?.substring(0, 50) + '...' });

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Ism maydoni to\'ldirilishi kerak' }, { status: 400 });
    }

    if (!telegram || !telegram.trim()) {
      return NextResponse.json({ error: 'Telegram maydoni to\'ldirilishi kerak' }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Xabar maydoni to\'ldirilishi kerak' }, { status: 400 });
    }

    // Database'ga saqlash
    console.log('POST /api/contacts - Inserting to database...');
    const { data, error } = await supabase
      .from('portfolio_contacts')
      .insert([{ 
        name: name.trim(), 
        telegram: telegram.trim(), 
        message: message.trim() 
      }])
      .select()
      .single();

    if (error) {
      console.error('POST /api/contacts - Database error:', error);
      console.error('POST /api/contacts - Error code:', error.code);
      console.error('POST /api/contacts - Error message:', error.message);
      console.error('POST /api/contacts - Error details:', error.details);
      console.error('POST /api/contacts - Error hint:', error.hint);
      
      // RLS policy xatosini aniq ko'rsatish
      if (error.message?.includes('row-level security') || error.code === '42501') {
        return NextResponse.json({ 
          error: 'Xavfsizlik siyosati: Xabar yuborish huquqi yo\'q' 
        }, { status: 403 });
      }
      
      return NextResponse.json({ 
        error: error.message || 'Xabar saqlashda xatolik yuz berdi' 
      }, { status: 500 });
    }

    if (!data || !data.id) {
      console.error('POST /api/contacts - Insert returned no data or invalid ID:', data);
      return NextResponse.json({ 
        error: 'Xabar saqlandi, lekin ma\'lumot olinmadi' 
      }, { status: 500 });
    }

    console.log('POST /api/contacts - Data saved successfully:', data);

    // Telegram'ga yuborish (agar sozlangan bo'lsa) - async, xato bo'lsa ham davom etadi
    let telegramSent = false;
    try {
      telegramSent = await sendTelegramMessage(name.trim(), telegram.trim(), message.trim());
      console.log('POST /api/contacts - Telegram notification sent:', telegramSent);
    } catch (telegramError) {
      console.error('POST /api/contacts - Telegram error (non-blocking):', telegramError);
    }
    
    // Email'ga yuborish (agar sozlangan bo'lsa) - async, xato bo'lsa ham davom etadi
    let emailSent = false;
    try {
      emailSent = await sendEmailNotification(name.trim(), telegram.trim(), message.trim());
      console.log('POST /api/contacts - Email notification sent:', emailSent);
    } catch (emailError) {
      console.error('POST /api/contacts - Email error (non-blocking):', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Xabaringiz muvaffaqiyatli yuborildi!',
      notifications: {
        telegram: telegramSent,
        email: emailSent
      },
      data 
    });
  } catch (error: any) {
    console.error('POST /api/contacts - Unexpected error:', error);
    return NextResponse.json({ 
      error: error.message || 'Xabar yuborishda kutilmagan xatolik yuz berdi' 
    }, { status: 500 });
  }
}

// Xabarni o'qilgan deb belgilash
export async function PUT(request: NextRequest) {
  try {
    // Authentication tekshirish
    const { supabase: authSupabase, user } = await createAuthenticatedClient(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    // Admin yoki super_admin bo'lishi kerak
    const { data: profileData } = await authSupabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { id, is_read } = await request.json();

    const { error } = await authSupabase
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
    // Authentication tekshirish
    const { supabase: authSupabase, user } = await createAuthenticatedClient(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    // Admin yoki super_admin bo'lishi kerak
    const { data: profileData } = await authSupabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 });
    }

    const { error } = await authSupabase
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

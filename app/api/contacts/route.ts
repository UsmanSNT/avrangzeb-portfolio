import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const { name, telegram, message } = await request.json();

    if (!name || !telegram || !message) {
      return NextResponse.json({ error: 'Barcha maydonlar to\'ldirilishi kerak' }, { status: 400 });
    }

    // Database'ga saqlash
    const { data, error } = await supabase
      .from('portfolio_contacts')
      .insert([{ name, telegram, message }])
      .select()
      .single();

    if (error) throw error;

    // Telegram'ga yuborish (agar sozlangan bo'lsa)
    const telegramSent = await sendTelegramMessage(name, telegram, message);
    
    // Email'ga yuborish (agar sozlangan bo'lsa)
    const emailSent = await sendEmailNotification(name, telegram, message);

    return NextResponse.json({ 
      success: true, 
      message: 'Xabaringiz muvaffaqiyatli yuborildi!',
      notifications: {
        telegram: telegramSent,
        email: emailSent
      },
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


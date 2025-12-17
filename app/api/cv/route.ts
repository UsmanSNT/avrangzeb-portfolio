import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

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
  
  // Agar access token bo'lmasa, null qaytaramiz
  if (!accessToken) {
    return { supabase: createSupabaseClient(), user: null };
  }
  
  // Token bilan authenticated client yaratish
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  
  // User'ni tekshirish
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error('Auth error:', error);
    return { supabase: createSupabaseClient(), user: null };
  }
  
  return { supabase, user };
}

// GET - CV'ni olish (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const supabase = createSupabaseClient();
    
    let query = supabase
      .from('user_profiles')
      .select('id, cv_url, full_name');

    if (userId) {
      query = query.eq('id', userId);
    } else {
      // Agar userId ko'rsatilmagan bo'lsa, birinchi super_admin yoki admin'ni qaytarish
      query = query.in('role', ['super_admin', 'admin']).limit(1);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('GET CV error:', error);
      return NextResponse.json(
        { error: error.message || 'CV topilmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cv_url: data.cv_url,
      full_name: data.full_name,
    });
  } catch (error: any) {
    console.error('GET CV error:', error);
    return NextResponse.json(
      { error: error.message || 'CV olishda xatolik' },
      { status: 500 }
    );
  }
}

// POST - CV yuklash (authenticated, admin only)
export async function POST(request: Request) {
  try {
    // Authentication tekshirish
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    // Admin yoki super_admin ekanligini tekshirish
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Sizda CV yuklash huquqi yo\'q. Faqat adminlar CV yuklay oladi.' },
        { status: 403 }
      );
    }

    // FormData'dan fayl olish
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'CV fayli yuborilmadi' },
        { status: 400 }
      );
    }

    // Fayl turini tekshirish (PDF yoki DOC/DOCX)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt || '')) {
      return NextResponse.json(
        { error: 'Faqat PDF, DOC yoki DOCX formatidagi fayllar qabul qilinadi' },
        { status: 400 }
      );
    }

    // Fayl hajmini tekshirish (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fayl hajmi 10MB dan katta bo\'lmasligi kerak' },
        { status: 400 }
      );
    }

    // Eski CV'ni o'chirish (agar mavjud bo'lsa)
    const { data: oldProfile } = await supabase
      .from('user_profiles')
      .select('cv_url')
      .eq('id', user.id)
      .single();

    if (oldProfile?.cv_url) {
      try {
        // Supabase Storage'dan eski faylni o'chirish
        const oldPath = oldProfile.cv_url.split('/').slice(-2).join('/'); // Extract path from URL
        await supabase.storage
          .from('portfolio-files')
          .remove([oldPath]);
      } catch (err) {
        console.error('Eski CV o\'chirishda xatolik:', err);
        // Davom etamiz, chunki yangi faylni yuklash kerak
      }
    }

    // Unique filename yaratish
    const fileName = `cv/${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Faylni buffer'ga o'tkazish
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Supabase Storage'ga yuklash (portfolio-files bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portfolio-files')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('CV upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'CV yuklashda xatolik' },
        { status: 500 }
      );
    }

    // Public URL olish
    const { data: urlData } = supabase.storage
      .from('portfolio-files')
      .getPublicUrl(uploadData.path);

    // user_profiles jadvaliga cv_url saqlash
    const { data: updateData, error: updateError } = await supabase
      .from('user_profiles')
      .update({ cv_url: urlData.publicUrl })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('CV URL update error:', updateError);
      // Agar update xato bo'lsa, yuklangan faylni o'chirish
      await supabase.storage
        .from('portfolio-files')
        .remove([uploadData.path]);
      
      return NextResponse.json(
        { error: updateError.message || 'CV URL saqlashda xatolik' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cv_url: urlData.publicUrl,
      message: 'CV muvaffaqiyatli yuklandi',
    });
  } catch (error: any) {
    console.error('POST CV error:', error);
    return NextResponse.json(
      { error: error.message || 'CV yuklashda xatolik' },
      { status: 500 }
    );
  }
}

// DELETE - CV'ni o'chirish (authenticated, admin only)
export async function DELETE(request: Request) {
  try {
    // Authentication tekshirish
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    // Admin yoki super_admin ekanligini tekshirish
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role, cv_url')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Sizda CV o\'chirish huquqi yo\'q. Faqat adminlar CV o\'chira oladi.' },
        { status: 403 }
      );
    }

    if (!profileData?.cv_url) {
      return NextResponse.json(
        { error: 'CV topilmadi' },
        { status: 404 }
      );
    }

    // Storage'dan faylni o'chirish
    try {
      const cvPath = profileData.cv_url.split('/').slice(-2).join('/');
      const { error: removeError } = await supabase.storage
        .from('portfolio-files')
        .remove([cvPath]);

      if (removeError) {
        console.error('CV remove error:', removeError);
      }
    } catch (err) {
      console.error('CV o\'chirishda xatolik:', err);
    }

    // user_profiles jadvalidan cv_url'ni o'chirish
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ cv_url: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('CV URL delete error:', updateError);
      return NextResponse.json(
        { error: updateError.message || 'CV URL o\'chirishda xatolik' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'CV muvaffaqiyatli o\'chirildi',
    });
  } catch (error: any) {
    console.error('DELETE CV error:', error);
    return NextResponse.json(
      { error: error.message || 'CV o\'chirishda xatolik' },
      { status: 500 }
    );
  }
}


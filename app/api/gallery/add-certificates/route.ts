import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// POST - Sertifikat rasmlarini yuklash va gallery'ga qo'shish
export async function POST(request: Request) {
  try {
    // Session token olish
    const authHeader = request.headers.get('authorization');
    let accessToken: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    }

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Authenticated client yaratish
    const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { data: { user }, error: authError } = await authenticatedSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Foydalanuvchi admin yoki super_admin ekanligini tekshirish
    const { data: profileData } = await authenticatedSupabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Sertifikat rasmlarini yuklash va gallery'ga qo'shish
    const certificateFiles = [
      'Certificate_1.jpg',
      'Certificate_2.jpg',
      'Certificate_3.jpg',
      'Certificate_4.jpg',
      'Certificate_5.jpg',
      'Certificate_6.jpg',
    ];

    const results = [];

    for (const fileName of certificateFiles) {
      try {
        // Rasmni o'qish
        const filePath = join(process.cwd(), 'public', 'images', fileName);
        
        // Fayl mavjudligini tekshirish
        if (!existsSync(filePath)) {
          console.error(`File not found: ${filePath}`);
          results.push({ fileName, success: false, error: 'File not found' });
          continue;
        }
        
        const fileBuffer = await readFile(filePath);

        // Supabase Storage ga yuklash
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const storagePath = `gallery/${timestamp}-${randomStr}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(storagePath, fileBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          console.error(`Upload error for ${fileName}:`, uploadError);
          results.push({ fileName, success: false, error: uploadError.message });
          continue;
        }

        // Public URL olish
        const { data: urlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(uploadData.path);

        // Gallery'ga qo'shish
        const { data: galleryData, error: galleryError } = await authenticatedSupabase
          .from('portfolio_gallery_rows')
          .insert({
            title: fileName.replace('.jpg', '').replace('_', ' '),
            description: `Sertifikat - ${fileName.replace('.jpg', '').replace('_', ' ')}`,
            category: 'certificate',
            images: [urlData.publicUrl],
            user_id: user.id,
          })
          .select()
          .single();

        if (galleryError) {
          console.error(`Gallery insert error for ${fileName}:`, galleryError);
          results.push({ fileName, success: false, error: galleryError.message });
          // Upload qilingan rasmni o'chirish
          await supabase.storage.from('portfolio-images').remove([storagePath]);
          continue;
        }

        results.push({ fileName, success: true, data: galleryData });
      } catch (error: any) {
        console.error(`Error processing ${fileName}:`, error);
        results.push({ fileName, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `${successCount} ta sertifikat muvaffaqiyatli qo'shildi, ${failCount} ta xatolik yuz berdi`,
      results,
    });
  } catch (error: any) {
    console.error('Add certificates error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add certificates' },
      { status: 500 }
    );
  }
}


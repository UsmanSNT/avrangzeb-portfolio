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

// GET - Barcha qaydlarni olish (public - hamma ko'ra oladi)
export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    console.log('GET /api/notes - Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('GET /api/notes - Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing');
    
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('GET /api/notes - userId:', userId);
    
    // Jadval mavjudligini tekshirish
    const { data: tableCheck, error: tableError } = await supabase
      .from('portfolio_notes_rows')
      .select('id')
      .limit(1);
    
    console.log('GET /api/notes - Table check:', { tableCheck, tableError });
    
    if (tableError) {
      console.error('GET /api/notes - Table error:', tableError);
      console.error('GET /api/notes - Error code:', tableError.code);
      console.error('GET /api/notes - Error message:', tableError.message);
      console.error('GET /api/notes - Error details:', tableError.details);
      console.error('GET /api/notes - Error hint:', tableError.hint);
      
      // Agar jadval mavjud emas bo'lsa
      if (tableError.code === '42P01' || tableError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Jadval mavjud emas. Migration qo\'llang.',
          data: []
        });
      }
      
      // RLS policy muammosi bo'lsa
      if (tableError.code === '42501' || tableError.message?.includes('permission')) {
        return NextResponse.json({ 
          success: false, 
          error: 'RLS policy muammosi. Migration qo\'llang.',
          data: []
        });
      }
    }
    
    let query = supabase
      .from('portfolio_notes_rows')
      .select('id, title, content, category, tags, important, created_at, updated_at, user_id')
      .order('created_at', { ascending: false });
    
    // Agar userId berilgan bo'lsa, faqat o'sha foydalanuvchining ma'lumotlarini olish
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    console.log('GET /api/notes - Query result:', { data, error });
    console.log('GET /api/notes - Data length:', data?.length);
    console.log('GET /api/notes - Error code:', error?.code);
    console.log('GET /api/notes - Error message:', error?.message);

    if (error) {
      console.error('GET /api/notes - Full error:', JSON.stringify(error, null, 2));
      
      // RLS policy muammosi bo'lsa
      if (error.code === '42501' || error.message?.includes('permission')) {
        return NextResponse.json({ 
          success: false, 
          error: 'RLS policy muammosi. Migration qo\'llang.',
          data: [],
          errorCode: error.code,
          errorMessage: error.message
        });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to fetch notes',
        data: [],
        errorCode: error.code
      });
    }

    // NULL ID'larni filtrlash
    const filteredData = (data || []).filter((item: any) => {
      const isValid = item && item.id != null && item.title;
      if (!isValid) {
        console.warn('GET /api/notes - Filtered out invalid item:', item);
      }
      return isValid;
    });

    console.log('GET /api/notes - Filtered data length:', filteredData.length);
    console.log('GET /api/notes - Returning data:', filteredData);

    return NextResponse.json({ 
      success: true, 
      data: filteredData,
      count: filteredData.length
    });
  } catch (error: any) {
    console.error('GET /api/notes - Exception:', error);
    console.error('GET /api/notes - Exception details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch notes',
      data: []
    });
  }
}

// POST - Yangi qayd qo'shish
export async function POST(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category, tags, important } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title va content majburiy' },
        { status: 400 }
      );
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      category: category || 'other',
      tags: tags || [],
      important: important || false,
      user_id: user.id
    };

    console.log('POST /api/notes - Creating note with data:', noteData);
    console.log('POST /api/notes - User ID:', user.id);
    console.log('POST /api/notes - User email:', user.email);

    // Jadval mavjudligini tekshirish
    const { data: tableCheck, error: tableError } = await supabase
      .from('portfolio_notes_rows')
      .select('id')
      .limit(1);
    
    console.log('POST /api/notes - Table check:', { tableCheck, tableError });

    if (tableError && tableError.code === '42P01') {
      console.error('POST /api/notes - Table does not exist!');
      return NextResponse.json(
        { success: false, error: 'Jadval mavjud emas. Migration qo\'llang.' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('portfolio_notes_rows')
      .insert([noteData])
      .select('id, title, content, category, tags, important, created_at, updated_at, user_id')
      .single();

    console.log('POST /api/notes - Insert result:', { data, error });
    console.log('POST /api/notes - Error code:', error?.code);
    console.log('POST /api/notes - Error message:', error?.message);
    console.log('POST /api/notes - Error details:', error?.details);
    console.log('POST /api/notes - Error hint:', error?.hint);

    if (error) {
      console.error('POST /api/notes - Full error:', JSON.stringify(error, null, 2));
      
      // RLS policy muammosi
      if (error.code === '42501' || error.message?.includes('permission')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'RLS policy muammosi. Migration qo\'llang yoki RLS policy\'ni tekshiring.',
            errorCode: error.code,
            errorMessage: error.message
          },
          { status: 403 }
        );
      }
      
      // Foreign key muammosi
      if (error.code === '23503') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'User ID noto\'g\'ri. Tizimga qayta kiring.',
            errorCode: error.code
          },
          { status: 400 }
        );
      }
      
      throw error;
    }

    if (!data) {
      console.error('POST /api/notes - No data returned from insert');
      return NextResponse.json(
        { success: false, error: 'Note created but no data returned' },
        { status: 500 }
      );
    }

    console.log('POST /api/notes - Successfully created note:', data);
    console.log('POST /api/notes - Note ID:', data.id);
    console.log('POST /api/notes - Note created_at:', data.created_at);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('POST notes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create note' },
      { status: 500 }
    );
  }
}

// PUT - Qaydni yangilash yoki default notes'larni yuklash
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Agar action=seed bo'lsa, default notes'larni yuklash
    if (action === 'seed') {
      const { supabase, user } = await createAuthenticatedClient(request);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
          { status: 401 }
        );
      }

      // Avval mavjud notes'larni tekshirish
      const { data: existingNotes, error: checkError } = await supabase
        .from('portfolio_notes_rows')
        .select('id')
        .limit(1);

      if (checkError && checkError.code !== '42P01') {
        console.error('PUT /api/notes?action=seed - Check error:', checkError);
      }

      // Agar allaqachon notes bor bo'lsa, yuklashni o'tkazib yuborish
      if (existingNotes && existingNotes.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'Notes allaqachon mavjud. Seed o\'tkazib yuborildi.',
          skipped: true
        });
      }

      const defaultNotes = [
        {
          title: "OSI modeli va TCP/IP protokollari",
          content: `## OSI modeli - 7 qatlam

1. **Physical (Fizik)** - Kabel, signal, bitlar
2. **Data Link** - MAC manzil, switch
3. **Network** - IP manzil, router
4. **Transport** - TCP/UDP, port
5. **Session** - Ulanishni boshqarish
6. **Presentation** - Shifrlash, siqish
7. **Application** - HTTP, FTP, DNS

## TCP vs UDP

| TCP | UDP |
|-----|-----|
| Ishonchli | Tez |
| Ulanishga asoslangan | Ulanishsiz |
| HTTP, FTP, SSH | DNS, DHCP, VoIP |

### Eslatma:
TCP = "Please Deliver Carefully" 📦
UDP = "Just Throw It" 🏀`,
          category: "networking",
          tags: ["OSI", "TCP/IP", "Protokollar"],
          important: true,
          user_id: user.id
        },
        {
          title: "Linux asosiy buyruqlar",
          content: `## Fayl tizimlari bilan ishlash

\`\`\`bash
ls -la          # Fayllar ro'yxati
cd /path        # Katalogga o'tish
pwd             # Joriy katalog
mkdir folder    # Yangi papka
rm -rf folder   # O'chirish (ehtiyot bo'ling!)
cp source dest  # Nusxalash
mv old new      # Ko'chirish/nomini o'zgartirish
\`\`\`

## Tarmoq buyruqlari

\`\`\`bash
ip addr         # IP manzilni ko'rish
ping google.com # Ulanishni tekshirish
netstat -tulpn  # Ochiq portlar
ss -tulpn       # Zamonaviy netstat
traceroute      # Yo'nalishni kuzatish
\`\`\`

## Foydali maslahat:
\`Tab\` tugmasini bosib buyruqlarni avtomatik to'ldiring!`,
          category: "linux",
          tags: ["CLI", "Bash", "Commands"],
          important: false,
          user_id: user.id
        },
        {
          title: "Cisco switch konfiguratsiyasi",
          content: `## Asosiy konfiguratsiya

\`\`\`
enable
configure terminal
hostname SW1
enable secret cisco123
\`\`\`

## VLAN yaratish

\`\`\`
vlan 10
name SERVERS
vlan 20
name USERS
exit
\`\`\`

## Portga VLAN biriktirish

\`\`\`
interface FastEthernet0/1
switchport mode access
switchport access vlan 10
no shutdown
\`\`\`

### Muhim:
Har doim \`copy running-config startup-config\` bilan saqlang!`,
          category: "cisco",
          tags: ["Switch", "VLAN", "IOS"],
          important: true,
          user_id: user.id
        },
        {
          title: "Subnetting asoslari",
          content: `## CIDR notatsiyasi

| CIDR | Subnet Mask | Hostlar soni |
|------|-------------|--------------|
| /24  | 255.255.255.0 | 254 |
| /25  | 255.255.255.128 | 126 |
| /26  | 255.255.255.192 | 62 |
| /27  | 255.255.255.224 | 30 |
| /28  | 255.255.255.240 | 14 |

## Formula:
Hostlar = 2^(32-prefix) - 2

## Misol:
192.168.1.0/26 uchun:
- Network: 192.168.1.0
- Broadcast: 192.168.1.63
- Hostlar: 192.168.1.1 - 192.168.1.62 (62 ta)

### Tez hisoblash:
256 - subnet = increment
Masalan: /26 = 256 - 192 = 64 qadam`,
          category: "networking",
          tags: ["IP", "Subnet", "CIDR"],
          important: false,
          user_id: user.id
        },
        {
          title: "Docker asoslari",
          content: `## Asosiy buyruqlar

\`\`\`bash
docker pull nginx           # Image yuklab olish
docker images               # Imagelar ro'yxati
docker run -d -p 80:80 nginx  # Container ishga tushirish
docker ps                   # Ishlab turgan containerlar
docker ps -a                # Barcha containerlar
docker stop container_id    # To'xtatish
docker rm container_id      # O'chirish
\`\`\`

## Dockerfile misoli

\`\`\`dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
\`\`\``,
          category: "devops",
          tags: ["Docker", "Container", "Image"],
          important: false,
          user_id: user.id
        },
        {
          title: "Firewall va xavfsizlik asoslari",
          content: `## Linux iptables

\`\`\`bash
# Barcha INPUT ni bloklash
iptables -P INPUT DROP

# SSH ruxsat berish
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# HTTP/HTTPS ruxsat
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
\`\`\`

## Xavfsizlik tavsiylari

1. ✅ Kuchli parollar ishlating
2. ✅ SSH uchun key authentication
3. ✅ Keraksiz portlarni yoping
4. ✅ Muntazam yangilanishlar
5. ✅ Loglarni kuzating

## Muhim portlar:
- 22: SSH
- 80: HTTP
- 443: HTTPS
- 3306: MySQL
- 5432: PostgreSQL`,
          category: "security",
          tags: ["Firewall", "iptables", "Security"],
          important: true,
          user_id: user.id
        }
      ];

      console.log('PUT /api/notes?action=seed - Seeding default notes for user:', user.id);
      console.log('PUT /api/notes?action=seed - Notes count:', defaultNotes.length);

      const { data, error } = await supabase
        .from('portfolio_notes_rows')
        .insert(defaultNotes)
        .select('id, title, category, created_at');

      if (error) {
        console.error('PUT /api/notes?action=seed - Error:', error);
        console.error('PUT /api/notes?action=seed - Error code:', error.code);
        console.error('PUT /api/notes?action=seed - Error message:', error.message);
        throw error;
      }

      console.log('PUT /api/notes?action=seed - Successfully seeded notes:', data?.length);

      return NextResponse.json({
        success: true,
        message: `${data?.length || 0} ta qayd muvaffaqiyatli yuklandi`,
        count: data?.length || 0,
        data
      });
    }

    // Oddiy UPDATE operatsiyasi
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, content, category, tags, important } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID majburiy' },
        { status: 400 }
      );
    }

    // Foydalanuvchi o'z qaydini yangilay oladi yoki admin barcha qaydlarni yangilay oladi
    const { data: noteData } = await supabase
      .from('portfolio_notes_rows')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!noteData) {
      return NextResponse.json(
        { success: false, error: 'Qayd topilmadi' },
        { status: 404 }
      );
    }

    // Admin tekshirish
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';
    const isOwner = noteData.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Sizda bu qaydni yangilash huquqi yo\'q' },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (important !== undefined) updateData.important = important;

    const { data, error } = await supabase
      .from('portfolio_notes_rows')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('PUT notes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE - Qaydni o'chirish
export async function DELETE(request: Request) {
  try {
    const { supabase, user } = await createAuthenticatedClient(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Iltimos, tizimga kirib qaytib keling.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID majburiy' },
        { status: 400 }
      );
    }

    // Foydalanuvchi o'z qaydini o'chira oladi yoki admin barcha qaydlarni o'chira oladi
    const { data: noteData } = await supabase
      .from('portfolio_notes_rows')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!noteData) {
      return NextResponse.json(
        { success: false, error: 'Qayd topilmadi' },
        { status: 404 }
      );
    }

    // Admin tekshirish
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profileData?.role === 'admin' || profileData?.role === 'super_admin';
    const isOwner = noteData.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Sizda bu qaydni o\'chirish huquqi yo\'q' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('portfolio_notes_rows')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE notes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete note' },
      { status: 500 }
    );
  }
}


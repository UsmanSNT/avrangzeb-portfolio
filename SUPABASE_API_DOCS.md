# 📚 Supabase API & Database Documentation

## 🔑 Ulanish ma'lumotlari

```
SUPABASE_URL: https://yooppxqlzftifwbanhhv.supabase.co
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb3BweHFsemZ0aWZ3YmFuaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Njg4ODYsImV4cCI6MjA4MDA0NDg4Nn0.iHvrqFE7Vb_UmOvRAjtfAFaZqZoC1Z7RgmSuLbxjfO4
```

---

## 📊 Database Schema (Jadvallar)

### 1️⃣ `user_profiles` - Foydalanuvchi profillari

| Ustun | Turi | Tavsif |
|-------|------|--------|
| `id` | UUID | Asosiy kalit (auth.users bilan bog'langan) |
| `email` | TEXT | Email manzil |
| `full_name` | TEXT | To'liq ism |
| `avatar_url` | TEXT | Profil rasmi URL |
| `role` | TEXT | Rol ('admin' yoki 'user') |
| `created_at` | TIMESTAMPTZ | Yaratilgan vaqt |
| `updated_at` | TIMESTAMPTZ | Yangilangan vaqt |

---

### 2️⃣ `portfolio_book_quotes` - Kitob iqtiboslari

| Ustun | Turi | Tavsif |
|-------|------|--------|
| `id` | INTEGER | Asosiy kalit (avtomatik) |
| `book_title` | VARCHAR | Kitob nomi |
| `author` | VARCHAR | Muallif ismi |
| `quote` | TEXT | Iqtibos matni |
| `image_url` | TEXT | Kitob rasmi URL |
| `likes` | INTEGER | Like soni (default: 0) |
| `dislikes` | INTEGER | Dislike soni (default: 0) |
| `created_at` | TIMESTAMPTZ | Yaratilgan vaqt |
| `updated_at` | TIMESTAMPTZ | Yangilangan vaqt |

---

### 3️⃣ `portfolio_gallery` - Galereya

| Ustun | Turi | Tavsif |
|-------|------|--------|
| `id` | INTEGER | Asosiy kalit (avtomatik) |
| `title` | VARCHAR | Sarlavha |
| `description` | TEXT | Tavsif |
| `category` | VARCHAR | Kategoriya ('certificate', 'event', 'memory', 'achievement', 'other') |
| `images` | TEXT[] | Rasmlar URL massivi (1-5 ta) |
| `date` | DATE | Sana |
| `created_at` | TIMESTAMPTZ | Yaratilgan vaqt |
| `updated_at` | TIMESTAMPTZ | Yangilangan vaqt |

---

### 4️⃣ `portfolio_notes` - Qaydlar

| Ustun | Turi | Tavsif |
|-------|------|--------|
| `id` | INTEGER | Asosiy kalit (avtomatik) |
| `title` | VARCHAR | Sarlavha |
| `content` | TEXT | Qayd matni |
| `category` | VARCHAR | Kategoriya (default: 'general') |
| `tags` | TEXT[] | Teglar massivi |
| `important` | BOOLEAN | Muhimlik (default: false) |
| `created_at` | TIMESTAMPTZ | Yaratilgan vaqt |
| `updated_at` | TIMESTAMPTZ | Yangilangan vaqt |

---

## 🌐 REST API Endpoints

### Base URL
```
https://yooppxqlzftifwbanhhv.supabase.co/rest/v1
```

### Headers (barcha so'rovlar uchun)
```
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: application/json
```

---

## 📖 Book Quotes API

### Barcha iqtiboslarni olish
```http
GET /rest/v1/portfolio_book_quotes?select=*&order=created_at.desc
```

### Yangi iqtibos qo'shish
```http
POST /rest/v1/portfolio_book_quotes
Content-Type: application/json

{
  "book_title": "Atomic Habits",
  "author": "James Clear",
  "quote": "Har kuni 1% yaxshilanish yil oxirida 37 marta yaxshilanishga olib keladi.",
  "image_url": "https://example.com/image.jpg"
}
```

### Iqtibosni yangilash
```http
PATCH /rest/v1/portfolio_book_quotes?id=eq.1
Content-Type: application/json

{
  "likes": 5
}
```

### Iqtibosni o'chirish
```http
DELETE /rest/v1/portfolio_book_quotes?id=eq.1
```

---

## 🖼️ Gallery API

### Barcha galereya elementlarini olish
```http
GET /rest/v1/portfolio_gallery?select=*&order=created_at.desc
```

### Yangi galereya elementi qo'shish
```http
POST /rest/v1/portfolio_gallery
Content-Type: application/json

{
  "title": "CCNA Sertifikati",
  "description": "Cisco sertifikatini oldim",
  "category": "certificate",
  "images": ["https://storage.url/image1.jpg", "https://storage.url/image2.jpg"]
}
```

### Galereya elementini yangilash
```http
PATCH /rest/v1/portfolio_gallery?id=eq.1
Content-Type: application/json

{
  "title": "Yangilangan sarlavha"
}
```

### Galereya elementini o'chirish
```http
DELETE /rest/v1/portfolio_gallery?id=eq.1
```

---

## 📝 Notes API

### Barcha qaydlarni olish
```http
GET /rest/v1/portfolio_notes?select=*&order=created_at.desc
```

### Yangi qayd qo'shish
```http
POST /rest/v1/portfolio_notes
Content-Type: application/json

{
  "title": "Docker o'rganish",
  "content": "# Docker asoslari\n\nBugun Docker haqida...",
  "category": "learning",
  "tags": ["docker", "devops"],
  "important": true
}
```

### Qaydni yangilash
```http
PATCH /rest/v1/portfolio_notes?id=eq.1
Content-Type: application/json

{
  "content": "Yangilangan matn"
}
```

### Qaydni o'chirish
```http
DELETE /rest/v1/portfolio_notes?id=eq.1
```

---

## 👤 User Profiles API

### Foydalanuvchi profilini olish
```http
GET /rest/v1/user_profiles?id=eq.<user_id>&select=*
```

### Profilni yangilash
```http
PATCH /rest/v1/user_profiles?id=eq.<user_id>
Content-Type: application/json

{
  "full_name": "Yangi ism",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

---

## 🔐 Authentication API

### Base URL
```
https://yooppxqlzftifwbanhhv.supabase.co/auth/v1
```

### Ro'yxatdan o'tish (Sign Up)
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "data": {
    "full_name": "Ism Familiya"
  }
}
```

### Kirish (Sign In)
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Javob:**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Chiqish (Sign Out)
```http
POST /auth/v1/logout
Authorization: Bearer <access_token>
```

### Joriy foydalanuvchini olish
```http
GET /auth/v1/user
Authorization: Bearer <access_token>
```

---

## 📦 Storage API (Rasmlar)

### Base URL
```
https://yooppxqlzftifwbanhhv.supabase.co/storage/v1
```

### Rasm yuklash
```http
POST /storage/v1/object/portfolio-images/<folder>/<filename>
Authorization: Bearer <SUPABASE_ANON_KEY>
Content-Type: image/jpeg

<binary image data>
```

### Rasm URL olish
```
https://yooppxqlzftifwbanhhv.supabase.co/storage/v1/object/public/portfolio-images/<path>
```

### Rasmni o'chirish
```http
DELETE /storage/v1/object/portfolio-images/<path>
Authorization: Bearer <SUPABASE_ANON_KEY>
```

---

## 💻 JavaScript/TypeScript bilan ishlatish

### Supabase Client o'rnatish
```bash
npm install @supabase/supabase-js
```

### Client yaratish
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://yooppxqlzftifwbanhhv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb3BweHFsemZ0aWZ3YmFuaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Njg4ODYsImV4cCI6MjA4MDA0NDg4Nn0.iHvrqFE7Vb_UmOvRAjtfAFaZqZoC1Z7RgmSuLbxjfO4'
)
```

### Misol: Ma'lumotlarni olish
```typescript
// Barcha iqtiboslar
const { data, error } = await supabase
  .from('portfolio_book_quotes')
  .select('*')
  .order('created_at', { ascending: false })

// Bitta iqtibos
const { data, error } = await supabase
  .from('portfolio_book_quotes')
  .select('*')
  .eq('id', 1)
  .single()
```

### Misol: Ma'lumot qo'shish
```typescript
const { data, error } = await supabase
  .from('portfolio_book_quotes')
  .insert([
    {
      book_title: 'Atomic Habits',
      author: 'James Clear',
      quote: 'Maqsad emas, tizim muhim.'
    }
  ])
  .select()
```

### Misol: Ma'lumotni yangilash
```typescript
const { data, error } = await supabase
  .from('portfolio_book_quotes')
  .update({ likes: 10 })
  .eq('id', 1)
  .select()
```

### Misol: Ma'lumotni o'chirish
```typescript
const { error } = await supabase
  .from('portfolio_book_quotes')
  .delete()
  .eq('id', 1)
```

### Misol: Rasm yuklash
```typescript
const file = event.target.files[0]
const fileName = `${Date.now()}-${file.name}`

const { data, error } = await supabase.storage
  .from('portfolio-images')
  .upload(`gallery/${fileName}`, file)

// Public URL olish
const { data: urlData } = supabase.storage
  .from('portfolio-images')
  .getPublicUrl(`gallery/${fileName}`)

console.log(urlData.publicUrl)
```

### Misol: Autentifikatsiya
```typescript
// Ro'yxatdan o'tish
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'Ism Familiya' }
  }
})

// Kirish
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Chiqish
await supabase.auth.signOut()

// Joriy foydalanuvchi
const { data: { user } } = await supabase.auth.getUser()
```

---

## 🔗 Next.js API Routes (Loyihadagi)

| Endpoint | Method | Tavsif |
|----------|--------|--------|
| `/api/book-quotes` | GET | Barcha iqtiboslar |
| `/api/book-quotes` | POST | Yangi iqtibos |
| `/api/book-quotes` | PUT | Iqtibosni yangilash |
| `/api/book-quotes?id=<id>` | DELETE | Iqtibosni o'chirish |
| `/api/gallery` | GET | Barcha galereya |
| `/api/gallery` | POST | Yangi galereya |
| `/api/gallery` | PUT | Galereyani yangilash |
| `/api/gallery?id=<id>` | DELETE | Galereyani o'chirish |
| `/api/notes` | GET | Barcha qaydlar |
| `/api/notes` | POST | Yangi qayd |
| `/api/notes` | PUT | Qaydni yangilash |
| `/api/notes?id=<id>` | DELETE | Qaydni o'chirish |
| `/api/auth/profile?userId=<id>` | GET | Foydalanuvchi profili |
| `/api/auth/profile` | PUT | Profilni yangilash |
| `/api/upload` | POST | Rasm yuklash |
| `/api/upload?path=<path>` | DELETE | Rasmni o'chirish |

---

## 📱 cURL Misollar

### Barcha iqtiboslarni olish
```bash
curl -X GET "https://yooppxqlzftifwbanhhv.supabase.co/rest/v1/portfolio_book_quotes?select=*" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb3BweHFsemZ0aWZ3YmFuaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Njg4ODYsImV4cCI6MjA4MDA0NDg4Nn0.iHvrqFE7Vb_UmOvRAjtfAFaZqZoC1Z7RgmSuLbxjfO4" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb3BweHFsemZ0aWZ3YmFuaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Njg4ODYsImV4cCI6MjA4MDA0NDg4Nn0.iHvrqFE7Vb_UmOvRAjtfAFaZqZoC1Z7RgmSuLbxjfO4"
```

### Yangi iqtibos qo'shish
```bash
curl -X POST "https://yooppxqlzftifwbanhhv.supabase.co/rest/v1/portfolio_book_quotes" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb3BweHFsemZ0aWZ3YmFuaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Njg4ODYsImV4cCI6MjA4MDA0NDg4Nn0.iHvrqFE7Vb_UmOvRAjtfAFaZqZoC1Z7RgmSuLbxjfO4" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb3BweHFsemZ0aWZ3YmFuaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Njg4ODYsImV4cCI6MjA4MDA0NDg4Nn0.iHvrqFE7Vb_UmOvRAjtfAFaZqZoC1Z7RgmSuLbxjfO4" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"book_title":"Test Book","author":"Test Author","quote":"Test quote"}'
```

---

## 🛡️ Admin Email
```
avrangzebabdujalilov@gmail.com
```

Bu email bilan ro'yxatdan o'tgan foydalanuvchi avtomatik ravishda **admin** rolini oladi.

---

## 📞 Yordam

Savollar bo'lsa, Supabase Dashboard'dan tekshiring:
- https://supabase.com/dashboard/project/yooppxqlzftifwbanhhv

